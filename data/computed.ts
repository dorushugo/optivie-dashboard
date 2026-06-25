import {
  courtiers as rawCourtiers,
  conversionDelai,
  impactRelances,
  canaux,
  evolutionCPL,
  motifsResiliations,
  resiliationsParCourtier,
  funnel,
  kpiGlobal,
  kpisCibles,
  scenarios,
} from "./optivie";

// Types
export type LeadPriority = "critique" | "haute" | "moyenne" | "basse";
export type LeadStatus = "hors_sla" | "sla_proche" | "ok";
export type ActionType = "contacter" | "relancer" | "reassigner" | "migrer_crm" | "qualifier_motif" | "retention";

export type PriorityAction = {
  id: string;
  type: ActionType;
  label: string;
  target: string;
  courtier: string;
  priority: LeadPriority;
  impact: string;
  delai?: string;
};

// Computed KPIs
export function computeKPIs() {
  const totalContrats = rawCourtiers.reduce((sum, c) => sum + c.contrats, 0);
  const totalLeads = kpiGlobal.leadsAnnuels;
  const totalConvertis = funnel.find((f) => f.etape === "Convertis")?.valeur ?? 0;
  const tauxConversion = totalLeads > 0 ? (totalConvertis / totalLeads) * 100 : 0;

  const leadsHorsSLA = conversionDelai
    .filter((d) => d.tranche !== "1–4h")
    .reduce((sum, d) => sum + d.leads, 0);
  const leadsTotal = conversionDelai.reduce((sum, d) => sum + d.leads, 0);
  const tauxContactSLA = leadsTotal > 0 ? ((leadsTotal - leadsHorsSLA) / leadsTotal) * 100 : 0;

  const leadsAvecRelance = impactRelances
    .filter((r) => r.relances !== "0 relance")
    .reduce((sum, r) => sum + r.leads, 0);
  const leadsSansRelance = impactRelances.find((r) => r.relances === "0 relance")?.leads ?? 0;
  const tauxRelance = totalLeads > 0 ? (leadsAvecRelance / totalLeads) * 100 : 0;

  const totalCommissions = rawCourtiers.reduce((sum, c) => sum + c.commission, 0);
  const commissionsPerdue = kpiGlobal.commissionPerdue;

  const tauxCRM = rawCourtiers.reduce((sum, c) => sum + c.contrats * (c.crmSaisie / 100), 0) / totalContrats * 100;
  const contratsHorsCRM = rawCourtiers.reduce((sum, c) => sum + c.contrats * (1 - c.crmSaisie / 100), 0);

  const budgetTotal = canaux.reduce((sum, c) => sum + c.budget, 0);
  const contratsComparateurs = canaux
    .filter((c) => c.canal !== "Recommandations" && c.canal !== "Prospection directe")
    .reduce((sum, c) => sum + Math.round(c.volume * c.tauxConversion / 100), 0);
  const cacGlobal = contratsComparateurs > 0 ? Math.round(budgetTotal / contratsComparateurs) : 0;

  const motifsNonRenseignes = motifsResiliations
    .filter((m) => m.motif === "Non renseigné" || m.motif === "Non précisé")
    .reduce((sum, m) => sum + m.nombre, 0);
  const totalResiliations = motifsResiliations.reduce((sum, m) => sum + m.nombre, 0);
  const tauxMotifsRenseignes = totalResiliations > 0 ? ((totalResiliations - motifsNonRenseignes) / totalResiliations) * 100 : 0;

  const resiliationsEvitables = motifsResiliations
    .filter((m) => m.evitable)
    .reduce((sum, m) => sum + m.nombre, 0);

  const progressionObjectif = (totalContrats / kpiGlobal.objectifContrats) * 100;

  return {
    contratsActifs: totalContrats,
    objectifContrats: kpiGlobal.objectifContrats,
    progressionObjectif: Math.round(progressionObjectif * 10) / 10,
    totalLeads,
    leadsMensuels: kpiGlobal.leadsMensuels,
    totalConvertis,
    tauxConversion: Math.round(tauxConversion * 10) / 10,
    leadsHorsSLA,
    tauxContactSLA: Math.round(tauxContactSLA * 10) / 10,
    leadsSansRelance,
    leadsAvecRelance,
    tauxRelance: Math.round(tauxRelance * 10) / 10,
    totalCommissions,
    commissionsPerdue,
    commissionsARisque: Math.round(resiliationsEvitables * (commissionsPerdue / totalResiliations)),
    tauxCRM: Math.round(tauxCRM * 10) / 10,
    contratsHorsCRM: Math.round(contratsHorsCRM),
    budgetTotal,
    cacGlobal,
    totalResiliations,
    motifsNonRenseignes,
    tauxMotifsRenseignes: Math.round(tauxMotifsRenseignes * 10) / 10,
    resiliationsEvitables,
    croissanceNette: kpiGlobal.croissanceNette,
    churnMoyen: Math.round(
      rawCourtiers.reduce((sum, c) => sum + c.churn * c.contrats, 0) / totalContrats * 10
    ) / 10,
  };
}

