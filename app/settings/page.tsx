"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, Save, RotateCcw } from "lucide-react";

type Rule = {
  id: string;
  name: string;
  description: string;
  active: boolean;
  category: string;
};

const defaultRules: Rule[] = [
  { id: "r1", name: "Alerte SLA depassement", description: "Si un lead n'est pas contacte apres 4h, une alerte est envoyee au manager avec possibilite de reassignation", active: true, category: "sla" },
  { id: "r2", name: "Priorite recommandation", description: "Les leads issus de recommandations sont automatiquement classes en priorite haute", active: true, category: "priorite" },
  { id: "r3", name: "Relance devis automatique", description: "Si un devis ouvert n'est pas signe apres 3 jours, une relance automatique est envoyee", active: true, category: "relance" },
  { id: "r4", name: "Tache retention echeance", description: "A J-30 de l'echeance d'un contrat, une tache de retention est creee pour le courtier responsable", active: false, category: "retention" },
  { id: "r5", name: "Qualification motif obligatoire", description: "Si une resiliation est enregistree sans motif, une tache de qualification est automatiquement creee", active: true, category: "retention" },
  { id: "r6", name: "Migration CRM prioritaire", description: "Les contrats hors CRM avec une commission superieure a 150 EUR/an sont marques comme migration prioritaire", active: true, category: "crm" },
  { id: "r7", name: "Reassignation surcharge", description: "Si un courtier a plus de 50 leads non traites, les nouveaux leads sont automatiquement reassignes", active: false, category: "attribution" },
  { id: "r8", name: "Scoring lead automatique", description: "Les leads sont scores automatiquement selon la source, le profil et le produit demande", active: true, category: "priorite" },
  { id: "r9", name: "Alerte churn eleve", description: "Si le taux de churn d'un courtier depasse 20%, une alerte est remontee au manager", active: true, category: "retention" },
  { id: "r10", name: "CAC maximum", description: "Si le CAC d'un canal depasse 400 EUR, une alerte est envoyee pour arbitrage budgetaire", active: true, category: "acquisition" },
];

