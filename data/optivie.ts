export const kpiGlobal = {
  contratsActifs: 1200,
  objectifContrats: 1500,
  leadsAnnuels: 2059,
  leadsMensuels: 172,
  tauxConversion: 20.2,
  commissionRecurrente: 182170,
  croissanceNette: 22,
  objectifMois: 18,
  resiliationsAnnuelles: 216,
  commissionPerdue: 56630,
};

export const courtiers = [
  { nom: "Mehdi", contrats: 504, crmSaisie: 0, delaiMedian: 5, tauxConversion: 57.1, churn: 18.1, statut: "critique" },
  { nom: "Sonia", contrats: 210, crmSaisie: 100, delaiMedian: 8, tauxConversion: 39.6, churn: null, statut: "bon" },
  { nom: "Axel", contrats: 198, crmSaisie: 100, delaiMedian: 15, tauxConversion: 14.0, churn: null, statut: "alerte" },
  { nom: "Clara", contrats: 176, crmSaisie: 100, delaiMedian: 23, tauxConversion: 8.0, churn: null, statut: "alerte" },
  { nom: "Romain", contrats: 112, crmSaisie: 100, delaiMedian: 31, tauxConversion: 10.9, churn: null, statut: "alerte" },
] as const;

export const conversionDelai = [
  { tranche: "1–4h", leads: 143, convertis: 72, taux: 50.3 },
  { tranche: "4–12h", leads: 642, convertis: 206, taux: 32.1 },
  { tranche: "12–24h", leads: 735, convertis: 84, taux: 11.4 },
  { tranche: "24–48h", leads: 539, convertis: 53, taux: 9.8 },
];

export const impactRelances = [
  { relances: "0 relance", leads: 1496, taux: 15.0 },
  { relances: "1 relance", leads: 194, taux: 30.9 },
  { relances: "2 relances", leads: 168, taux: 39.3 },
  { relances: "3 relances", leads: 201, taux: 31.8 },
];

export const canaux = [
  { canal: "Comparateurs", volume: 1140, tauxConversion: 10.6, cac: 353, budget: 42730 },
  { canal: "Recommandations", volume: 617, tauxConversion: 42.6, cac: 0, budget: 0 },
  { canal: "Prospection directe", volume: 302, tauxConversion: 10.3, cac: null, budget: 0 },
];

export const evolutionCPL = [
  { mois: "Jan", assurland: 33, lesfurets: 30 },
  { mois: "Fév", assurland: 34.2, lesfurets: 31.1 },
  { mois: "Mar", assurland: 35.5, lesfurets: 32.3 },
  { mois: "Avr", assurland: 36.8, lesfurets: 33.4 },
  { mois: "Mai", assurland: 37.9, lesfurets: 34.5 },
  { mois: "Jun", assurland: 38.6, lesfurets: 35.2 },
  { mois: "Jul", assurland: 39.4, lesfurets: 35.9 },
  { mois: "Aoû", assurland: 40.1, lesfurets: 36.7 },
  { mois: "Sep", assurland: 40.9, lesfurets: 37.4 },
  { mois: "Oct", assurland: 41.8, lesfurets: 38.1 },
  { mois: "Nov", assurland: 42.5, lesfurets: 38.8 },
  { mois: "Déc", assurland: 43.3, lesfurets: 39.4 },
];

export const motifsResiliations = [
  { motif: "Non renseigné", nombre: 105, evitable: false },
  { motif: "Hausse de prime", nombre: 35, evitable: true },
  { motif: "Offre concurrente", nombre: 27, evitable: true },
  { motif: "Changement de situation", nombre: 24, evitable: false },
  { motif: "Insatisfaction service", nombre: 19, evitable: true },
  { motif: "Impayé automatique", nombre: 6, evitable: false },
];

export const funnel = [
  { etape: "Leads reçus", valeur: 2059, source: "Diagnostic" },
  { etape: "Avec ≥1 relance", valeur: 563, source: "Dataset relances" },
  { etape: "Décisions en cours", valeur: 649, source: "31,5% × 2059" },
  { etape: "Convertis", valeur: 416, source: "20,2% × 2059" },
];

export const scenarios = [
  {
    nom: "Minimal",
    solutions: "A + B",
    investissement: 3500,
    gainAnnuel: 76600,
    roi: 21.9,
    breakeven: 1,
    contratsNets: 32,
    delaiObjectif: 9,
  },
  {
    nom: "Cible",
    solutions: "A + B + C + D",
    investissement: 22500,
    gainAnnuel: 113780,
    roi: 5.1,
    breakeven: 2.4,
    contratsNets: 38,
    delaiObjectif: 8,
  },
  {
    nom: "Optimiste",
    solutions: "A + B + C + D + E",
    investissement: 25500,
    gainAnnuel: 148850,
    roi: 5.8,
    breakeven: 2,
    contratsNets: 42,
    delaiObjectif: 7,
  },
];

export const kpisCibles = {
  delaiContactM3: 4,
  delaiContactM6: 2,
  tauxContactSLAM3: 70,
  tauxContactSLAM6: 90,
  tauxRelanceM3: 70,
  tauxRelanceM6: 85,
  tauxSaisieCRMM3: 90,
  tauxSaisieCRMM6: 100,
  tauxConversionM3: 28,
  tauxConversionM6: 32,
  churnMensuelM3: 1.2,
  churnMensuelM6: 0.9,
  contratsNetsM6: 38,
  cacM3: 250,
  cacM6: 200,
};
