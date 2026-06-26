"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import {
  Phone,
  Mail,
  RefreshCw,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  Database,
  Info,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  computeKPIs,
  computePriorityActions,
  computeCourtierPerformance,
  conversionDelai,
  impactRelances,
  evolutionCPL,
  getMoisList,
  getEvolutionData,
} from "@/data/computed";
import type { PeriodFilter } from "@/data/computed";

const BRAND_GREEN = "hsl(162, 70%, 38%)";
const WARNING = "hsl(38, 92%, 50%)";
const DESTRUCTIVE = "hsl(0, 84%, 60%)";

type KpiTileProps = {
  title: string;
  value: string;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  status?: "ok" | "warning" | "critical";
  info?: string;
  progress?: { value: number; max: number };
};

function KpiTile({ title, value, subtitle, trend, trendValue, status, info, progress }: KpiTileProps) {
  const statusColor = status === "critical" ? "text-destructive" : status === "warning" ? "text-warning" : "text-brand-green";
  const statusBg = status === "critical" ? "bg-destructive/5" : status === "warning" ? "bg-warning/5" : "";

  return (
    <Card className={`rounded-lg border bg-card shadow-sm ${statusBg}`}>
      <CardContent className="pt-4 pb-3 px-4">
        <div className="flex items-start justify-between mb-1">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</span>
          {info && (
            <Tooltip>
              <TooltipTrigger>
                <Info className="size-3.5 text-muted-foreground/60" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-xs">{info}</TooltipContent>
            </Tooltip>
          )}
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`text-2xl font-bold tracking-tight ${status ? statusColor : ""}`}>{value}</span>
          {trend && trendValue && (
            <span className={`inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
              trend === "up" ? "bg-brand-green/10 text-brand-green" : trend === "down" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
            }`}>
              {trend === "up" ? <ArrowUpRight className="size-3" /> : trend === "down" ? <ArrowDownRight className="size-3" /> : <Minus className="size-3" />}
              {trendValue}
            </span>
          )}
        </div>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        {progress && (
          <div className="mt-2">
            <Progress value={(progress.value / progress.max) * 100} className="h-1.5" />
            <p className="text-[10px] text-muted-foreground mt-0.5">{progress.value} / {progress.max}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CustomChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name?: string; color?: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="font-semibold">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-muted-foreground">{p.name}: {p.value}{typeof p.value === "number" && p.value < 100 ? "%" : ""}</p>
      ))}
    </div>
  );
}

const priorityColors: Record<string, string> = {
  critique: "bg-destructive/10 text-destructive border-destructive/20",
  haute: "bg-warning/10 text-warning border-warning/20",
  moyenne: "bg-muted text-muted-foreground border-border",
  basse: "bg-muted text-muted-foreground border-border",
};

const actionIcons: Record<string, typeof Phone> = {
  contacter: Phone,
  relancer: Mail,
  reassigner: RefreshCw,
  migrer_crm: Database,
  qualifier_motif: AlertTriangle,
  retention: ShieldAlert,
};

