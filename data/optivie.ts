export const kpiGlobal = {
  contratsActifs: 1200,
  contratsActifsStatut: { actif: 962, aRisque: 147, enRenouvellement: 91 },
  objectifContrats: 1500,
  leadsAnnuels: 2059,
  leadsMensuels: 172, // moyenne : 2059/12
  tauxConversion: 20.2, // 415/2059
  commissionRecurrente: 182170,
  croissanceNette: 16.6, // (415 - 216) / 12
  objectifMois: 18,
  resiliationsAnnuelles: 216,
  commissionPerdue: 56630,
  commissionsARisque: 21324, // contrats statut "À risque"
  contratsARisque: 147,
  resiliationsEvitables: 81,
  commissionEvitablePerdue: 21406,
};

export const leadsParMois: Record<string, number> = {
  "2025-01": 225,
  "2025-02": 180,
  "2025-03": 206,
  "2025-04": 189,
  "2025-05": 162,
  "2025-06": 153,
  "2025-07": 135,
  "2025-08": 125,
  "2025-09": 198,
  "2025-10": 180,
  "2025-11": 162,
  "2025-12": 144,
};

export type MoisData = {
  mois: string;
  leads: number;
  convertis: number;
  tauxConversion: number;
  resiliations: number;
  horsSLA: number;
  relancesDues: number;
  contratsNets: number;
};

export const donneesMensuelles: MoisData[] = [
  { mois: "2025-01", leads: 225, convertis: 47, tauxConversion: 20.9, resiliations: 22, horsSLA: 185, relancesDues: 48, contratsNets: 25 },
  { mois: "2025-02", leads: 180, convertis: 38, tauxConversion: 21.1, resiliations: 19, horsSLA: 149, relancesDues: 37, contratsNets: 19 },
  { mois: "2025-03", leads: 206, convertis: 43, tauxConversion: 20.9, resiliations: 21, horsSLA: 168, relancesDues: 43, contratsNets: 22 },
  { mois: "2025-04", leads: 189, convertis: 39, tauxConversion: 20.6, resiliations: 18, horsSLA: 156, relancesDues: 40, contratsNets: 21 },
  { mois: "2025-05", leads: 162, convertis: 32, tauxConversion: 19.8, resiliations: 17, horsSLA: 133, relancesDues: 34, contratsNets: 15 },
  { mois: "2025-06", leads: 153, convertis: 30, tauxConversion: 19.6, resiliations: 20, horsSLA: 126, relancesDues: 32, contratsNets: 10 },
  { mois: "2025-07", leads: 135, convertis: 26, tauxConversion: 19.3, resiliations: 16, horsSLA: 111, relancesDues: 28, contratsNets: 10 },
  { mois: "2025-08", leads: 125, convertis: 22, tauxConversion: 17.6, resiliations: 14, horsSLA: 104, relancesDues: 27, contratsNets: 8 },
  { mois: "2025-09", leads: 198, convertis: 41, tauxConversion: 20.7, resiliations: 19, horsSLA: 162, relancesDues: 42, contratsNets: 22 },
  { mois: "2025-10", leads: 180, convertis: 36, tauxConversion: 20.0, resiliations: 18, horsSLA: 148, relancesDues: 38, contratsNets: 18 },
  { mois: "2025-11", leads: 162, convertis: 33, tauxConversion: 20.4, resiliations: 17, horsSLA: 132, relancesDues: 34, contratsNets: 16 },
  { mois: "2025-12", leads: 144, convertis: 28, tauxConversion: 19.4, resiliations: 15, horsSLA: 118, relancesDues: 30, contratsNets: 13 },
];

export const resiliationsParMois: Record<string, { total: number; evitables: number; commissionPerdue: number }> = {
  "2025-01": { total: 22, evitables: 8, commissionPerdue: 5760 },
  "2025-02": { total: 19, evitables: 7, commissionPerdue: 4980 },
  "2025-03": { total: 21, evitables: 8, commissionPerdue: 5510 },
  "2025-04": { total: 18, evitables: 7, commissionPerdue: 4720 },
  "2025-05": { total: 17, evitables: 6, commissionPerdue: 4460 },
  "2025-06": { total: 20, evitables: 7, commissionPerdue: 5250 },
  "2025-07": { total: 16, evitables: 6, commissionPerdue: 4190 },
  "2025-08": { total: 14, evitables: 5, commissionPerdue: 3670 },
  "2025-09": { total: 19, evitables: 7, commissionPerdue: 4980 },
  "2025-10": { total: 18, evitables: 7, commissionPerdue: 4720 },
  "2025-11": { total: 17, evitables: 6, commissionPerdue: 4460 },
  "2025-12": { total: 15, evitables: 6, commissionPerdue: 3930 },
};

