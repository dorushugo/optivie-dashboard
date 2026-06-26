"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Download,
  Phone,
  Info,
  Columns3,
  CalendarClock,
  ClipboardList,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  computeCourtierPerformance,
  getContratsARisque,
  canaux,
  getMoisList,
  computeKPIs,
} from "@/data/computed";
import type { PeriodFilter } from "@/data/computed";

type ViewType = "leads" | "courtiers" | "resiliations" | "acquisition" | "crm" | "pipeline";

const views: { id: ViewType; label: string }[] = [
  { id: "leads", label: "Leads" },
  { id: "courtiers", label: "Courtiers" },
  { id: "resiliations", label: "Résiliations" },
  { id: "acquisition", label: "Acquisition" },
  { id: "crm", label: "CRM" },
  { id: "pipeline", label: "Pipeline" },
];

const statusBadge = (status: string) => {
  switch (status) {
    case "hors_sla":
    case "critique":
      return <Badge variant="destructive" className="text-[10px]">Critique</Badge>;
    case "proche":
    case "élevé":
    case "eleve":
    case "alerte":
      return <Badge className="text-[10px] bg-warning/10 text-warning border-warning/20">À surveiller</Badge>;
    case "ok":
    case "bon":
    case "modéré":
    case "modere":
      return <Badge className="text-[10px] bg-brand-green/10 text-brand-green border-brand-green/20">OK</Badge>;
    default:
      return <Badge variant="secondary" className="text-[10px]">{status}</Badge>;
  }
};

function getPipelineData(kpis: ReturnType<typeof computeKPIs>) {
  const leads = kpis.totalLeads;
  const enCours = Math.round(leads * 0.315);
  const convertis = kpis.totalConvertis;
  const perdus = leads - convertis - enCours;
  return [
    {
      statut: "Leads reçus",
      nombre: leads,
      part: "100%",
      description: "Total des leads entrants sur la période",
      action: "Maintenir le flux d'acquisition",
    },
    {
      statut: "En cours",
      nombre: enCours,
      part: `${leads > 0 ? Math.round((enCours / leads) * 100 * 10) / 10 : 0}%`,
      description: "Leads en traitement actif par les courtiers",
      action: "Accélérer les prises de décision",
    },
    {
      statut: "Convertis",
      nombre: convertis,
      part: `${kpis.tauxConversion}%`,
      description: "Leads transformés en contrats signés",
      action: "Développer les recommandations",
    },
    {
      statut: "Perdus",
      nombre: perdus > 0 ? perdus : 0,
      part: `${leads > 0 ? Math.round(((perdus > 0 ? perdus : 0) / leads) * 100 * 10) / 10 : 0}%`,
      description: "Leads non convertis (refus, injoignables, hors cible)",
      action: "Qualifier les motifs de perte",
    },
  ];
}