export default function SettingsPage() {
  const [rules, setRules] = useState(defaultRules);
  const [slaHours, setSlaHours] = useState("4");
  const [objectifContrats, setObjectifContrats] = useState("1500");
  const [objectifMois, setObjectifMois] = useState("18");
  const [tauxConversionCible, setTauxConversionCible] = useState("32");
  const [churnMaxAlerte, setChurnMaxAlerte] = useState("20");
  const [cacMaxAlerte, setCacMaxAlerte] = useState("400");
  const [relanceJ1, setRelanceJ1] = useState(true);
  const [relanceJ3, setRelanceJ3] = useState(true);
  const [relanceJ7, setRelanceJ7] = useState(true);

  const toggleRule = (id: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  const categories = [...new Set(rules.map(r => r.category))];
  const categoryLabels: Record<string, string> = {
    sla: "SLA et delais",
    priorite: "Priorite et scoring",
    relance: "Relances",
    retention: "Retention et churn",
    crm: "CRM",
    attribution: "Attribution",
    acquisition: "Acquisition",
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Parametres</h1>
          <p className="text-sm text-muted-foreground">Configuration des regles SalesOps et seuils d'alerte</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-7 text-xs rounded-full gap-1">
            <RotateCcw className="size-3" /> Reinitialiser
          </Button>
          <Button size="sm" className="h-7 text-xs rounded-full gap-1">
            <Save className="size-3" /> Enregistrer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Objectifs et seuils */}
        <Card className="rounded-lg border bg-card shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Objectifs et seuils</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center gap-1">
                  <Label className="text-xs">SLA premier contact (heures)</Label>
                  <Tooltip>
                    <TooltipTrigger><Info className="size-3 text-muted-foreground" /></TooltipTrigger>
                    <TooltipContent className="text-xs max-w-xs">Delai maximum acceptable pour le premier contact avec un lead. Au-dela, une alerte est declenchee.</TooltipContent>
                  </Tooltip>
                </div>
                <Input value={slaHours} onChange={(e) => setSlaHours(e.target.value)} className="h-7 text-xs mt-1" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <Label className="text-xs">Objectif contrats</Label>
                  <Tooltip>
                    <TooltipTrigger><Info className="size-3 text-muted-foreground" /></TooltipTrigger>
                    <TooltipContent className="text-xs max-w-xs">Nombre total de contrats actifs vises.</TooltipContent>
                  </Tooltip>
                </div>
                <Input value={objectifContrats} onChange={(e) => setObjectifContrats(e.target.value)} className="h-7 text-xs mt-1" />
              </div>
              <div>
                <Label className="text-xs">Delai objectif (mois)</Label>
                <Input value={objectifMois} onChange={(e) => setObjectifMois(e.target.value)} className="h-7 text-xs mt-1" />
              </div>
              <div>
                <Label className="text-xs">Taux conversion cible (%)</Label>
                <Input value={tauxConversionCible} onChange={(e) => setTauxConversionCible(e.target.value)} className="h-7 text-xs mt-1" />
              </div>
              <div>
                <Label className="text-xs">Seuil alerte churn (%)</Label>
                <Input value={churnMaxAlerte} onChange={(e) => setChurnMaxAlerte(e.target.value)} className="h-7 text-xs mt-1" />
              </div>
              <div>
                <Label className="text-xs">CAC max alerte (EUR)</Label>
                <Input value={cacMaxAlerte} onChange={(e) => setCacMaxAlerte(e.target.value)} className="h-7 text-xs mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Relances automatiques */}
        <Card className="rounded-lg border bg-card shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Relances automatiques</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-xs font-medium">Relance J+1</p>
                <p className="text-[10px] text-muted-foreground">Email automatique 24h apres le premier contact sans reponse</p>
              </div>
              <Switch checked={relanceJ1} onCheckedChange={setRelanceJ1} />
            </div>
            <div className="flex items-center justify-between py-2 border-t">
              <div>
                <p className="text-xs font-medium">Relance J+3</p>
                <p className="text-[10px] text-muted-foreground">Deuxieme relance si aucune interaction apres 3 jours</p>
              </div>
              <Switch checked={relanceJ3} onCheckedChange={setRelanceJ3} />
            </div>
            <div className="flex items-center justify-between py-2 border-t">
              <div>
                <p className="text-xs font-medium">Relance J+7</p>
                <p className="text-[10px] text-muted-foreground">Derniere relance avec proposition d'echange telephonique</p>
              </div>
              <Switch checked={relanceJ7} onCheckedChange={setRelanceJ7} />
            </div>

            <div className="pt-3 border-t">
              <Label className="text-xs">Delai entre relances (jours)</Label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                <Input defaultValue="1" className="h-7 text-xs" />
                <Input defaultValue="3" className="h-7 text-xs" />
                <Input defaultValue="7" className="h-7 text-xs" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rules */}
      <Card className="rounded-lg border bg-card shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Regles d'automatisation</CardTitle>
            <Badge variant="secondary" className="text-[10px]">{rules.filter(r => r.active).length}/{rules.length} actives</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((cat) => (
              <div key={cat}>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{categoryLabels[cat] || cat}</p>
                <div className="space-y-2">
                  {rules.filter(r => r.category === cat).map((rule) => (
                    <div key={rule.id} className="flex items-start justify-between py-2 px-3 rounded-md border hover:bg-accent">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-medium">{rule.name}</p>
                          {rule.active && <Badge className="text-[9px] bg-brand-green/10 text-brand-green h-4">Active</Badge>}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{rule.description}</p>
                      </div>
                      <Switch checked={rule.active} onCheckedChange={() => toggleRule(rule.id)} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