// Generate priority actions for today
export function computePriorityActions(): PriorityAction[] {
  const actions: PriorityAction[] = [];

  // Leads hors SLA (based on real proportions)
  const horsSLAPct = (conversionDelai[2].leads + conversionDelai[3].leads) / 
    conversionDelai.reduce((s, d) => s + d.leads, 0);
  const mensuelHorsSLA = Math.round(kpiGlobal.leadsMensuels * horsSLAPct);

  for (let i = 0; i < Math.min(mensuelHorsSLA, 8); i++) {
    const courtierNames = rawCourtiers.filter(c => c.delaiMedian > 12).map(c => c.nom);
    const courtier = courtierNames[i % courtierNames.length];
    actions.push({
      id: `sla-${i}`,
      type: "contacter",
      label: `Lead en attente depuis ${12 + i * 4}h`,
      target: `Lead #${2060 + i}`,
      courtier,
      priority: i < 3 ? "critique" : "haute",
      impact: "Conversion chute de 50% a 11% apres 12h",
      delai: `${12 + i * 4}h sans contact`,
    });
  }

  // Relances dues
  const relancesDues = Math.round(kpiGlobal.leadsMensuels * 0.73 * 0.3);
  for (let i = 0; i < Math.min(relancesDues, 5); i++) {
    actions.push({
      id: `relance-${i}`,
      type: "relancer",
      label: `Relance J+${[1, 3, 3, 7, 7][i]} a envoyer`,
      target: `Lead #${2000 + i * 7}`,
      courtier: rawCourtiers[i % rawCourtiers.length].nom,
      priority: i < 2 ? "haute" : "moyenne",
      impact: "Taux passe de 15% a 39% avec 2 relances",
    });
  }

  // Contrats hors CRM (Mehdi)
  actions.push({
    id: "crm-mehdi",
    type: "migrer_crm",
    label: "504 contrats non saisis dans le CRM",
    target: "Portefeuille Mehdi",
    courtier: "Mehdi",
    priority: "critique",
    impact: "78 068 EUR de commissions a risque si depart",
  });

  // Résiliations sans motif
  actions.push({
    id: "motif-res",
    type: "qualifier_motif",
    label: `${motifsResiliations.filter(m => m.motif === "Non renseigné" || m.motif === "Non précisé").reduce((s, m) => s + m.nombre, 0)} resiliations sans motif qualifie`,
    target: "Dossiers resiliation",
    courtier: "Tous",
    priority: "haute",
    impact: "Impossible d'agir sans comprendre les causes",
  });

  // Rétention proactive
  const evitables = motifsResiliations.filter(m => m.evitable).reduce((s, m) => s + m.nombre, 0);
  actions.push({
    id: "retention",
    type: "retention",
    label: `${evitables} clients a risque de resiliation evitable`,
    target: "Clients pre-echeance",
    courtier: "Tous",
    priority: "haute",
    impact: `Potentiel de retention 25-40% soit ~${Math.round(evitables * 0.3)} clients preserves`,
  });

  return actions.sort((a, b) => {
    const prio = { critique: 0, haute: 1, moyenne: 2, basse: 3 };
    return prio[a.priority] - prio[b.priority];
  });
}

