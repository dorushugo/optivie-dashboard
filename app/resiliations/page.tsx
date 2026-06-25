"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip as RechartsTooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/KpiCard";
import { kpiGlobal, motifsResiliations } from "@/data/optivie";

const DONUT_COLORS = [
  "hsl(30, 6%, 60%)",
  "hsl(0, 84%, 60%)",
  "hsl(38, 92%, 50%)",
  "hsl(200, 50%, 50%)",
  "hsl(270, 50%, 50%)",
  "hsl(162, 70%, 38%)",
];

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { motif: string; nombre: number } }> }) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="rounded-md border bg-popover px-3 py-2 text-sm shadow-md">
      <p className="font-semibold">{data.motif}</p>
      <p className="text-muted-foreground">{data.nombre} résiliations</p>
    </div>
  );
}

export default function ResiliationsPage() {
  const totalResiliations = motifsResiliations.reduce((sum, m) => sum + m.nombre, 0);
  const evitables = motifsResiliations.filter((m) => m.evitable).reduce((sum, m) => sum + m.nombre, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Résiliations & Rétention</h1>
        <p className="text-sm text-muted-foreground">
          Pilotage des départs clients — 2025
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <KpiCard
          title="Résiliations 2025"
          value={kpiGlobal.resiliationsAnnuelles.toString()}
          badge={{ label: "Critique", variant: "destructive" }}
        />
        <KpiCard
          title="Commissions perdues"
          value={`${kpiGlobal.commissionPerdue.toLocaleString("fr-FR")} €`}
          badge={{ label: "−56 630 €", variant: "destructive" }}
        />
        <KpiCard
          title="Contactés avant départ"
          value="0%"
          subtitle="Aucun contact proactif"
          badge={{ label: "Critique", variant: "destructive" }}
        />
        <KpiCard
          title="Sans motif renseigné"
          value="49%"
          subtitle="105 résiliations sans motif"
          badge={{ label: "Opacité", variant: "secondary" }}
        />
      </div>

      {/* Donut Chart - Motifs */}
      <Card className="rounded-lg border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold tracking-tight">
            Motifs de résiliation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-8">
            <ResponsiveContainer width="50%" height={320}>
              <PieChart>
                <Pie
                  data={motifsResiliations}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={120}
                  dataKey="nombre"
                  nameKey="motif"
                  paddingAngle={2}
                >
                  {motifsResiliations.map((_, index) => (
                    <Cell key={index} fill={DONUT_COLORS[index]} />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  formatter={(value) => <span className="text-xs">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 flex-1">
              {motifsResiliations.map((m, i) => (
                <div key={m.motif} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="size-3 rounded-full"
                      style={{ backgroundColor: DONUT_COLORS[i] }}
                    />
                    <span>{m.motif}</span>
                    {m.evitable && (
                      <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                        Évitable
                      </Badge>
                    )}
                  </div>
                  <span className="text-muted-foreground">
                    {m.nombre} ({Math.round((m.nombre / totalResiliations) * 100)}%)
                  </span>
                </div>
              ))}
              <p className="text-xs text-muted-foreground pt-3 border-t mt-3">
                <span className="font-semibold">{evitables} résiliations directement évitables</span>{" "}
                avec un contact proactif (offre concurrente + hausse de prime + insatisfaction).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline processus actuel vs cible */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="rounded-lg border bg-card shadow-sm border-l-4 border-l-destructive">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              Processus actuel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { step: "1", label: "Lead résilie son contrat" },
                { step: "2", label: "Sophie découvre en fin de mois via relevé" },
                { step: "3", label: "0 action entreprise" },
                { step: "4", label: "CA perdu définitivement" },
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-3">
                  <div className="size-6 rounded-full bg-destructive/10 flex items-center justify-center text-xs font-semibold text-destructive">
                    {item.step}
                  </div>
                  <p className="text-sm">{item.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg border bg-card shadow-sm border-l-4 border-l-brand-green">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              Processus cible
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { step: "1", label: "Alerte J-30 avant échéance" },
                { step: "2", label: "Appel proactif du courtier" },
                { step: "3", label: "Rétention 25–40% estimée" },
                { step: "4", label: "CA préservé" },
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-3">
                  <div className="size-6 rounded-full bg-brand-green/10 flex items-center justify-center text-xs font-semibold text-brand-green">
                    {item.step}
                  </div>
                  <p className="text-sm">{item.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