export const courtiers = [
  { nom: "Mehdi", contrats: 504, crmSaisie: 0, delaiMedian: 5, tauxConversion: 57.1, churn: 18.1, leadsTraites: 266, commission: 78068, partPortefeuille: 42, sourceDominante: "Recommandation", risque: "Portefeuille opaque, 0% CRM", statut: "critique", horsSLA: 149, relancesDues: 10 },
  { nom: "Sonia", contrats: 280, crmSaisie: 100, delaiMedian: 8, tauxConversion: 39.6, churn: 15.4, leadsTraites: 207, commission: 42540, partPortefeuille: 23.3, sourceDominante: "Recommandation", risque: "Surcharge, refuse des leads", statut: "bon", horsSLA: 181, relancesDues: 10 },
  { nom: "Axel", contrats: 190, crmSaisie: 100, delaiMedian: 15, tauxConversion: 14.0, churn: 22.1, leadsTraites: 637, commission: 28665, partPortefeuille: 15.8, sourceDominante: "Comparateurs", risque: "Leads faible qualité", statut: "alerte", horsSLA: 637, relancesDues: 137 },
  { nom: "Clara", contrats: 140, crmSaisie: 100, delaiMedian: 23, tauxConversion: 8.0, churn: 22.1, leadsTraites: 387, commission: 20138, partPortefeuille: 11.7, sourceDominante: "Comparateurs", risque: "Leads faible qualité", statut: "alerte", horsSLA: 387, relancesDues: 145 },
  { nom: "Romain", contrats: 86, crmSaisie: 100, delaiMedian: 31, tauxConversion: 10.9, churn: 10.5, leadsTraites: 562, commission: 12759, partPortefeuille: 7.2, sourceDominante: "Comparateurs", risque: "Faible volume", statut: "alerte", horsSLA: 562, relancesDues: 199 },
] as const;

export const conversionDelai = [
  { tranche: "0\u20134h", leads: 143, convertis: 72, taux: 50.3 },
  { tranche: "4\u201312h", leads: 642, convertis: 206, taux: 32.1 },
  { tranche: "12\u201324h", leads: 735, convertis: 84, taux: 11.4 },
  { tranche: "24\u201348h", leads: 539, convertis: 53, taux: 9.8 },
];

export const impactRelances = [
  { relances: "0 relance", leads: 1496, taux: 15.0 },
  { relances: "1 relance", leads: 194, taux: 30.9 },
  { relances: "2 relances", leads: 168, taux: 39.3 },
  { relances: "3 relances", leads: 201, taux: 31.8 },
];

export const canaux = [
  { canal: "Assurland", volume: 611, tauxConversion: 11.1, cplMoyen: 37.8, budget: 21840, convertis: 68 },
  { canal: "LesFurets", volume: 529, tauxConversion: 10.0, cplMoyen: 34.1, budget: 20890, convertis: 53 },
  { canal: "Recommandations", volume: 617, tauxConversion: 42.6, cplMoyen: 0, budget: 0, convertis: 263 },
  { canal: "Prospection directe", volume: 302, tauxConversion: 10.3, cplMoyen: 0, budget: 0, convertis: 31 },
];

export const evolutionCPL = [
  { mois: "Jan", assurland: 33.0, lesfurets: 30.0 },
  { mois: "Fév", assurland: 33.8, lesfurets: 30.7 },
  { mois: "Mar", assurland: 34.7, lesfurets: 31.5 },
  { mois: "Avr", assurland: 35.5, lesfurets: 32.3 },
  { mois: "Mai", assurland: 36.4, lesfurets: 33.1 },
  { mois: "Jun", assurland: 37.3, lesfurets: 33.9 },
  { mois: "Jul", assurland: 38.3, lesfurets: 34.8 },
  { mois: "Aoû", assurland: 39.2, lesfurets: 35.7 },
  { mois: "Sep", assurland: 40.2, lesfurets: 36.6 },
  { mois: "Oct", assurland: 41.2, lesfurets: 37.5 },
  { mois: "Nov", assurland: 42.2, lesfurets: 38.4 },
  { mois: "Déc", assurland: 43.3, lesfurets: 39.4 },
];

export const motifsResiliations = [
  { motif: "Non renseigné", nombre: 72, evitable: false },
  { motif: "Non précisé", nombre: 33, evitable: false },
  { motif: "Hausse de prime", nombre: 35, evitable: true },
  { motif: "Offre concurrente", nombre: 27, evitable: true },
  { motif: "Changement de situation", nombre: 24, evitable: false },
  { motif: "Insatisfaction service", nombre: 19, evitable: true },
  { motif: "Impayé automatique", nombre: 6, evitable: false },
];

export const resiliationsParCourtier = [
  { courtier: "Mehdi", resiliations: 91, taux: 18.1 },
  { courtier: "Sonia", resiliations: 43, taux: 15.4 },
  { courtier: "Axel", resiliations: 42, taux: 22.1 },
  { courtier: "Clara", resiliations: 31, taux: 22.1 },
  { courtier: "Romain", resiliations: 9, taux: 10.5 },
];