// Courtier performance data for table
export function computeCourtierPerformance() {
  return rawCourtiers.map((c) => {
    const leadsHorsSLACourtier = c.delaiMedian > 4 ? Math.round(c.leadsTraites * 0.6) : Math.round(c.leadsTraites * 0.1);
    const relancesDues = Math.round(c.leadsTraites * 0.73 * (c.tauxConversion < 20 ? 0.4 : 0.2));
    const charge = c.leadsTraites > 400 ? "Surcharge" : c.leadsTraites > 200 ? "Normale" : "Sous-charge";

    return {
      ...c,
      leadsHorsSLA: leadsHorsSLACourtier,
      relancesDues,
      charge,
      conversionAjustee: c.sourceDominante === "Recommandation"
        ? Math.round(c.tauxConversion * 0.6 * 10) / 10
        : c.tauxConversion,
      resiliations: resiliationsParCourtier.find(r => r.courtier === c.nom)?.resiliations ?? 0,
    };
  });
}

// Generate simulated leads for the operations table
export function generateLeadsData() {
  const sources = ["Assurland", "LesFurets", "Recommandation", "Prospection directe"];
  const statuts = ["Nouveau", "Contacte", "Devis envoye", "En negociation", "Converti", "Perdu"];
  const produits = ["Complementaire sante", "Prevoyance", "Assurance vie", "Assurance emprunteur"];
  const courtierNames = rawCourtiers.map(c => c.nom);

  const leads = [];
  for (let i = 0; i < 50; i++) {
    const source = sources[Math.floor(Math.random() * sources.length)];
    const courtier = courtierNames[Math.floor(Math.random() * courtierNames.length)];
    const delai = Math.floor(Math.random() * 48) + 1;
    const relances = Math.floor(Math.random() * 4);
    const statut = statuts[Math.floor(Math.random() * statuts.length)];
    const jour = Math.floor(Math.random() * 25) + 1;

    leads.push({
      id: `OPT${String(2060 + i).padStart(4, "0")}`,
      date: `${String(jour).padStart(2, "0")}/06/2025`,
      source,
      courtier,
      produit: produits[Math.floor(Math.random() * produits.length)],
      delaiContact: delai,
      statutSLA: delai <= 4 ? "ok" : delai <= 12 ? "proche" : "hors_sla",
      relances,
      statut,
      priorite: delai > 12 && relances === 0 ? "critique" : delai > 4 ? "haute" : "normale",
      prochainAction: relances === 0 ? "Premier contact" : `Relance ${relances + 1}`,
    });
  }
  return leads;
}

// Generate simulated resiliation risk clients
export function generateResiliationRiskClients() {
  const courtierNames = rawCourtiers.map(c => c.nom);
  const motifs = ["Hausse de prime", "Offre concurrente", "Insatisfaction", "Echeance proche", "Impaye"];
  const clients = [];

  for (let i = 0; i < 20; i++) {
    const courtier = courtierNames[Math.floor(Math.random() * courtierNames.length)];
    const commission = Math.floor(Math.random() * 300) + 100;
    const joursAvantEcheance = Math.floor(Math.random() * 60) - 10;

    clients.push({
      id: `C${String(1201 + i).padStart(4, "0")}`,
      client: `Client ${i + 1}`,
      courtier,
      echeance: joursAvantEcheance > 0 ? `J-${joursAvantEcheance}` : `J+${Math.abs(joursAvantEcheance)}`,
      motifProbable: motifs[Math.floor(Math.random() * motifs.length)],
      commission,
      risque: joursAvantEcheance < 15 ? "critique" : joursAvantEcheance < 30 ? "eleve" : "modere",
      actionRecommandee: joursAvantEcheance < 7 ? "Appel urgent" : "Relance proactive",
      contacte: Math.random() > 0.7,
    });
  }
  return clients.sort((a, b) => {
    const r = { critique: 0, eleve: 1, modere: 2 };
    return (r[a.risque as keyof typeof r] ?? 2) - (r[b.risque as keyof typeof r] ?? 2);
  });
}

export { rawCourtiers as courtiers, conversionDelai, impactRelances, canaux, evolutionCPL, motifsResiliations, funnel, kpisCibles, scenarios, resiliationsParCourtier };
