"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail,
  Phone,
  Clock,
  Play,
  Pause,
  Plus,
  Eye,
  Send,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Zap,
  StopCircle,
  XCircle,
} from "lucide-react";

type SequenceStep = {
  id: string;
  type: "email" | "appel" | "alerte";
  delay: string;
  subject?: string;
  template?: string;
  condition?: string;
};

type Sequence = {
  id: string;
  name: string;
  description: string;
  active: boolean;
  declencheur: string;
  conditionArret: string;
  actionEchec: string;
  steps: SequenceStep[];
  stats: {
    envois: number;
    tauxOuverture: number;
    tauxClic: number;
    tauxReponse: number;
    conversions: number;
    gainsEstimes: number;
  };
};

const sequences: Sequence[] = [
  {
    id: "seq-1",
    name: "Relance lead sans réponse",
    description: "Séquence automatique pour les leads qui n'ont pas répondu au premier contact",
    active: true,
    declencheur: "Aucun retour 24h après le premier contact",
    conditionArret: "Le client répond, signe ou refuse",
    actionEchec: "Création automatique d'une tâche d'appel pour le courtier",
    steps: [
      { id: "s1-1", type: "email", delay: "J+1", subject: "Suite à notre échange", template: "Bonjour {{prenom_client}},\n\nJe me permets de revenir vers vous suite à mon appel du {{date_premier_contact}}.\n\nJe reste disponible pour échanger sur votre projet {{type_contrat}}.\n\nCordialement,\n{{courtier}}\n{{telephone_courtier}}" },
      { id: "s1-2", type: "email", delay: "J+3", subject: "Votre projet assurance", template: "Bonjour {{prenom_client}},\n\nJe n'ai pas eu de retour de votre part. Souhaitez-vous que je vous envoie une proposition adaptée ?\n\nN'hésitez pas à me rappeler au {{telephone_courtier}}.\n\n{{courtier}}" },
      { id: "s1-3", type: "email", delay: "J+7", subject: "Dernière relance", template: "Bonjour {{prenom_client}},\n\nJe comprends que vous puissiez être occupé. Je reste à votre disposition si vous souhaitez avancer sur votre {{type_contrat}}.\n\nSans retour de votre part, je clôture votre dossier.\n\nBien cordialement,\n{{courtier}}" },
      { id: "s1-4", type: "alerte", delay: "J+8", condition: "Si aucune réponse : création d'une tâche d'appel pour le courtier" },
    ],
    stats: { envois: 1243, tauxOuverture: 42.3, tauxClic: 12.1, tauxReponse: 8.7, conversions: 34, gainsEstimes: 5100 },
  },
  {
    id: "seq-2",
    name: "Relance devis envoyé",
    description: "Suivi automatique après l'envoi d'un devis non signé",
    active: true,
    declencheur: "Devis envoyé sans signature après 24h",
    conditionArret: "Le devis est signé, refusé ou expiré",
    actionEchec: "Alerte courtier pour appel de relance",
    steps: [
      { id: "s2-1", type: "email", delay: "J+1", subject: "Votre devis {{type_contrat}}", template: "Bonjour {{prenom_client}},\n\nVous avez reçu votre devis {{type_contrat}} hier. Avez-vous eu le temps de le consulter ?\n\nJe reste disponible pour répondre à vos questions.\n\n{{courtier}}" },
      { id: "s2-2", type: "email", delay: "J+3", subject: "Avez-vous des questions ?", condition: "Si devis non ouvert", template: "Bonjour {{prenom_client}},\n\nJe vois que vous n'avez pas encore consulté votre devis. Je vous le renvoie en pièce jointe pour plus de facilité.\n\n{{courtier}}" },
      { id: "s2-3", type: "email", delay: "J+7", subject: "Échangeons par téléphone ?", template: "Bonjour {{prenom_client}},\n\nPlutôt qu'un email, souhaitez-vous qu'on en discute rapidement par téléphone ? Je peux vous appeler au moment qui vous arrange.\n\nProposez-moi un créneau !\n\n{{courtier}}\n{{telephone_courtier}}" },
      { id: "s2-4", type: "alerte", delay: "J+8", condition: "Si devis ouvert mais non signé : alerte courtier pour appel" },
    ],
    stats: { envois: 876, tauxOuverture: 51.2, tauxClic: 18.4, tauxReponse: 14.2, conversions: 67, gainsEstimes: 10050 },
  },
  {
    id: "seq-3",
    name: "Rétention avant échéance",
    description: "Contact proactif des clients dont le contrat arrive à échéance",
    active: false,
    declencheur: "Contrat arrivant à échéance dans 30 jours",
    conditionArret: "Le client confirme le renouvellement",
    actionEchec: "Alerte manager pour intervention",
    steps: [
      { id: "s3-1", type: "email", delay: "J-30", subject: "Votre contrat arrive à échéance", template: "Bonjour {{prenom_client}},\n\nVotre contrat {{type_contrat}} arrive à échéance le {{date_echeance}}.\n\nSouhaitez-vous que nous fassions le point ensemble ? C'est l'occasion de vérifier que votre couverture est toujours adaptée.\n\n{{courtier}}\n{{telephone_courtier}}" },
      { id: "s3-2", type: "appel", delay: "J-25", condition: "Appel courtier" },
      { id: "s3-3", type: "email", delay: "J-15", subject: "Rappel : votre contrat", condition: "Si pas de réponse", template: "Bonjour {{prenom_client}},\n\nJe n'ai pas eu de retour. Votre contrat arrive à échéance dans 15 jours.\n\nJe vous propose un rendez-vous rapide pour faire le point. Quand êtes-vous disponible ?\n\n{{courtier}}" },
      { id: "s3-4", type: "alerte", delay: "J-7", condition: "Si client à risque élevé : alerte manager" },
    ],
    stats: { envois: 0, tauxOuverture: 0, tauxClic: 0, tauxReponse: 0, conversions: 0, gainsEstimes: 0 },
  },
  {
    id: "seq-4",
    name: "Satisfaction post-signature",
    description: "Accueil et suivi de satisfaction après la signature d'un contrat",
    active: true,
    declencheur: "Contrat signé (J+1 après signature)",
    conditionArret: "Fin de la séquence (3 emails envoyés)",
    actionEchec: "Aucune (séquence informative)",
    steps: [
      { id: "s4-1", type: "email", delay: "J+1", subject: "Bienvenue chez Optivie !", template: "Bonjour {{prenom_client}},\n\nMerci pour votre confiance ! Votre contrat {{type_contrat}} est bien actif.\n\nN'hésitez pas à me contacter pour toute question.\n\n{{courtier}}\n{{nom_cabinet}}" },
      { id: "s4-2", type: "email", delay: "J+15", subject: "Comment se passe votre expérience ?", template: "Bonjour {{prenom_client}},\n\nCela fait 15 jours que vous êtes client chez nous. Tout se passe bien ?\n\nVotre satisfaction est notre priorité. N'hésitez pas à me faire part de vos retours.\n\n{{courtier}}" },
      { id: "s4-3", type: "email", delay: "J+30", subject: "Un besoin complémentaire ?", template: "Bonjour {{prenom_client}},\n\nUn mois déjà ! J'espère que votre {{type_contrat}} vous convient.\n\nSaviez-vous que nous proposons aussi {{produit_complementaire}} ? Je peux vous faire une simulation sans engagement.\n\n{{courtier}}" },
    ],
    stats: { envois: 412, tauxOuverture: 67.8, tauxClic: 22.3, tauxReponse: 11.4, conversions: 12, gainsEstimes: 1800 },
  },
];

