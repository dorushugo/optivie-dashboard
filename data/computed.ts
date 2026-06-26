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
  donneesMensuelles,
  resiliationsParMois,
  courtierParMois,
} from "./optivie";
import type { MoisData } from "./optivie";

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

export type PeriodFilter = "annuel" | string; // "annuel" ou "2025-01", "2025-02", etc.

export function getMoisList(): { value: string; label: string }[] {
  const moisNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
  return donneesMensuelles.map((d) => {
    const [year, month] = d.mois.split("-");
    const idx = parseInt(month) - 1;
    return { value: d.mois, label: `${moisNames[idx]} ${year}` };
  });
}

function getMonthsForPeriod(period: PeriodFilter): string[] {
  if (period === "annuel") {
    return Object.keys(leadsParMois);
  }
  if (period.startsWith("T")) {
    const quarter = parseInt(period[1]);
    const startMonth = (quarter - 1) * 3 + 1;
    return [0, 1, 2].map(i => `2025-${String(startMonth + i).padStart(2, "0")}`);
  }
  return [period];
}

function aggregateMonths(months: string[]): MoisData {
  const data = donneesMensuelles.filter(d => months.includes(d.mois));
  if (data.length === 0) {
    return { mois: "N/A", leads: 0, convertis: 0, tauxConversion: 0, resiliations: 0, horsSLA: 0, relancesDues: 0, contratsNets: 0 };
  }
  const leads = data.reduce((s, d) => s + d.leads, 0);
  const convertis = data.reduce((s, d) => s + d.convertis, 0);
  const resiliations = data.reduce((s, d) => s + d.resiliations, 0);
  const horsSLA = data.reduce((s, d) => s + d.horsSLA, 0);
  const relancesDues = data.reduce((s, d) => s + d.relancesDues, 0);
  const contratsNets = data.reduce((s, d) => s + d.contratsNets, 0);
  return {
    mois: months.length === 1 ? months[0] : "aggregated",
    leads,
    convertis,
    tauxConversion: leads > 0 ? Math.round((convertis / leads) * 1000) / 10 : 0,
    resiliations,
    horsSLA,
    relancesDues,
    contratsNets,
  };
}

export type ComputedKPIs = ReturnType<typeof computeKPIs>;

export function computeKPIs(period: PeriodFilter = "annuel") {
  const months = getMonthsForPeriod(period);
  const agg = aggregateMonths(months);
  const isAnnual = period === "annuel";

  const totalContrats = rawCourtiers.reduce((sum, c) => sum + c.contrats, 0);

  const totalLeads = agg.leads;
  const totalConvertis = agg.convertis;
  const tauxConversion = totalLeads > 0 ? (totalConvertis / totalLeads) * 100 : 0;

  const horsSLAPeriod = agg.horsSLA;
  const tauxContactSLA = totalLeads > 0 ? ((totalLeads - horsSLAPeriod) / totalLeads) * 100 : 100;

  const relancesDuesPeriod = agg.relancesDues;
  const leadsSansRelancePeriod = isAnnual
    ? (impactRelances.find((r) => r.relances === "0 relance")?.leads ?? 0)
    : Math.round(totalLeads * 0.73);
  const tauxRelance = totalLeads > 0 ? ((totalLeads - leadsSansRelancePeriod) / totalLeads) * 100 : 0;

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
  const totalResiliationsAnnuel = motifsResiliations.reduce((sum, m) => sum + m.nombre, 0);
  const totalResiliations = agg.resiliations;
  const tauxMotifsRenseignes = ((totalResiliationsAnnuel - motifsNonRenseignes) / totalResiliationsAnnuel) * 100;

  const progressionObjectif = (totalContrats / kpiGlobal.objectifContrats) * 100;

  const resParMois = months
    .map(m => resiliationsParMois[m])
    .filter(Boolean);
  const commissionsPerdues = isAnnual
    ? kpiGlobal.commissionPerdue
    : resParMois.reduce((s, r) => s + r.commissionPerdue, 0);

  const croissanceNette = isAnnual
    ? kpiGlobal.croissanceNette
    : agg.contratsNets / months.length;

  const leadsMoyenMensuel = isAnnual
    ? kpiGlobal.leadsMensuels
    : Math.round(agg.leads / months.length);

  // Évolution vs mois précédent
  let evolution: { leads: number | null; conversion: number | null; resiliations: number | null } = {
    leads: null, conversion: null, resiliations: null
  };
  if (months.length === 1) {
    const currentIdx = donneesMensuelles.findIndex(d => d.mois === months[0]);
    if (currentIdx > 0) {
      const prev = donneesMensuelles[currentIdx - 1];
      const curr = donneesMensuelles[currentIdx];
      evolution = {
        leads: prev.leads > 0 ? Math.round(((curr.leads - prev.leads) / prev.leads) * 100) : null,
        conversion: prev.tauxConversion > 0 ? Math.round((curr.tauxConversion - prev.tauxConversion) * 10) / 10 : null,
        resiliations: prev.resiliations > 0 ? Math.round(((curr.resiliations - prev.resiliations) / prev.resiliations) * 100) : null,
      };
    }
  }

  return {
    contratsActifs: totalContrats,
    objectifContrats: kpiGlobal.objectifContrats,
    progressionObjectif: Math.round(progressionObjectif * 10) / 10,
    totalLeads,
    leadsMoyenMensuel,
    totalConvertis,
    tauxConversion: Math.round(tauxConversion * 10) / 10,
    leadsHorsSLA: horsSLAPeriod,
    tauxContactSLA: Math.round(tauxContactSLA * 10) / 10,
    leadsSansRelance: leadsSansRelancePeriod,
    leadsAvecRelance: totalLeads - leadsSansRelancePeriod,
    tauxRelance: Math.round(tauxRelance * 10) / 10,
    totalCommissions,
    commissionsPerdue: commissionsPerdues,
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
    croissanceNette: Math.round(croissanceNette * 10) / 10,
    totalRelancesDues: relancesDuesPeriod,
    churnMoyen: Math.round(
      rawCourtiers.reduce((sum, c) => sum + c.churn * c.contrats, 0) / totalContrats * 10
    ) / 10,
    evolution,
    periodLabel: getPeriodLabel(period),
    isAnnual,
  };
}