// Contrats à risque (extraits de la feuille Contrats, statut "À risque")
export const contratsARisque = [
  { id: "C0011", prenom: "Nicolas", nom: "Bernard", courtier: "Mehdi", produit: "Complémentaire santé", commission: 193, crm: false },
  { id: "C0019", prenom: "Amélie", nom: "Evrard", courtier: "Mehdi", produit: "Complémentaire santé", commission: 89, crm: false },
  { id: "C0020", prenom: "Pascal", nom: "Klein", courtier: "Mehdi", produit: "Assurance emprunteur", commission: 110, crm: false },
  { id: "C0021", prenom: "Nathalie", nom: "Thomas", courtier: "Mehdi", produit: "Assurance vie", commission: 224, crm: false },
  { id: "C0030", prenom: "François", nom: "Mercier", courtier: "Mehdi", produit: "Assurance vie", commission: 168, crm: false },
  { id: "C0032", prenom: "Quentin", nom: "Muller", courtier: "Mehdi", produit: "Complémentaire santé", commission: 219, crm: false },
  { id: "C0040", prenom: "Béatrice", nom: "Cohen", courtier: "Mehdi", produit: "Complémentaire santé", commission: 113, crm: false },
  { id: "C0059", prenom: "David", nom: "Garnier", courtier: "Mehdi", produit: "Assurance emprunteur", commission: 111, crm: false },
  { id: "C0062", prenom: "Valérie", nom: "Dupont", courtier: "Mehdi", produit: "Complémentaire santé", commission: 79, crm: false },
  { id: "C0065", prenom: "Ophélie", nom: "Tessier", courtier: "Mehdi", produit: "Assurance emprunteur", commission: 224, crm: false },
  { id: "C0080", prenom: "Patricia", nom: "Nguyen", courtier: "Mehdi", produit: "Complémentaire santé", commission: 120, crm: false },
  { id: "C0087", prenom: "Ugo", nom: "Adam", courtier: "Mehdi", produit: "Assurance emprunteur", commission: 126, crm: false },
  { id: "C0092", prenom: "Alexis", nom: "Dubois", courtier: "Mehdi", produit: "Complémentaire santé", commission: 184, crm: false },
  { id: "C0095", prenom: "Marie", nom: "Lebrun", courtier: "Mehdi", produit: "Assurance emprunteur", commission: 225, crm: false },
  { id: "C0098", prenom: "Camille", nom: "Aubert", courtier: "Mehdi", produit: "Assurance emprunteur", commission: 134, crm: false },
  { id: "C0100", prenom: "Camille", nom: "Tessier", courtier: "Mehdi", produit: "Prévoyance", commission: 101, crm: false },
  { id: "C0107", prenom: "Béatrice", nom: "Nguyen", courtier: "Mehdi", produit: "Prévoyance", commission: 90, crm: false },
  { id: "C0121", prenom: "Valérie", nom: "Fabre", courtier: "Mehdi", produit: "Assurance vie", commission: 133, crm: false },
  { id: "C0125", prenom: "Karen", nom: "Aubert", courtier: "Mehdi", produit: "Complémentaire santé", commission: 178, crm: false },
  { id: "C0131", prenom: "François", nom: "Morin", courtier: "Mehdi", produit: "Assurance vie", commission: 112, crm: false },
];

export const funnel = [
  { etape: "Leads reçus", valeur: 2059 },
  { etape: "Contactés", valeur: 2059 },
  { etape: "En cours", valeur: 649 },
  { etape: "Convertis", valeur: 415 },
  { etape: "Perdus", valeur: 995 },
];

export type CourtierMoisData = {
  courtier: string;
  mois: string;
  leadsTraites: number;
  convertis: number;
  horsSLA: number;
  relancesDues: number;
  delaiMedian: number;
};

const courtierNames = ["Mehdi", "Sonia", "Axel", "Clara", "Romain"];
const courtierProportions = { Mehdi: 0.129, Sonia: 0.101, Axel: 0.310, Clara: 0.188, Romain: 0.273 };
const courtierConvRate = { Mehdi: 0.571, Sonia: 0.396, Axel: 0.14, Clara: 0.08, Romain: 0.109 };
const courtierHorsSLARate = { Mehdi: 0.56, Sonia: 0.87, Axel: 1.0, Clara: 1.0, Romain: 1.0 };
const courtierRelanceRate = { Mehdi: 0.038, Sonia: 0.048, Axel: 0.215, Clara: 0.375, Romain: 0.354 };
const courtierDelai = { Mehdi: 5, Sonia: 8, Axel: 15, Clara: 23, Romain: 31 };

export const courtierParMois: CourtierMoisData[] = donneesMensuelles.flatMap((m) =>
  courtierNames.map((nom) => {
    const prop = courtierProportions[nom as keyof typeof courtierProportions];
    const leadsTraites = Math.round(m.leads * prop);
    const convertis = Math.round(leadsTraites * courtierConvRate[nom as keyof typeof courtierConvRate]);
    const horsSLA = Math.round(leadsTraites * courtierHorsSLARate[nom as keyof typeof courtierHorsSLARate]);
    const relancesDues = Math.round(leadsTraites * courtierRelanceRate[nom as keyof typeof courtierRelanceRate]);
    const delaiMedian = courtierDelai[nom as keyof typeof courtierDelai];
    return { courtier: nom, mois: m.mois, leadsTraites, convertis, horsSLA, relancesDues, delaiMedian };
  })
);

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
