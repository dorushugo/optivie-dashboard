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
  contratsARisque as contratsARisqueData,
  leadsParMois,
} from "./optivie";

export type LeadPriority = "critique" | "haute" | "moyenne" | "basse";
export type ActionType = "contacter" | "relancer" | "reassigner" | "migrer_crm" | "qualifier_motif" | "retention";

export type PriorityAction = {
  id: string;
  type: ActionType;
  label: string;
  target: string;
  courtier: string;
  priority: LeadPriority;
  impact: string;
};

export function computeKPIs() {
  const totalContrats = rawCourtiers.reduce((sum, c) => sum + c.contrats, 0);
  const totalLeads = kpiGlobal.leadsAnnuels;
  const totalConvertis = 415;
  const tauxConversion = (totalConvertis / totalLeads) * 100;

  const leadsHorsSLA = rawCourtiers.reduce((sum, c) => sum + c.horsSLA, 0);
  const tauxContactSLA = ((totalLeads - leadsHorsSLA) / totalLeads) * 100;

  const leadsSansRelance = impactRelances.find((r) => r.relances === "0 relance")?.leads ?? 0;
  const leadsAvecRelance = totalLeads - leadsSansRelance;
  const tauxRelance = (leadsAvecRelance / totalLeads) * 100;

  const totalCommissions = rawCourtiers.reduce((sum, c) => sum + c.commission, 0);

  const tauxCRM = rawCourtiers.reduce((sum, c) => sum + c.contrats * (c.crmSaisie / 100), 0) / totalContrats * 100;
  const contratsHorsCRM = rawCourtiers.reduce((sum, c) => sum + c.contrats * (1 - c.crmSaisie / 100), 0);

  const budgetComparateurs = canaux
    .filter((c) => c.canal === "Assurland" || c.canal === "LesFurets")
    .reduce((sum, c) => sum + c.budget, 0);
  const convertisComparateurs = canaux
    .filter((c) => c.canal === "Assurland" || c.canal === "LesFurets")
    .reduce((sum, c) => sum + c.convertis, 0);
  const cacComparateurs = convertisComparateurs > 0 ? Math.round(budgetComparateurs / convertisComparateurs) : 0;

  const motifsNonRenseignes = motifsResiliations
    .filter((m) => m.motif === "Non renseigné" || m.motif === "Non précisé")
    .reduce((sum, m) => sum + m.nombre, 0);
  const totalResiliations = motifsResiliations.reduce((sum, m) => sum + m.nombre, 0);
  const tauxMotifsRenseignes = ((totalResiliations - motifsNonRenseignes) / totalResiliations) * 100;

  const progressionObjectif = (totalContrats / kpiGlobal.objectifContrats) * 100;

  const totalRelancesDues = rawCourtiers.reduce((sum, c) => sum + c.relancesDues, 0);

  return {
    contratsActifs: totalContrats,
    objectifContrats: kpiGlobal.objectifContrats,
    progressionObjectif: Math.round(progressionObjectif * 10) / 10,
    totalLeads,
    leadsMoyenMensuel: kpiGlobal.leadsMensuels,
    totalConvertis,
    tauxConversion: Math.round(tauxConversion * 10) / 10,
    leadsHorsSLA,
    tauxContactSLA: Math.round(tauxContactSLA * 10) / 10,
    leadsSansRelance,
    leadsAvecRelance,
    tauxRelance: Math.round(tauxRelance * 10) / 10,
    totalCommissions,
    commissionsPerdue: kpiGlobal.commissionPerdue,
    commissionsARisque: kpiGlobal.commissionsARisque,
    contratsARisque: kpiGlobal.contratsARisque,
    resiliationsEvitables: kpiGlobal.resiliationsEvitables,
    commissionEvitablePerdue: kpiGlobal.commissionEvitablePerdue,
    tauxCRM: Math.round(tauxCRM * 10) / 10,
    contratsHorsCRM: Math.round(contratsHorsCRM),
    budgetComparateurs,
    cacComparateurs,
    totalResiliations,
    motifsNonRenseignes,
    tauxMotifsRenseignes: Math.round(tauxMotifsRenseignes * 10) / 10,
    croissanceNette: kpiGlobal.croissanceNette,
    totalRelancesDues,
    churnMoyen: Math.round(
      rawCourtiers.reduce((sum, c) => sum + c.churn * c.contrats, 0) / totalContrats * 10
    ) / 10,
  };
}