export default function OperationsPage() {
  const [activeView, setActiveView] = useState<ViewType>("leads");
  const [search, setSearch] = useState("");
  const [courtierFilterOps, setCourtierFilterOps] = useState<string>("all");
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("annuel");

  const [colId, setColId] = useState(true);
  const [colDate, setColDate] = useState(true);
  const [colSource, setColSource] = useState(true);
  const [colCourtier, setColCourtier] = useState(true);
  const [colProduit, setColProduit] = useState(true);
  const [colStatut, setColStatut] = useState(true);

  const moisList = getMoisList();
  const kpis = useMemo(() => computeKPIs(periodFilter), [periodFilter]);
  const pipelineData = useMemo(() => getPipelineData(kpis), [kpis]);
  const courtierPerf = useMemo(() => computeCourtierPerformance(periodFilter), [periodFilter]);
  const contratsARisque = useMemo(() => getContratsARisque(), []);

  const filteredCourtiers = useMemo(() => {
    if (courtierFilterOps === "all") return courtierPerf;
    return courtierPerf.filter((c) => c.nom === courtierFilterOps);
  }, [courtierPerf, courtierFilterOps]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Opérations</h1>
          <p className="text-sm text-muted-foreground">
            {kpis.periodLabel} — {kpis.totalLeads} leads, {kpis.totalConvertis} convertis, {kpis.totalResiliations} résiliations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={periodFilter} onValueChange={(v) => setPeriodFilter((v ?? "annuel") as PeriodFilter)}>
            <SelectTrigger className="w-[150px] h-8 text-xs">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="annuel">Année 2025</SelectItem>
              <SelectItem value="T1">T1 2025</SelectItem>
              <SelectItem value="T2">T2 2025</SelectItem>
              <SelectItem value="T3">T3 2025</SelectItem>
              <SelectItem value="T4">T4 2025</SelectItem>
              {moisList.map(m => (
                <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-full border border-input bg-background px-3 h-7 text-xs font-medium shadow-xs hover:bg-accent hover:text-accent-foreground">
              <Columns3 className="size-3" /> Colonnes
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuCheckboxItem checked={colId} onCheckedChange={(v) => setColId(v)}>ID</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={colDate} onCheckedChange={(v) => setColDate(v)}>Date</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={colSource} onCheckedChange={(v) => setColSource(v)}>Source</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={colCourtier} onCheckedChange={(v) => setColCourtier(v)}>Courtier</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={colProduit} onCheckedChange={(v) => setColProduit(v)}>Produit</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={colStatut} onCheckedChange={(v) => setColStatut(v)}>Statut</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
            {courtierPerf.map((c) => (
              <SelectItem key={c.nom} value={c.nom}>{c.nom}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Period KPI summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="rounded-lg border bg-card px-3 py-2">
          <p className="text-[10px] text-muted-foreground uppercase">Leads</p>
          <p className="text-lg font-bold">{kpis.totalLeads.toLocaleString("fr-FR")}</p>
          {kpis.evolution.leads !== null && (
            <p className={`text-[10px] flex items-center gap-0.5 ${kpis.evolution.leads >= 0 ? "text-brand-green" : "text-destructive"}`}>
              {kpis.evolution.leads >= 0 ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
              {kpis.evolution.leads > 0 ? "+" : ""}{kpis.evolution.leads}% vs M-1
            </p>
          )}
        </div>
        <div className="rounded-lg border bg-card px-3 py-2">
          <p className="text-[10px] text-muted-foreground uppercase">Convertis</p>
          <p className="text-lg font-bold text-brand-green">{kpis.totalConvertis}</p>
          <p className="text-[10px] text-muted-foreground">{kpis.tauxConversion}% de conversion</p>
        </div>
        <div className="rounded-lg border bg-card px-3 py-2">
          <p className="text-[10px] text-muted-foreground uppercase">Résiliations</p>
          <p className="text-lg font-bold text-destructive">{kpis.totalResiliations}</p>
          {kpis.evolution.resiliations !== null && (
            <p className={`text-[10px] flex items-center gap-0.5 ${kpis.evolution.resiliations <= 0 ? "text-brand-green" : "text-destructive"}`}>
              {kpis.evolution.resiliations <= 0 ? <ArrowDownRight className="size-3" /> : <ArrowUpRight className="size-3" />}
              {kpis.evolution.resiliations > 0 ? "+" : ""}{kpis.evolution.resiliations}% vs M-1
            </p>
          )}
        </div>
        <div className="rounded-lg border bg-card px-3 py-2">
          <p className="text-[10px] text-muted-foreground uppercase">Hors SLA</p>
          <p className="text-lg font-bold text-warning">{kpis.leadsHorsSLA}</p>
          <p className="text-[10px] text-muted-foreground">{kpis.tauxContactSLA}% dans les 4h</p>
        </div>
      </div>

      {/* Table */}
      <Card className="rounded-lg border bg-card shadow-sm">
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-320px)]">
            {activeView === "leads" && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Courtier</TableHead>
                    <TableHead className="text-xs">Leads traités</TableHead>
                    <TableHead className="text-xs">Délai médian</TableHead>
                    <TableHead className="text-xs">Conversion</TableHead>
                    <TableHead className="text-xs">Source dominante</TableHead>
                    <TableHead className="text-xs">Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCourtiers.map((c) => (
                    <TableRow key={c.nom} className="hover:bg-accent">
                      <TableCell className="text-xs font-medium">{c.nom}</TableCell>
                      <TableCell className="text-xs">{c.leadsTraites}</TableCell>
                      <TableCell className="text-xs">{c.delaiMedian}h</TableCell>
                      <TableCell className="text-xs">{c.tauxConversion}%</TableCell>
                      <TableCell className="text-xs">{c.sourceDominante}</TableCell>
                      <TableCell>{statusBadge(c.statut)}</TableCell>
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
                    <TableHead className="text-xs">Leads traités</TableHead>
                    <TableHead className="text-xs">
                      <div className="flex items-center gap-1">
                        Hors SLA
                        <Tooltip>
                          <TooltipTrigger><Info className="size-3 text-muted-foreground" /></TooltipTrigger>
                          <TooltipContent className="text-xs max-w-xs">Nombre de leads dont le délai de premier contact dépasse 4h (source : dataset Excel)</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableHead>
                    <TableHead className="text-xs">Délai médian</TableHead>
                    <TableHead className="text-xs">Conversion</TableHead>
                    <TableHead className="text-xs">
                      <div className="flex items-center gap-1">
                        Conv. ajustée
                        <Tooltip>
                          <TooltipTrigger><Info className="size-3 text-muted-foreground" /></TooltipTrigger>
                          <TooltipContent className="text-xs max-w-xs">Conversion ajustée par la qualité de la source. Les recommandations convertissent naturellement 4x mieux que les comparateurs.</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableHead>
                    <TableHead className="text-xs">
                      <div className="flex items-center gap-1">
                        Relances dues
                        <Tooltip>
                          <TooltipTrigger><Info className="size-3 text-muted-foreground" /></TooltipTrigger>
                          <TooltipContent className="text-xs max-w-xs">Leads au statut &laquo; En cours &raquo; n&apos;ayant reçu aucune relance (source : dataset Excel)</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableHead>
                    <TableHead className="text-xs">CRM</TableHead>
                    <TableHead className="text-xs">Churn</TableHead>
                    <TableHead className="text-xs">Charge</TableHead>
                    <TableHead className="text-xs">Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCourtiers.map((c) => (
                    <TableRow key={c.nom} className="hover:bg-accent">
                      <TableCell className="text-xs font-medium">{c.nom}</TableCell>
                      <TableCell className="text-xs">{c.contrats}</TableCell>
                      <TableCell className="text-xs">{c.leadsTraites}</TableCell>
                      <TableCell className="text-xs">
                        {c.horsSLA > 50
                          ? <span className="text-destructive font-medium">{c.horsSLA}</span>
                          : c.horsSLA}
                      </TableCell>
                      <TableCell className="text-xs">{c.delaiMedian}h</TableCell>
                      <TableCell className="text-xs">{c.tauxConversion}%</TableCell>
                      <TableCell className="text-xs">{c.conversionAjustee}%</TableCell>
                      <TableCell className="text-xs">
                        {c.relancesDues > 30
                          ? <span className="text-destructive font-medium">{c.relancesDues}</span>
                          : c.relancesDues}
                      </TableCell>
                      <TableCell className="text-xs">
                        {c.crmSaisie === 0
                          ? <Badge variant="destructive" className="text-[10px]">0%</Badge>
                          : <span className="text-brand-green">{c.crmSaisie}%</span>}
                      </TableCell>
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
                    <TableHead className="text-xs">ID</TableHead>
                    <TableHead className="text-xs">Client</TableHead>
                    <TableHead className="text-xs">Courtier</TableHead>
                    <TableHead className="text-xs">Produit</TableHead>
                    <TableHead className="text-xs">Commission (€/an)</TableHead>
                    <TableHead className="text-xs">Risque</TableHead>
                    <TableHead className="text-xs">Action recommandée</TableHead>
                    <TableHead className="text-xs">Contacté</TableHead>
                    <TableHead className="text-xs">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contratsARisque.map((c) => (
                    <TableRow key={c.id} className="hover:bg-accent">
                      <TableCell className="text-xs font-mono">{c.id}</TableCell>
                      <TableCell className="text-xs font-medium">{c.prenom} {c.nom}</TableCell>
                      <TableCell className="text-xs">{c.courtier}</TableCell>
                      <TableCell className="text-xs">{c.produit}</TableCell>
                      <TableCell className="text-xs">{c.commission} €</TableCell>
                      <TableCell>{statusBadge(c.risque)}</TableCell>
                      <TableCell className="text-xs">{c.actionRecommandee}</TableCell>
                      <TableCell>
                        {c.contacte
                          ? <Badge className="text-[10px] bg-brand-green/10 text-brand-green">Oui</Badge>
                          : <Badge variant="destructive" className="text-[10px]">Non</Badge>}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" className="h-5 text-[10px] px-2 rounded-full">
                            <Phone className="size-3 mr-1" /> Appeler
                          </Button>
                          <Button size="sm" variant="ghost" className="h-5 text-[10px] px-2 rounded-full">
                            <CalendarClock className="size-3 mr-1" /> Planifier relance
                          </Button>
                          <Button size="sm" variant="ghost" className="h-5 text-[10px] px-2 rounded-full">
                            <ClipboardList className="size-3 mr-1" /> Qualifier motif
                          </Button>
                        </div>
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
                    <TableHead className="text-xs">Contrats signés</TableHead>
                    <TableHead className="text-xs">CAC</TableHead>
                    <TableHead className="text-xs">Gain net estimé</TableHead>
                    <TableHead className="text-xs">Recommandation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {canaux.map((c) => {
                    const cac = c.convertis > 0 && c.budget > 0 ? Math.round(c.budget / c.convertis) : 0;
                    const gainNet = c.convertis * 150 - c.budget;
                    const reco = c.canal === "Recommandations"
                      ? "Développer ++"
                      : cac > 300
                        ? "Réduire budget"
                        : "Maintenir";
                    return (
                      <TableRow key={c.canal} className="hover:bg-accent">
                        <TableCell className="text-xs font-medium">{c.canal}</TableCell>
                        <TableCell className="text-xs">{c.volume}</TableCell>
                        <TableCell className="text-xs">{c.tauxConversion}%</TableCell>
                        <TableCell className="text-xs">{c.cplMoyen ? `${c.cplMoyen} €` : "0 €"}</TableCell>
                        <TableCell className="text-xs">{c.budget > 0 ? `${c.budget.toLocaleString("fr-FR")} €` : "0 €"}</TableCell>
                        <TableCell className="text-xs">{c.convertis}</TableCell>
                        <TableCell className="text-xs">{cac > 0 ? `${cac} €` : "0 €"}</TableCell>
                        <TableCell className="text-xs">
                          {gainNet > 0
                            ? <span className="text-brand-green">+{gainNet.toLocaleString("fr-FR")} €</span>
                            : <span className="text-destructive">{gainNet.toLocaleString("fr-FR")} €</span>}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={reco.includes("Réduire") ? "destructive" : reco.includes("Développer") ? "default" : "secondary"}
                            className="text-[10px]"
                          >
                            {reco}
                          </Badge>
                        </TableCell>
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
                    <TableHead className="text-xs">Commission à risque</TableHead>
                    <TableHead className="text-xs">Priorité migration</TableHead>
                    <TableHead className="text-xs">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCourtiers.map((c) => {
                    const horsCRM = Math.round(c.contrats * (1 - c.crmSaisie / 100));
                    const commissionRisque = Math.round(c.commission * (1 - c.crmSaisie / 100));
                    return (
                      <TableRow key={c.nom} className="hover:bg-accent">
                        <TableCell className="text-xs font-medium">{c.nom}</TableCell>
                        <TableCell className="text-xs">{c.contrats}</TableCell>
                        <TableCell className="text-xs text-brand-green">{c.contrats - horsCRM}</TableCell>
                        <TableCell className="text-xs">
                          {horsCRM > 0
                            ? <span className="text-destructive font-medium">{horsCRM}</span>
                            : "0"}
                        </TableCell>
                        <TableCell className="text-xs">
                          {commissionRisque > 0
                            ? <span className="text-destructive">{commissionRisque.toLocaleString("fr-FR")} €</span>
                            : "0 €"}
                        </TableCell>
                        <TableCell>
                          {horsCRM > 0
                            ? <Badge variant="destructive" className="text-[10px]">Urgente</Badge>
                            : <Badge className="text-[10px] bg-brand-green/10 text-brand-green">Complète</Badge>}
                        </TableCell>
                        <TableCell>
                          {horsCRM > 0 && <Button size="sm" variant="outline" className="h-5 text-[10px] px-2 rounded-full">Migrer</Button>}
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
                    <TableHead className="text-xs">Statut</TableHead>
                    <TableHead className="text-xs">Nombre</TableHead>
                    <TableHead className="text-xs">Part du total</TableHead>
                    <TableHead className="text-xs">Description</TableHead>
                    <TableHead className="text-xs">Action recommandée</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pipelineData.map((row) => (
                    <TableRow key={row.statut} className="hover:bg-accent">
                      <TableCell className="text-xs font-medium">{row.statut}</TableCell>
                      <TableCell className="text-xs">{row.nombre.toLocaleString("fr-FR")}</TableCell>
                      <TableCell className="text-xs">{row.part}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{row.description}</TableCell>
                      <TableCell className="text-xs">{row.action}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
