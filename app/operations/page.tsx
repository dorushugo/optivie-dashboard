"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Download,
  Filter,
  Phone,
  Mail,
  Info,
  ArrowUpDown,
} from "lucide-react";
import {
  computeCourtierPerformance,
  generateLeadsData,
  generateResiliationRiskClients,
  canaux,
  motifsResiliations,
  conversionDelai,
  funnel,
} from "@/data/computed";

type ViewType = "leads" | "courtiers" | "resiliations" | "acquisition" | "crm" | "pipeline";

const views: { id: ViewType; label: string }[] = [
  { id: "leads", label: "Leads" },
  { id: "courtiers", label: "Courtiers" },
  { id: "resiliations", label: "Resiliations" },
  { id: "acquisition", label: "Acquisition" },
  { id: "crm", label: "CRM" },
  { id: "pipeline", label: "Pipeline" },
];

const statusBadge = (status: string) => {
  switch (status) {
    case "hors_sla": case "critique": return <Badge variant="destructive" className="text-[10px]">Critique</Badge>;
    case "proche": case "eleve": case "alerte": return <Badge className="text-[10px] bg-warning/10 text-warning border-warning/20">A surveiller</Badge>;
    case "ok": case "bon": case "modere": return <Badge className="text-[10px] bg-brand-green/10 text-brand-green border-brand-green/20">OK</Badge>;
    default: return <Badge variant="secondary" className="text-[10px]">{status}</Badge>;
  }
};

