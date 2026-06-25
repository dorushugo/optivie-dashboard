"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { funnel, scenarios, kpisCibles } from "@/data/optivie";

const FUNNEL_COLORS = [
  "hsl(162, 70%, 38%)",
  "hsl(162, 50%, 50%)",
  "hsl(38, 92%, 50%)",
  "hsl(0, 84%, 60%)",
];

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border bg-popover px-3 py-2 text-sm shadow-md">
      <p className="font-semibold">{label}</p>
      <p className="text-muted-foreground">{payload[0].value.toLocaleString("fr-FR")} leads</p>
    </div>
  );
}

const kpiRows = [
  { label: "Délai de contact", baseline: "14h", m3: `${kpisCibles.delaiContactM3}h`, m6: `${kpisCibles.delaiContactM6}h` },
  { label: "Taux contact SLA", baseline: "38%", m3: `${kpisCibles.tauxContactSLAM3}%`, m6: `${kpisCibles.tauxContactSLAM6}%` },
  { label: "Taux relance", baseline: "27%", m3: `${kpisCibles.tauxRelanceM3}%`, m6: `${kpisCibles.tauxRelanceM6}%` },
  { label: "Saisie CRM", baseline: "80%", m3: `${kpisCibles.tauxSaisieCRMM3}%`, m6: `${kpisCibles.tauxSaisieCRMM6}%` },
  { label: "Taux de conversion", baseline: "20,2%", m3: `${kpisCibles.tauxConversionM3}%`, m6: `${kpisCibles.tauxConversionM6}%` },
  { label: "Churn mensuel", baseline: "1,5%", m3: `${kpisCibles.churnMensuelM3}%`, m6: `${kpisCibles.churnMensuelM6}%` },
  { label: "Contrats nets/mois", baseline: "22", m3: "—", m6: kpisCibles.contratsNetsM6.toString() },
  { label: "CAC", baseline: "353 €", m3: `${kpisCibles.cacM3} €`, m6: `${kpisCibles.cacM6} €` },
];

export default function PipelinePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Pipeline & Objectifs</h1>
        <p className="text-sm text-muted-foreground">
          Funnel commercial et plan de transformation
        </p>
      </div>

      {/* Funnel horizontal */}
      <Card className="rounded-lg border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold tracking-tight">
            Funnel commercial 2025
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            De la réception du lead à la conversion
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={funnel}
              layout="vertical"
              margin={{ top: 10, right: 80, left: 120, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 10%, 88%)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="etape" tick={{ fontSize: 12 }} width={110} />
              <RechartsTooltip content={<CustomTooltip />} />
              <Bar dataKey="valeur" radius={[0, 4, 4, 0]}>
                {funnel.map((_, index) => (
                  <Cell key={index} fill={FUNNEL_COLORS[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-4 mt-2">
            {funnel.map((f, i) => {
              if (i === funnel.length - 1) return null;
              const loss = Math.round((1 - funnel[i + 1].valeur / f.valeur) * 100);
              return (
                <Badge key={f.etape} variant="secondary" className="rounded-full text-xs">
                  −{loss}% déperdition
                </Badge>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* KPIs Cibles */}
      <Card className="rounded-lg border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold tracking-tight">
            KPIs cibles — Plan d&apos;amélioration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Indicateur</TableHead>
                <TableHead className="text-center">Baseline</TableHead>
                <TableHead className="text-center">Cible M3</TableHead>
                <TableHead className="text-center">Cible M6</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {kpiRows.map((row) => (
                <TableRow key={row.label} className="hover:bg-accent">
                  <TableCell className="font-medium">{row.label}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">{row.baseline}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="border-warning text-warning">
                      {row.m3}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="border-brand-green text-brand-green">
                      {row.m6}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Scénarios */}
      <div>
        <h2 className="text-lg font-semibold tracking-tight mb-4">
          Scénarios de transformation
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {scenarios.map((s) => {
            const isCible = s.nom === "Cible";
            return (
              <Card
                key={s.nom}
                className={`rounded-lg border bg-card shadow-sm ${
                  isCible ? "border-brand-green border-2 shadow-md" : ""
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">{s.nom}</CardTitle>
                    {isCible && (
                      <Badge className="bg-brand-green text-white rounded-full">
                        Recommandé
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Solutions : {s.solutions}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Investissement</p>
                      <p className="text-lg font-bold">
                        {s.investissement.toLocaleString("fr-FR")} €
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Gain annuel</p>
                      <p className="text-lg font-bold text-brand-green">
                        {s.gainAnnuel.toLocaleString("fr-FR")} €
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">ROI</p>
                      <p className="text-lg font-bold">×{s.roi}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Break-even</p>
                      <p className="text-lg font-bold">{s.breakeven} mois</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Contrats nets/mois</p>
                      <p className="text-lg font-bold">{s.contratsNets}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Délai objectif</p>
                      <p className="text-lg font-bold">{s.delaiObjectif} mois</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