export default function CockpitPage() {
  const [courtierFilter, setCourtierFilter] = useState<string>("all");
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("annuel");

  const moisList = getMoisList();
  const kpis = useMemo(() => computeKPIs(periodFilter), [periodFilter]);
  const actions = computePriorityActions();
  const courtierPerf = computeCourtierPerformance();
  const evolutionData = getEvolutionData();

  const filteredActions = courtierFilter === "all"
    ? actions
    : actions.filter(a => a.courtier === courtierFilter || a.courtier === "Tous");

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Cockpit commercial</h1>
          <p className="text-sm text-muted-foreground">
            {kpis.periodLabel} — données calculées dynamiquement depuis le dataset
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={courtierFilter} onValueChange={(v) => setCourtierFilter(v ?? "all")}>
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <SelectValue placeholder="Courtier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les courtiers</SelectItem>
              {courtierPerf.map(c => (
                <SelectItem key={c.nom} value={c.nom}>{c.nom}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={periodFilter} onValueChange={(v) => setPeriodFilter((v ?? "annuel") as PeriodFilter)}>
            <SelectTrigger className="w-[150px] h-8 text-xs">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="annuel">Année 2025 (global)</SelectItem>
              <SelectItem value="T1">T1 2025</SelectItem>
              <SelectItem value="T2">T2 2025</SelectItem>
              <SelectItem value="T3">T3 2025</SelectItem>
              <SelectItem value="T4">T4 2025</SelectItem>
              {moisList.map(m => (
                <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        <KpiTile
          title="Contrats actifs"
          value={kpis.contratsActifs.toLocaleString("fr-FR")}
          progress={{ value: kpis.contratsActifs, max: kpis.objectifContrats }}
          info="Nombre de contrats en portefeuille. Objectif : 1 500 sous 18 mois."
        />
        <KpiTile
          title={kpis.isAnnual ? "Leads reçus" : "Leads du mois"}
          value={kpis.totalLeads.toLocaleString("fr-FR")}
          subtitle={kpis.isAnnual ? `Moyenne : ${kpis.leadsMoyenMensuel}/mois` : undefined}
          trend={kpis.evolution.leads !== null ? (kpis.evolution.leads > 0 ? "up" : kpis.evolution.leads < 0 ? "down" : "neutral") : undefined}
          trendValue={kpis.evolution.leads !== null ? `${kpis.evolution.leads > 0 ? "+" : ""}${kpis.evolution.leads}% vs M-1` : undefined}
          info="Nombre de leads reçus sur la période sélectionnée. Source : dataset Excel (Date lead)."
        />
        <KpiTile
          title="Taux de conversion"
          value={`${kpis.tauxConversion}%`}
          subtitle={`${kpis.totalConvertis} convertis / ${kpis.totalLeads} leads`}
          status="critical"
          trend={kpis.evolution.conversion !== null ? (kpis.evolution.conversion > 0 ? "up" : kpis.evolution.conversion < 0 ? "down" : "neutral") : undefined}
          trendValue={kpis.evolution.conversion !== null ? `${kpis.evolution.conversion > 0 ? "+" : ""}${kpis.evolution.conversion} pts` : undefined}
          info="Part des leads transformés en contrats signés sur la période. Cible : 32%."
        />
        <KpiTile
          title="Contact sous SLA"
          value={`${kpis.tauxContactSLA}%`}
          subtitle={`${kpis.leadsHorsSLA} leads hors SLA (>4h)`}
          status="critical"
          info="Part des leads contactés en moins de 4h. Au-delà, la conversion chute de 50% à 10%."
        />
        <KpiTile
          title="Taux de relance"
          value={`${kpis.tauxRelance}%`}
          subtitle={`${kpis.leadsSansRelance} leads sans relance`}
          status="critical"
          info="Part des leads ayant reçu au moins 1 relance. 2 relances × 2,6 la conversion."
        />
        <KpiTile
          title="Saisie CRM"
          value={`${kpis.tauxCRM}%`}
          subtitle={`${kpis.contratsHorsCRM} contrats hors CRM`}
          status={kpis.tauxCRM < 80 ? "critical" : kpis.tauxCRM < 95 ? "warning" : "ok"}
          info="Part des contrats saisis dans le CRM. Risque majeur en cas de départ du courtier."
        />
        <KpiTile
          title="Résiliations"
          value={kpis.totalResiliations.toString()}
          subtitle={`${kpis.commissionsPerdue.toLocaleString("fr-FR")} € perdus`}
          status="critical"
          trend={kpis.evolution.resiliations !== null ? (kpis.evolution.resiliations > 0 ? "down" : "up") : undefined}
          trendValue={kpis.evolution.resiliations !== null ? `${kpis.evolution.resiliations > 0 ? "+" : ""}${kpis.evolution.resiliations}% vs M-1` : undefined}
          info="Résiliations sur la période. Les résiliations en hausse sont signalées en rouge."
        />
        <KpiTile
          title="Commissions à risque"
          value={`${kpis.commissionsARisque.toLocaleString("fr-FR")} €`}
          subtitle={`${kpis.contratsARisque} contrats à risque`}
          status="warning"
          info="Somme des commissions récurrentes des contrats statut 'À risque' (portefeuille actuel)."
        />
        <KpiTile
          title="CAC comparateurs"
          value={`${kpis.cacComparateurs} €`}
          subtitle={`Budget : ${kpis.budgetComparateurs.toLocaleString("fr-FR")} €/an`}
          status="warning"
          info="Coût d'acquisition par contrat signé via comparateurs. Les recommandations convertissent à 42,6% pour 0 €."
        />
        <KpiTile
          title="Croissance nette"
          value={`+${kpis.croissanceNette}/mois`}
          subtitle="Contrats nets (signés − résiliés)"
          trend="up"
          info={kpis.isAnnual ? "415 convertis − 216 résiliations = 199/an soit 16,6/mois." : "Contrats nets gagnés sur la période sélectionnée."}
        />
      </div>

      {/* Évolution mensuelle */}
      <Card className="rounded-lg border bg-card shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold">Évolution mensuelle 2025</CardTitle>
              <p className="text-[10px] text-muted-foreground">Leads, conversions et résiliations par mois (source : dataset)</p>
            </div>
            <Tooltip>
              <TooltipTrigger><Info className="size-3.5 text-muted-foreground/60" /></TooltipTrigger>
              <TooltipContent className="max-w-xs text-xs">Données calculées depuis les colonnes Date lead, Date souscription et Date résiliation du dataset Excel.</TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={evolutionData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 10%, 90%)" />
              <XAxis dataKey="mois" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <RechartsTooltip content={<CustomChartTooltip />} />
              <Area type="monotone" dataKey="leads" stroke="hsl(220, 70%, 55%)" fill="hsl(220, 70%, 55%)" fillOpacity={0.1} strokeWidth={2} name="Leads" />
              <Area type="monotone" dataKey="convertis" stroke={BRAND_GREEN} fill={BRAND_GREEN} fillOpacity={0.1} strokeWidth={2} name="Convertis" />
              <Area type="monotone" dataKey="resiliations" stroke={DESTRUCTIVE} fill={DESTRUCTIVE} fillOpacity={0.1} strokeWidth={2} name="Résiliations" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Main content: Actions + Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Priority actions */}
        <Card className="xl:col-span-1 rounded-lg border bg-card shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Priorités du jour</CardTitle>
              <Badge variant="destructive" className="text-[10px]">{filteredActions.filter(a => a.priority === "critique").length} critiques</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[380px]">
              <div className="px-4 pb-4 space-y-2">
                {filteredActions.map((action) => {
                  const Icon = actionIcons[action.type] || AlertTriangle;
                  return (
                    <div
                      key={action.id}
                      className={`rounded-md border p-3 space-y-1.5 ${priorityColors[action.priority]}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2">
                          <Icon className="size-3.5 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs font-medium leading-tight">{action.label}</p>
                            <p className="text-[10px] opacity-75">{action.target} / {action.courtier}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-[9px] shrink-0 capitalize">{action.priority}</Badge>
                      </div>
                      <p className="text-[10px] opacity-60">{action.impact}</p>
                      <div className="flex gap-1.5 pt-1">
                        <Button size="sm" variant="outline" className="h-5 text-[10px] px-2 rounded-full">
                          {action.type === "contacter" ? "Appeler" : action.type === "relancer" ? "Relancer" : action.type === "migrer_crm" ? "Migrer" : "Traiter"}
                        </Button>
                        <Button size="sm" variant="ghost" className="h-5 text-[10px] px-2 rounded-full">
                          Réassigner
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Charts column */}
        <div className="xl:col-span-2 space-y-4">
          {/* Conversion par délai */}
          <Card className="rounded-lg border bg-card shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold">Conversion selon le délai de premier contact</CardTitle>
                  <p className="text-[10px] text-muted-foreground">Corrélation r = −0,95 : chaque heure perdue réduit la conversion</p>
                </div>
                <Tooltip>
                  <TooltipTrigger><Info className="size-3.5 text-muted-foreground/60" /></TooltipTrigger>
                  <TooltipContent className="max-w-xs text-xs">Les leads contactés en moins de 4h convertissent à 50%. Au-delà de 12h, le taux chute sous 12%. SLA cible : 4h.</TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={conversionDelai} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 10%, 90%)" />
                  <XAxis dataKey="tranche" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" />
                  <RechartsTooltip content={<CustomChartTooltip />} />
                  <Bar dataKey="taux" radius={[3, 3, 0, 0]} name="Taux">
                    {conversionDelai.map((_, i) => (
                      <Cell key={i} fill={i === 0 ? BRAND_GREEN : i === 1 ? WARNING : DESTRUCTIVE} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Two side-by-side charts */}
          <div className="grid grid-cols-2 gap-4">
            {/* Impact relances */}
            <Card className="rounded-lg border bg-card shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">Impact des relances</CardTitle>
                  <Tooltip>
                    <TooltipTrigger><Info className="size-3.5 text-muted-foreground/60" /></TooltipTrigger>
                    <TooltipContent className="max-w-xs text-xs">73% des leads ne reçoivent aucune relance. Avec 2 relances : conversion ×2,6.</TooltipContent>
                  </Tooltip>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={impactRelances} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 10%, 90%)" />
                    <XAxis dataKey="relances" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} unit="%" />
                    <RechartsTooltip content={<CustomChartTooltip />} />
                    <Bar dataKey="taux" radius={[3, 3, 0, 0]} name="Conversion">
                      {impactRelances.map((_, i) => (
                        <Cell key={i} fill={i === 0 ? DESTRUCTIVE : i === 1 ? WARNING : BRAND_GREEN} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* CPL Evolution */}
            <Card className="rounded-lg border bg-card shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">Évolution CPL comparateurs</CardTitle>
                  <Tooltip>
                    <TooltipTrigger><Info className="size-3.5 text-muted-foreground/60" /></TooltipTrigger>
                    <TooltipContent className="max-w-xs text-xs">CPL en hausse de +31% sur l&apos;année pour les deux comparateurs.</TooltipContent>
                  </Tooltip>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={evolutionCPL} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 10%, 90%)" />
                    <XAxis dataKey="mois" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} unit="€" />
                    <RechartsTooltip content={<CustomChartTooltip />} />
                    <Line type="monotone" dataKey="assurland" stroke={DESTRUCTIVE} strokeWidth={2} dot={false} name="Assurland" />
                    <Line type="monotone" dataKey="lesfurets" stroke={WARNING} strokeWidth={2} dot={false} name="LesFurets" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Courtier performance mini-table */}
          <Card className="rounded-lg border bg-card shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Performance courtiers</CardTitle>
                <Button variant="ghost" size="sm" className="text-[10px] h-5 gap-1" onClick={() => window.location.href = "/operations"}>
                  Voir détail <ChevronRight className="size-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1.5">
                {courtierPerf.map((c) => (
                  <div key={c.nom} className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-accent text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`size-2 rounded-full ${c.statut === "critique" ? "bg-destructive" : c.statut === "alerte" ? "bg-warning" : "bg-brand-green"}`} />
                      <span className="font-medium">{c.nom}</span>
                    </div>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <span>{c.contrats} contrats</span>
                      <span>{c.tauxConversion}% conv.</span>
                      <span>{c.delaiMedian}h délai</span>
                      <span>{c.crmSaisie}% CRM</span>
                      {c.horsSLA > 0 && (
                        <Badge variant="destructive" className="text-[9px] h-4">{c.horsSLA} hors SLA</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
