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
  ReferenceLine,
  Cell,
} from "recharts";
import { CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { KpiCard } from "@/components/KpiCard";
import { AlertBadge } from "@/components/AlertBadge";
import {
  kpiGlobal,
  conversionDelai,
  impactRelances,
  courtiers,
  canaux,
} from "@/data/optivie";

const BRAND_GREEN = "hsl(162, 70%, 38%)";
const WARNING = "hsl(38, 92%, 50%)";
const DESTRUCTIVE = "hsl(0, 84%, 60%)";

const delaiColors = [BRAND_GREEN, WARNING, DESTRUCTIVE, DESTRUCTIVE];

const relancesColors = [DESTRUCTIVE, WARNING, "hsl(162, 50%, 45%)", BRAND_GREEN];

function CustomTooltipDelai({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border bg-popover px-3 py-2 text-sm shadow-md">
      <p className="font-semibold">{label}</p>
      <p className="text-muted-foreground">Taux : {payload[0].value}%</p>
    </div>
  );
}

function CustomTooltipRelances({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border bg-popover px-3 py-2 text-sm shadow-md">
      <p className="font-semibold">{label}</p>
      <p className="text-muted-foreground">Taux : {payload[0].value}%</p>
    </div>
  );
}

const courtiersByTranche: Record<string, Array<{ nom: string; taux: number }>> = {
  "1–4h": [{ nom: "Mehdi", taux: 57.1 }],
  "4–12h": [{ nom: "Sonia", taux: 39.6 }],
  "12–24h": [{ nom: "Axel", taux: 14.0 }],
  "24–48h": [{ nom: "Clara", taux: 8.0 }, { nom: "Romain", taux: 10.9 }],
};

export default function DashboardPage() {
  const [period, setPeriod] = useState<string>("Annuel");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedTranche, setSelectedTranche] = useState<string>("");

  const handleBarClick = (tranche: string) => {
    setSelectedTranche(tranche);
    setSheetOpen(true);
  };

  const periodLabel = period === "Ce mois" ? "Juin 2025" : period === "Ce trimestre" ? "T2 2025" : "2025";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Dashboard Commercial
          </h1>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("fr-FR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            {" "}&mdash; <span className="font-medium text-foreground">{periodLabel}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="rounded-full">
            Objectif : 1 500 contrats
          </Badge>
          <div className="flex items-center gap-1 ml-4">
            {["Ce mois", "Ce trimestre", "Annuel"].map((p) => (
              <Button
                key={p}
                variant={period === p ? "default" : "outline"}
                size="sm"
                className="rounded-full text-xs"
                onClick={() => setPeriod(p)}
              >
                {p}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <KpiCard
          title="Contrats actifs"
          value="1 200"
          progress={{ value: kpiGlobal.contratsActifs, max: kpiGlobal.objectifContrats }}
        />
        <KpiCard
          title="Taux de conversion"
          value={`${kpiGlobal.tauxConversion}%`}
          subtitle="Cible : 32%"
          badge={{ label: "Sous-performance", variant: "destructive" }}
        />
        <KpiCard
          title="Leads ce mois"
          value={kpiGlobal.leadsMensuels.toString()}
          badge={{ label: "Stable", variant: "secondary" }}
        />
        <KpiCard
          title="Commissions perdues"
          value={`${kpiGlobal.commissionPerdue.toLocaleString("fr-FR")} €`}
          subtitle={`${kpiGlobal.resiliationsAnnuelles} résiliations`}
          badge={{ label: "Critique", variant: "destructive" }}
        />
      </div>

      {/* Alerte SLA */}
      <AlertBadge
        title="Alerte SLA — Délai de premier contact"
        description="62% des leads sont contactés après 12h. Taux de conversion actuel : 10,6%. Avec un SLA 4h : potentiel 40–50%."
        variant="destructive"
      />

      {/* Graphique délai × conversion */}
      <Card className="rounded-lg border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold tracking-tight">
            Conversion par délai de premier contact
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Corrélation r = -0,95 — chaque heure perdue réduit la conversion
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={conversionDelai} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 10%, 88%)" />
              <XAxis dataKey="tranche" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} unit="%" />
              <RechartsTooltip content={<CustomTooltipDelai />} />
              <ReferenceLine
                y={50.3}
                stroke={BRAND_GREEN}
                strokeDasharray="4 4"
                label={{ value: "SLA 4h", position: "right", fontSize: 11, fill: BRAND_GREEN }}
              />
              <Bar
                dataKey="taux"
                radius={[4, 4, 0, 0]}
                cursor="pointer"
                onClick={(data) => handleBarClick((data as unknown as { tranche: string }).tranche)}
              >
                {conversionDelai.map((_, index) => (
                  <Cell key={index} fill={delaiColors[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Sheet détail par tranche */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Courtiers — Tranche {selectedTranche}</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-3">
            {courtiersByTranche[selectedTranche]?.map((c) => (
              <div key={c.nom} className="flex items-center justify-between rounded-md border p-3">
                <span className="font-medium">{c.nom}</span>
                <Badge variant={c.taux > 30 ? "default" : "destructive"}>
                  {c.taux}%
                </Badge>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* Graphique impact des relances */}
      <Card className="rounded-lg border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold tracking-tight">
            Impact des relances sur la conversion
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            73% des leads reçoivent 0 relance — gain potentiel : +238 contrats (+35 700 €/an)
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={impactRelances} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 10%, 88%)" />
              <XAxis dataKey="relances" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} unit="%" />
              <RechartsTooltip content={<CustomTooltipRelances />} />
              <Bar dataKey="taux" radius={[4, 4, 0, 0]}>
                {impactRelances.map((_, index) => (
                  <Cell key={index} fill={relancesColors[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 text-xs text-muted-foreground text-center">
            <Badge variant="secondary" className="rounded-full">
              2 relances = ×2,6 vs 0 relance
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Tableau courtiers */}
      <Card className="rounded-lg border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold tracking-tight">
            Performance par courtier
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead className="text-right">Contrats</TableHead>
                <TableHead className="text-right">CRM</TableHead>
                <TableHead className="text-right">Délai médian</TableHead>
                <TableHead className="text-right">Conversion</TableHead>
                <TableHead className="text-right">Churn</TableHead>
                <TableHead className="text-center">SLA</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courtiers.map((c) => {
                const rowBg =
                  c.statut === "critique"
                    ? "bg-destructive/5"
                    : c.statut === "alerte"
                    ? "bg-warning/5"
                    : "bg-brand-green/5";

                return (
                  <TableRow key={c.nom} className={`${rowBg} hover:bg-accent`}>
                    <TableCell className="font-medium">
                      {c.nom === "Mehdi" ? (
                        <Tooltip>
                          <TooltipTrigger className="cursor-help underline decoration-dotted">
                            {c.nom}
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>
                              Attention — 78 068 € de commissions récurrentes
                              non tracées dans le CRM. Risque de perte totale en
                              cas de départ.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        c.nom
                      )}
                    </TableCell>
                    <TableCell className="text-right">{c.contrats}</TableCell>
                    <TableCell className="text-right">
                      {c.crmSaisie === 0 ? (
                        <Badge variant="destructive">CRM 0%</Badge>
                      ) : (
                        <span className="text-brand-green font-medium">100%</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">{c.delaiMedian}h</TableCell>
                    <TableCell className="text-right">{c.tauxConversion}%</TableCell>
                    <TableCell className="text-right">
                      {c.churn !== null ? `${c.churn}%` : "—"}
                    </TableCell>
                    <TableCell className="text-center">
                      {c.delaiMedian <= 4 ? (
                        <CheckCircle className="size-4 text-brand-green mx-auto" />
                      ) : (
                        <XCircle className="size-4 text-destructive mx-auto" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          c.statut === "critique"
                            ? "destructive"
                            : c.statut === "bon"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {c.statut}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Canaux d'acquisition */}
      <div className="grid grid-cols-3 gap-4">
        {canaux.map((c) => {
          const borderColor =
            c.canal === "Comparateurs"
              ? "border-l-warning"
              : c.canal === "Recommandations"
              ? "border-l-brand-green"
              : "border-l-border";

          return (
            <Card
              key={c.canal}
              className={`rounded-lg border bg-card shadow-sm border-l-4 ${borderColor}`}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{c.canal}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <p className="text-2xl font-bold">{c.volume} leads</p>
                <p className="text-sm text-muted-foreground">
                  Conversion : {c.tauxConversion}%
                </p>
                <p className="text-sm text-muted-foreground">
                  CAC : {c.cac !== null ? `${c.cac} €` : "—"}
                </p>
                {c.budget > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Budget : {c.budget.toLocaleString("fr-FR")} €/an
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
