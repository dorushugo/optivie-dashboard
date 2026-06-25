"use client";

import { useState } from "react";
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
} from "recharts";
import {
  Phone,
  Mail,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  Target,
  ShieldAlert,
  Database,
  DollarSign,
  Info,
  ChevronRight,
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
} from "@/data/computed";

const BRAND_GREEN = "hsl(162, 70%, 38%)";
const WARNING = "hsl(38, 92%, 50%)";
const DESTRUCTIVE = "hsl(0, 84%, 60%)";

type KpiTileProps = {
  title: string;
  value: string;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  status?: "ok" | "warning" | "critical";
  info?: string;
  progress?: { value: number; max: number };
};

function KpiTile({ title, value, subtitle, trend, status, info, progress }: KpiTileProps) {
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
          {trend && (
            <TrendingUp className={`size-3.5 ${trend === "up" ? "text-brand-green" : trend === "down" ? "text-destructive rotate-180" : "text-muted-foreground"}`} />
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

function CustomChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name?: string }>; label?: string }) {
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
  const [periodFilter, setPeriodFilter] = useState<string>("mois");

  const kpis = computeKPIs();
  const actions = computePriorityActions();
  const courtierPerf = computeCourtierPerformance();

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
            Vue operationnelle du {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
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
          <Select value={periodFilter} onValueChange={(v) => setPeriodFilter(v ?? "mois")}>
            <SelectTrigger className="w-[120px] h-8 text-xs">
              <SelectValue placeholder="Periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jour">Aujourd&apos;hui</SelectItem>
              <SelectItem value="semaine">Cette semaine</SelectItem>
              <SelectItem value="mois">Ce mois</SelectItem>
              <SelectItem value="annuel">Annuel</SelectItem>
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
          title="Taux de conversion"
          value={`${kpis.tauxConversion}%`}
          subtitle={`${kpis.totalConvertis} convertis / ${kpis.totalLeads} leads`}
          status="critical"
          info="Part des leads transformes en contrats signes. Cible : 32%."
        />
        <KpiTile
          title="Contact sous SLA"
          value={`${kpis.tauxContactSLA}%`}
          subtitle={`${kpis.leadsHorsSLA} leads hors SLA (>4h)`}
          status="critical"
          info="Part des leads contactes en moins de 4h apres reception. Au-dela, la conversion chute de 50% a 10%."
        />
        <KpiTile
          title="Taux de relance"
          value={`${kpis.tauxRelance}%`}
          subtitle={`${kpis.leadsSansRelance} leads sans relance`}
          status="critical"
          info="Part des leads ayant recu au moins 1 relance. 2 relances multiplient la conversion par 2.6."
        />
        <KpiTile
          title="Saisie CRM"
          value={`${kpis.tauxCRM}%`}
          subtitle={`${kpis.contratsHorsCRM} contrats hors CRM`}
          status={kpis.tauxCRM < 80 ? "critical" : kpis.tauxCRM < 95 ? "warning" : "ok"}
          info="Part des contrats saisis dans le CRM. Les contrats hors CRM representent un risque en cas de depart du courtier."
        />
        <KpiTile
          title="Commissions perdues"
          value={`${kpis.commissionsPerdue.toLocaleString("fr-FR")} EUR`}
          subtitle={`${kpis.totalResiliations} resiliations`}
          status="critical"
          info="Total des commissions recurrentes perdues suite a des resiliations non anticipees en 2025."
        />
        <KpiTile
          title="Commissions a risque"
          value={`${kpis.commissionsARisque.toLocaleString("fr-FR")} EUR`}
          subtitle={`${kpis.resiliationsEvitables} evitables`}
          status="warning"
          info="Estimation des commissions associees aux clients susceptibles de resilier (motifs evitables : hausse de prime, offre concurrente, insatisfaction)."
        />
        <KpiTile
          title="CAC moyen"
          value={`${kpis.cacGlobal} EUR`}
          subtitle={`Budget : ${kpis.budgetTotal.toLocaleString("fr-FR")} EUR/an`}
          status="warning"
          info="Cout d'acquisition moyen par contrat signe via les comparateurs. Les recommandations convertissent a 42.6% pour 0 EUR."
        />
        <KpiTile
          title="Leads ce mois"
          value={kpis.leadsMensuels.toString()}
          trend="neutral"
          info="Volume mensuel moyen de leads recus tous canaux confondus."
        />
        <KpiTile
          title="Croissance nette"
          value={`+${kpis.croissanceNette}/mois`}
          subtitle="Contrats nets (signes - resilies)"
          trend="up"
          info="Nombre net de contrats gagnes par mois apres deduction des resiliations."
        />
      </div>

      {/* Main content: Actions + Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Priority actions */}
        <Card className="xl:col-span-1 rounded-lg border bg-card shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Priorites du jour</CardTitle>
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
                        <Button size="xs" variant="outline" className="h-5 text-[10px] px-2 rounded-full">
                          {action.type === "contacter" ? "Appeler" : action.type === "relancer" ? "Relancer" : action.type === "migrer_crm" ? "Migrer" : "Traiter"}
                        </Button>
                        <Button size="xs" variant="ghost" className="h-5 text-[10px] px-2 rounded-full">
                          Reassigner
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
                  <CardTitle className="text-sm font-semibold">Conversion selon le delai de premier contact</CardTitle>
                  <p className="text-[10px] text-muted-foreground">Correlation r = -0.95 : chaque heure perdue reduit la conversion</p>
                </div>
                <Tooltip>
                  <TooltipTrigger><Info className="size-3.5 text-muted-foreground/60" /></TooltipTrigger>
                  <TooltipContent className="max-w-xs text-xs">Les leads contactes en moins de 4h convertissent a 50%. Au-dela de 12h, le taux chute sous 12%. Le SLA cible est de 4h maximum.</TooltipContent>
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
                    <TooltipContent className="max-w-xs text-xs">73% des leads ne recoivent aucune relance. Avec 2 relances, la conversion passe de 15% a 39% (x2.6).</TooltipContent>
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
                  <CardTitle className="text-sm font-semibold">Evolution CPL comparateurs</CardTitle>
                  <Tooltip>
                    <TooltipTrigger><Info className="size-3.5 text-muted-foreground/60" /></TooltipTrigger>
                    <TooltipContent className="max-w-xs text-xs">Cout par lead en hausse de +31% sur l'annee pour les deux comparateurs. Annonce de +40% supplementaires pour 2027.</TooltipContent>
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
                <Button variant="ghost" size="xs" className="text-[10px] h-5 gap-1" onClick={() => window.location.href = "/operations"}>
                  Voir detail <ChevronRight className="size-3" />
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
                      <span>{c.delaiMedian}h delai</span>
                      <span>{c.crmSaisie}% CRM</span>
                      {c.leadsHorsSLA > 0 && (
                        <Badge variant="destructive" className="text-[9px] h-4">{c.leadsHorsSLA} hors SLA</Badge>
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