function getPeriodLabel(period: PeriodFilter): string {
  if (period === "annuel") return "Année 2025";
  const moisNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
  if (period.startsWith("T")) {
    return `T${period[1]} 2025`;
  }
  const [year, month] = period.split("-");
  return `${moisNames[parseInt(month) - 1]} ${year}`;
}

export function getEvolutionData() {
  return donneesMensuelles.map(d => {
    const moisNames = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];
    const idx = parseInt(d.mois.split("-")[1]) - 1;
    return {
      mois: moisNames[idx],
      moisKey: d.mois,
      leads: d.leads,
      convertis: d.convertis,
      tauxConversion: d.tauxConversion,
      resiliations: d.resiliations,
      contratsNets: d.contratsNets,
    };
  });
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

export function computeCourtierPerformance(period: PeriodFilter = "annuel") {
  const months = getMonthsForPeriod(period);
  const isAnnual = period === "annuel";

  return rawCourtiers.map((c) => {
    if (isAnnual) {
      return {
        ...c,
        conversionAjustee: c.sourceDominante === "Recommandation"
          ? Math.round(c.tauxConversion * 0.6 * 10) / 10
          : c.tauxConversion,
        charge: c.leadsTraites > 500 ? "Surcharge" : c.leadsTraites > 250 ? "Élevée" : c.leadsTraites > 150 ? "Normale" : "Sous-charge",
        resiliations: resiliationsParCourtier.find(r => r.courtier === c.nom)?.resiliations ?? 0,
      };
    }

    const monthData = courtierParMois.filter(d => d.courtier === c.nom && months.includes(d.mois));
    const leadsTraites = monthData.reduce((s, d) => s + d.leadsTraites, 0);
    const convertis = monthData.reduce((s, d) => s + d.convertis, 0);
    const horsSLA = monthData.reduce((s, d) => s + d.horsSLA, 0);
    const relancesDues = monthData.reduce((s, d) => s + d.relancesDues, 0);
    const delaiMedian = monthData.length > 0 ? monthData[0].delaiMedian : c.delaiMedian;
    const tauxConversion = leadsTraites > 0 ? Math.round((convertis / leadsTraites) * 1000) / 10 : 0;

    return {
      ...c,
      leadsTraites,
      horsSLA,
      relancesDues,
      delaiMedian,
      tauxConversion,
      conversionAjustee: c.sourceDominante === "Recommandation"
        ? Math.round(tauxConversion * 0.6 * 10) / 10
        : tauxConversion,
      charge: leadsTraites > (months.length * 42) ? "Surcharge" : leadsTraites > (months.length * 21) ? "Élevée" : leadsTraites > (months.length * 13) ? "Normale" : "Sous-charge",
      resiliations: Math.round((resiliationsParCourtier.find(r => r.courtier === c.nom)?.resiliations ?? 0) * months.length / 12),
    };
  });
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
  donneesMensuelles,
  courtierParMois,
};