const variables = [
  "{{prenom_client}}", "{{nom_client}}", "{{courtier}}", "{{source_lead}}",
  "{{type_contrat}}", "{{date_echeance}}", "{{montant_prime}}", "{{lien_devis}}",
  "{{lien_signature}}", "{{telephone_courtier}}", "{{email_courtier}}", "{{nom_cabinet}}",
];

export default function AutomationsPage() {
  const [selectedSequence, setSelectedSequence] = useState<Sequence>(sequences[0]);
  const [selectedStep, setSelectedStep] = useState<SequenceStep | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const stepIcon = (type: string) => {
    switch (type) {
      case "email": return <Mail className="size-3.5" />;
      case "appel": return <Phone className="size-3.5" />;
      case "alerte": return <AlertTriangle className="size-3.5" />;
      default: return <Mail className="size-3.5" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Automatisations</h1>
          <p className="text-sm text-muted-foreground">Séquences de relance automatisées et templates email</p>
        </div>
        <Button size="sm" className="h-7 text-xs rounded-full gap-1">
          <Plus className="size-3" /> Nouvelle séquence
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Sequence list */}
        <div className="space-y-2">
          {sequences.map((seq) => (
            <Card
              key={seq.id}
              className={`rounded-lg border shadow-sm cursor-pointer transition-colors ${selectedSequence.id === seq.id ? "border-brand-green bg-brand-green/5" : "bg-card hover:bg-accent"}`}
              onClick={() => { setSelectedSequence(seq); setSelectedStep(null); }}
            >
              <CardContent className="p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium">{seq.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{seq.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {seq.active ? (
                      <Badge className="text-[10px] bg-brand-green/10 text-brand-green">Active</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px]">Inactive</Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                  <span>{seq.steps.length} étapes</span>
                  <span>{seq.stats.envois} envois</span>
                  <span>{seq.stats.tauxOuverture}% ouverture</span>
                  <span>{seq.stats.conversions} conversions</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sequence detail */}
        <div className="xl:col-span-2 space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { label: "Envois", value: selectedSequence.stats.envois },
              { label: "Ouverture", value: `${selectedSequence.stats.tauxOuverture}%` },
              { label: "Clic", value: `${selectedSequence.stats.tauxClic}%` },
              { label: "Réponse", value: `${selectedSequence.stats.tauxReponse}%` },
              { label: "Conversions", value: selectedSequence.stats.conversions },
              { label: "Gains estimés", value: `${selectedSequence.stats.gainsEstimes.toLocaleString("fr-FR")} €` },
            ].map((s) => (
              <Card key={s.label} className="rounded-lg border bg-card shadow-sm">
                <CardContent className="p-2 text-center">
                  <p className="text-[10px] text-muted-foreground">{s.label}</p>
                  <p className="text-sm font-bold">{s.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Déclencheur / Condition d'arrêt / Action après échec */}
          <Card className="rounded-lg border bg-card shadow-sm">
            <CardContent className="p-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex items-start gap-2">
                  <div className="size-7 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center shrink-0 mt-0.5">
                    <Zap className="size-3.5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Déclencheur</p>
                    <p className="text-xs mt-0.5">{selectedSequence.declencheur}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="size-7 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                    <StopCircle className="size-3.5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Condition d&apos;arrêt</p>
                    <p className="text-xs mt-0.5">{selectedSequence.conditionArret}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="size-7 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0 mt-0.5">
                    <XCircle className="size-3.5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Action après échec</p>
                    <p className="text-xs mt-0.5">{selectedSequence.actionEchec}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Steps timeline */}
          <Card className="rounded-lg border bg-card shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Étapes de la séquence</CardTitle>
                <div className="flex gap-1">
                  <Button size="xs" variant="outline" className="h-6 text-[10px] px-2 rounded-full gap-1">
                    <Play className="size-3" /> Tester
                  </Button>
                  <Button size="xs" variant={selectedSequence.active ? "destructive" : "default"} className="h-6 text-[10px] px-2 rounded-full gap-1">
                    {selectedSequence.active ? <><Pause className="size-3" /> Désactiver</> : <><Play className="size-3" /> Activer</>}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedSequence.steps.map((step, i) => (
                  <div
                    key={step.id}
                    className={`flex items-start gap-3 p-2.5 rounded-md border cursor-pointer transition-colors ${selectedStep?.id === step.id ? "border-brand-green bg-brand-green/5" : "hover:bg-accent"}`}
                    onClick={() => setSelectedStep(step)}
                  >
                    <div className="flex flex-col items-center">
                      <div className={`size-7 rounded-full flex items-center justify-center ${step.type === "alerte" ? "bg-warning/10 text-warning" : "bg-brand-green/10 text-brand-green"}`}>
                        {stepIcon(step.type)}
                      </div>
                      {i < selectedSequence.steps.length - 1 && <div className="w-px h-4 bg-border mt-1" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[9px]">{step.delay}</Badge>
                        <span className="text-xs font-medium capitalize">{step.type}</span>
                      </div>
                      {step.subject && <p className="text-xs text-muted-foreground mt-0.5">Objet : {step.subject}</p>}
                      {step.condition && <p className="text-[10px] text-muted-foreground italic mt-0.5">{step.condition}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Template editor */}
          {selectedStep && selectedStep.template && (
            <Card className="rounded-lg border bg-card shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">Éditeur de template</CardTitle>
                  <div className="flex gap-1">
                    <Button size="xs" variant="outline" className="h-6 text-[10px] px-2 rounded-full gap-1" onClick={() => setPreviewMode(!previewMode)}>
                      <Eye className="size-3" /> {previewMode ? "Éditer" : "Prévisualiser"}
                    </Button>
                    <Button size="xs" variant="outline" className="h-6 text-[10px] px-2 rounded-full gap-1">
                      <Send className="size-3" /> Envoyer un test
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs">Objet</Label>
                      <Input defaultValue={selectedStep.subject} className="h-7 text-xs mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs">Corps du mail</Label>
                      <Textarea
                        defaultValue={selectedStep.template}
                        className="mt-1 text-xs min-h-[200px] font-mono"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Variables disponibles</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {variables.map((v) => (
                          <Badge key={v} variant="secondary" className="text-[9px] cursor-pointer hover:bg-accent">{v}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Prévisualisation</Label>
                    <div className="mt-1 rounded-md border bg-background p-4 min-h-[280px]">
                      <p className="text-xs font-medium mb-2">
                        Objet : {selectedStep.subject?.replace(/\{\{.*?\}\}/g, "[valeur]")}
                      </p>
                      <div className="text-xs text-muted-foreground whitespace-pre-line leading-relaxed">
                        {selectedStep.template
                          .replace(/\{\{prenom_client\}\}/g, "Jean")
                          .replace(/\{\{nom_client\}\}/g, "Dupont")
                          .replace(/\{\{courtier\}\}/g, "Sonia Martin")
                          .replace(/\{\{type_contrat\}\}/g, "complémentaire santé")
                          .replace(/\{\{telephone_courtier\}\}/g, "06 12 34 56 78")
                          .replace(/\{\{nom_cabinet\}\}/g, "Optivie")
                          .replace(/\{\{.*?\}\}/g, "[valeur]")
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