export function computePriorityActions(): PriorityAction[] {
  const actions: PriorityAction[] = [];

  const courtiersHorsSLA = rawCourtiers.filter(c => c.horsSLA > 100);
  courtiersHorsSLA.forEach((c, i) => {
    actions.push({
      id: `sla-${i}`,
      type: "contacter",
      label: `${c.horsSLA} leads hors SLA (délai médian ${c.delaiMedian}h)`,
      target: `Portefeuille leads ${c.nom}`,
      courtier: c.nom,
      priority: c.horsSLA > 500 ? "critique" : "haute",
      impact: "La conversion chute de 50% à 11% après 12h de délai",
    });
  });

  const courtiersRelances = rawCourtiers.filter(c => c.relancesDues > 50);
  courtiersRelances.forEach((c, i) => {
    actions.push({
      id: `relance-${i}`,
      type: "relancer",
      label: `${c.relancesDues} leads "En cours" sans aucune relance`,
      target: `Leads en attente`,
      courtier: c.nom,
      priority: c.relancesDues > 150 ? "critique" : "haute",
      impact: "2 relances multiplient la conversion par 2,6 (de 15% à 39%)",
    });
  });

  actions.push({
    id: "crm-mehdi",
    type: "migrer_crm",
    label: "504 contrats non saisis dans le CRM",
    target: "Portefeuille Mehdi",
    courtier: "Mehdi",
    priority: "critique",
    impact: "78 068 € de commissions à risque en cas de départ",
  });

  const motifsInconnus = motifsResiliations
    .filter(m => m.motif === "Non renseigné" || m.motif === "Non précisé")
    .reduce((s, m) => s + m.nombre, 0);
  actions.push({
    id: "motif-res",
    type: "qualifier_motif",
    label: `${motifsInconnus} résiliations sans motif qualifié`,
    target: "Dossiers résiliation",
    courtier: "Tous",
    priority: "haute",
    impact: "Impossible d'agir en prévention sans comprendre les causes",
  });

  actions.push({
    id: "retention",
    type: "retention",
    label: `${kpiGlobal.contratsARisque} contrats à risque (${kpiGlobal.commissionsARisque.toLocaleString("fr-FR")} € à préserver)`,
    target: "Contrats statut 'À risque'",
    courtier: "Tous",
    priority: "haute",
    impact: "Potentiel de rétention 25 à 40% avec contact proactif",
  });

  return actions.sort((a, b) => {
    const prio = { critique: 0, haute: 1, moyenne: 2, basse: 3 };
    return prio[a.priority] - prio[b.priority];
  });
}

export function computeCourtierPerformance() {
  return rawCourtiers.map((c) => ({
    ...c,
    conversionAjustee: c.sourceDominante === "Recommandation"
      ? Math.round(c.tauxConversion * 0.6 * 10) / 10
      : c.tauxConversion,
    charge: c.leadsTraites > 500 ? "Surcharge" : c.leadsTraites > 250 ? "Élevée" : c.leadsTraites > 150 ? "Normale" : "Sous-charge",
    resiliations: resiliationsParCourtier.find(r => r.courtier === c.nom)?.resiliations ?? 0,
  }));
}

export function getContratsARisque() {
  return contratsARisqueData.map((c, i) => ({
    ...c,
    risque: c.commission > 180 ? "critique" : c.commission > 120 ? "élevé" : "modéré",
    actionRecommandee: i % 3 === 0 ? "Appel proactif" : i % 3 === 1 ? "Planifier relance" : "Créer tâche rétention",
    contacte: false,
  }));
}

export {
  rawCourtiers as courtiers,
  conversionDelai,
  impactRelances,
  canaux,
  evolutionCPL,
  motifsResiliations,
  funnel,
  kpisCibles,
  scenarios,
  resiliationsParCourtier,
  leadsParMois,
};