export default function OperationsPage() {
  const [activeView, setActiveView] = useState<ViewType>("leads");
  const [search, setSearch] = useState("");
  const [courtierFilterOps, setCourtierFilterOps] = useState<string>("all");

  const leads = useMemo(() => generateLeadsData(), []);
  const courtierPerf = useMemo(() => computeCourtierPerformance(), []);
  const resiliationClients = useMemo(() => generateResiliationRiskClients(), []);

  const filteredLeads = useMemo(() => {
    let data = leads;
    if (search) data = data.filter(l => l.id.toLowerCase().includes(search.toLowerCase()) || l.courtier.toLowerCase().includes(search.toLowerCase()) || l.source.toLowerCase().includes(search.toLowerCase()));
    if (courtierFilterOps !== "all") data = data.filter(l => l.courtier === courtierFilterOps);
    return data;
  }, [leads, search, courtierFilterOps]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Operations</h1>
          <p className="text-sm text-muted-foreground">Table de pilotage centralisee avec vues configurables</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1 rounded-full">
            <Download className="size-3" /> Exporter
          </Button>
        </div>
      </div>

      {/* View selector */}
      <div className="flex items-center gap-2 flex-wrap">
        {views.map((v) => (
          <Button
            key={v.id}
            variant={activeView === v.id ? "default" : "outline"}
            size="sm"
            className="h-7 text-xs rounded-full"
            onClick={() => setActiveView(v.id)}
          >
            {v.label}
          </Button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            className="h-8 pl-8 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={courtierFilterOps} onValueChange={(v) => setCourtierFilterOps(v ?? "all")}>
          <SelectTrigger className="w-[130px] h-8 text-xs">
            <SelectValue placeholder="Courtier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            {courtierPerf.map(c => (
              <SelectItem key={c.nom} value={c.nom}>{c.nom}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="rounded-lg border bg-card shadow-sm">
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-320px)]">
            {activeView === "leads" && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">ID</TableHead>
                    <TableHead className="text-xs">Date</TableHead>
                    <TableHead className="text-xs">Source</TableHead>
                    <TableHead className="text-xs">Courtier</TableHead>
                    <TableHead className="text-xs">Produit</TableHead>
                    <TableHead className="text-xs">Delai</TableHead>
                    <TableHead className="text-xs">SLA</TableHead>
                    <TableHead className="text-xs">Relances</TableHead>
                    <TableHead className="text-xs">Statut</TableHead>
                    <TableHead className="text-xs">Priorite</TableHead>
                    <TableHead className="text-xs">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((l) => (
                    <TableRow key={l.id} className="hover:bg-accent">
                      <TableCell className="text-xs font-mono">{l.id}</TableCell>
                      <TableCell className="text-xs">{l.date}</TableCell>
                      <TableCell className="text-xs">{l.source}</TableCell>
                      <TableCell className="text-xs font-medium">{l.courtier}</TableCell>
                      <TableCell className="text-xs">{l.produit}</TableCell>
                      <TableCell className="text-xs">{l.delaiContact}h</TableCell>
                      <TableCell>{statusBadge(l.statutSLA)}</TableCell>
                      <TableCell className="text-xs">{l.relances}</TableCell>
                      <TableCell><Badge variant="secondary" className="text-[10px]">{l.statut}</Badge></TableCell>
                      <TableCell>{statusBadge(l.priorite === "critique" ? "critique" : l.priorite === "haute" ? "proche" : "ok")}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="xs" variant="ghost" className="h-5 w-5 p-0"><Phone className="size-3" /></Button>
                          <Button size="xs" variant="ghost" className="h-5 w-5 p-0"><Mail className="size-3" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {activeView === "courtiers" && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Courtier</TableHead>
                    <TableHead className="text-xs">Contrats</TableHead>
                    <TableHead className="text-xs">Leads traites</TableHead>
                    <TableHead className="text-xs">Hors SLA</TableHead>
                    <TableHead className="text-xs">Delai median</TableHead>
                    <TableHead className="text-xs">Conversion</TableHead>
                    <TableHead className="text-xs">
                      <div className="flex items-center gap-1">
                        Conv. ajustee
                        <Tooltip>
                          <TooltipTrigger><Info className="size-3 text-muted-foreground" /></TooltipTrigger>
                          <TooltipContent className="text-xs max-w-xs">Conversion ajustee par la qualite de la source. Les recommandations convertissent naturellement 4x mieux que les comparateurs.</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableHead>
                    <TableHead className="text-xs">Relances dues</TableHead>
                    <TableHead className="text-xs">CRM</TableHead>
                    <TableHead className="text-xs">Churn</TableHead>
                    <TableHead className="text-xs">Charge</TableHead>
                    <TableHead className="text-xs">Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courtierPerf.map((c) => (
                    <TableRow key={c.nom} className="hover:bg-accent">
                      <TableCell className="text-xs font-medium">{c.nom}</TableCell>
                      <TableCell className="text-xs">{c.contrats}</TableCell>
                      <TableCell className="text-xs">{c.leadsTraites}</TableCell>
                      <TableCell className="text-xs">{c.leadsHorsSLA > 50 ? <span className="text-destructive font-medium">{c.leadsHorsSLA}</span> : c.leadsHorsSLA}</TableCell>
                      <TableCell className="text-xs">{c.delaiMedian}h</TableCell>
                      <TableCell className="text-xs">{c.tauxConversion}%</TableCell>
                      <TableCell className="text-xs">{c.conversionAjustee}%</TableCell>
                      <TableCell className="text-xs">{c.relancesDues > 30 ? <span className="text-destructive font-medium">{c.relancesDues}</span> : c.relancesDues}</TableCell>
                      <TableCell className="text-xs">{c.crmSaisie === 0 ? <Badge variant="destructive" className="text-[10px]">0%</Badge> : <span className="text-brand-green">{c.crmSaisie}%</span>}</TableCell>
                      <TableCell className="text-xs">{c.churn}%</TableCell>
                      <TableCell><Badge variant="secondary" className="text-[10px]">{c.charge}</Badge></TableCell>
                      <TableCell>{statusBadge(c.statut === "critique" ? "critique" : c.statut === "alerte" ? "alerte" : "bon")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {activeView === "resiliations" && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Client</TableHead>
                    <TableHead className="text-xs">Courtier</TableHead>
                    <TableHead className="text-xs">Echeance</TableHead>
                    <TableHead className="text-xs">Motif probable</TableHead>
                    <TableHead className="text-xs">Commission (EUR/an)</TableHead>
                    <TableHead className="text-xs">Risque</TableHead>
                    <TableHead className="text-xs">Action recommandee</TableHead>
                    <TableHead className="text-xs">Contacte</TableHead>
                    <TableHead className="text-xs">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resiliationClients.map((c) => (
                    <TableRow key={c.id} className="hover:bg-accent">
                      <TableCell className="text-xs font-medium">{c.client}</TableCell>
                      <TableCell className="text-xs">{c.courtier}</TableCell>
                      <TableCell className="text-xs font-mono">{c.echeance}</TableCell>
                      <TableCell className="text-xs">{c.motifProbable}</TableCell>
                      <TableCell className="text-xs">{c.commission} EUR</TableCell>
                      <TableCell>{statusBadge(c.risque)}</TableCell>
                      <TableCell className="text-xs">{c.actionRecommandee}</TableCell>
                      <TableCell>{c.contacte ? <Badge className="text-[10px] bg-brand-green/10 text-brand-green">Oui</Badge> : <Badge variant="destructive" className="text-[10px]">Non</Badge>}</TableCell>
                      <TableCell>
                        <Button size="xs" variant="outline" className="h-5 text-[10px] px-2 rounded-full">
                          <Phone className="size-3 mr-1" /> Appeler
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {activeView === "acquisition" && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Canal</TableHead>
                    <TableHead className="text-xs">Volume leads</TableHead>
                    <TableHead className="text-xs">Conversion</TableHead>
                    <TableHead className="text-xs">CPL moyen</TableHead>
                    <TableHead className="text-xs">Budget annuel</TableHead>
                    <TableHead className="text-xs">Contrats signes</TableHead>
                    <TableHead className="text-xs">CAC</TableHead>
                    <TableHead className="text-xs">Gain net estime</TableHead>
                    <TableHead className="text-xs">Recommandation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {canaux.map((c) => {
                    const contrats = Math.round(c.volume * c.tauxConversion / 100);
                    const cac = contrats > 0 && c.budget > 0 ? Math.round(c.budget / contrats) : 0;
                    const gainNet = contrats * 150 - c.budget;
                    const reco = c.canal === "Recommandations" ? "Developper ++" : cac > 300 ? "Reduire budget" : "Maintenir";
                    return (
                      <TableRow key={c.canal} className="hover:bg-accent">
                        <TableCell className="text-xs font-medium">{c.canal}</TableCell>
                        <TableCell className="text-xs">{c.volume}</TableCell>
                        <TableCell className="text-xs">{c.tauxConversion}%</TableCell>
                        <TableCell className="text-xs">{c.cac ? `${c.cac} EUR` : "0 EUR"}</TableCell>
                        <TableCell className="text-xs">{c.budget > 0 ? `${c.budget.toLocaleString("fr-FR")} EUR` : "0 EUR"}</TableCell>
                        <TableCell className="text-xs">{contrats}</TableCell>
                        <TableCell className="text-xs">{cac > 0 ? `${cac} EUR` : "0 EUR"}</TableCell>
                        <TableCell className="text-xs">{gainNet > 0 ? <span className="text-brand-green">+{gainNet.toLocaleString("fr-FR")} EUR</span> : <span className="text-destructive">{gainNet.toLocaleString("fr-FR")} EUR</span>}</TableCell>
                        <TableCell><Badge variant={reco.includes("Reduire") ? "destructive" : reco.includes("Developper") ? "default" : "secondary"} className="text-[10px]">{reco}</Badge></TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}

            {activeView === "crm" && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Courtier</TableHead>
                    <TableHead className="text-xs">Contrats total</TableHead>
                    <TableHead className="text-xs">Dans CRM</TableHead>
                    <TableHead className="text-xs">Hors CRM</TableHead>
                    <TableHead className="text-xs">Commission a risque</TableHead>
                    <TableHead className="text-xs">Priorite migration</TableHead>
                    <TableHead className="text-xs">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courtierPerf.map((c) => {
                    const horsCRM = Math.round(c.contrats * (1 - c.crmSaisie / 100));
                    const commissionRisque = Math.round(c.commission * (1 - c.crmSaisie / 100));
                    return (
                      <TableRow key={c.nom} className="hover:bg-accent">
                        <TableCell className="text-xs font-medium">{c.nom}</TableCell>
                        <TableCell className="text-xs">{c.contrats}</TableCell>
                        <TableCell className="text-xs text-brand-green">{c.contrats - horsCRM}</TableCell>
                        <TableCell className="text-xs">{horsCRM > 0 ? <span className="text-destructive font-medium">{horsCRM}</span> : "0"}</TableCell>
                        <TableCell className="text-xs">{commissionRisque > 0 ? <span className="text-destructive">{commissionRisque.toLocaleString("fr-FR")} EUR</span> : "0 EUR"}</TableCell>
                        <TableCell>{horsCRM > 0 ? <Badge variant="destructive" className="text-[10px]">Urgente</Badge> : <Badge className="text-[10px] bg-brand-green/10 text-brand-green">Complete</Badge>}</TableCell>
                        <TableCell>
                          {horsCRM > 0 && <Button size="xs" variant="outline" className="h-5 text-[10px] px-2 rounded-full">Migrer</Button>}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}

            {activeView === "pipeline" && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Etape</TableHead>
                    <TableHead className="text-xs">Dossiers</TableHead>
                    <TableHead className="text-xs">Part du total</TableHead>
                    <TableHead className="text-xs">Taux de passage</TableHead>
                    <TableHead className="text-xs">Deperdition</TableHead>
                    <TableHead className="text-xs">Alerte</TableHead>
                    <TableHead className="text-xs">Action recommandee</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {funnel.map((f, i) => {
                    const total = funnel[0].valeur;
                    const tauxPassage = i > 0 ? Math.round((f.valeur / funnel[i - 1].valeur) * 100) : 100;
                    const deperdition = i > 0 ? funnel[i - 1].valeur - f.valeur : 0;
                    const alerte = tauxPassage < 50 && i > 0;
                    const action = i === 1 ? "Augmenter le taux de relance" : i === 2 ? "Accelerer les prises de decision" : i === 3 ? "Reduire le delai de contact" : "Maintenir le flux";
                    return (
                      <TableRow key={f.etape} className="hover:bg-accent">
                        <TableCell className="text-xs font-medium">{f.etape}</TableCell>
                        <TableCell className="text-xs">{f.valeur}</TableCell>
                        <TableCell className="text-xs">{Math.round((f.valeur / total) * 100)}%</TableCell>
                        <TableCell className="text-xs">{tauxPassage}%</TableCell>
                        <TableCell className="text-xs">{deperdition > 0 ? <span className="text-destructive">-{deperdition}</span> : "—"}</TableCell>
                        <TableCell>{alerte ? <Badge variant="destructive" className="text-[10px]">Deperdition elevee</Badge> : <Badge variant="secondary" className="text-[10px]">Normal</Badge>}</TableCell>
                        <TableCell className="text-xs">{action}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
