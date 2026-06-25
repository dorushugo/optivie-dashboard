"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { courtiers } from "@/data/optivie";

const COLORS = [
  "hsl(0, 84%, 60%)",
  "hsl(162, 70%, 38%)",
  "hsl(38, 92%, 50%)",
  "hsl(270, 50%, 50%)",
  "hsl(200, 60%, 50%)",
];

const radarData = [
  {
    axis: "Vitesse de contact",
    ...Object.fromEntries(
      courtiers.map((c) => [c.nom, Math.max(0, 100 - (c.delaiMedian / 31) * 100)])
    ),
  },
  {
    axis: "Taux de conversion",
    ...Object.fromEntries(
      courtiers.map((c) => [c.nom, (c.tauxConversion / 57.1) * 100])
    ),
  },
  {
    axis: "Saisie CRM",
    ...Object.fromEntries(
      courtiers.map((c) => [c.nom, c.crmSaisie])
    ),
  },
];

export default function CourtiersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Courtiers</h1>
        <p className="text-sm text-muted-foreground">
          Vue détaillée par courtier — performance individuelle
        </p>
      </div>

      {/* Cards par courtier */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
        {courtiers.map((c) => {
          const borderColor =
            c.statut === "critique"
              ? "border-l-destructive"
              : c.statut === "bon"
              ? "border-l-brand-green"
              : "border-l-warning";

          return (
            <Card key={c.nom} className={`rounded-lg border bg-card shadow-sm border-l-4 ${borderColor}`}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">{c.nom}</CardTitle>
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
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Contrats</p>
                    <p className="text-lg font-bold">{c.contrats}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Conversion</p>
                    <p className="text-lg font-bold">{c.tauxConversion}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Délai médian</p>
                    <div className="flex items-center gap-1">
                      <p className="text-lg font-bold">{c.delaiMedian}h</p>
                      {c.delaiMedian <= 4 ? (
                        <CheckCircle className="size-4 text-brand-green" />
                      ) : (
                        <XCircle className="size-4 text-destructive" />
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">CRM</p>
                    <p className="text-lg font-bold">
                      {c.crmSaisie === 0 ? (
                        <span className="text-destructive">0%</span>
                      ) : (
                        <span className="text-brand-green">100%</span>
                      )}
                    </p>
                  </div>
                </div>
                {c.churn !== null && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      Churn : <span className="font-semibold text-destructive">{c.churn}%</span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Radar Chart */}
      <Card className="rounded-lg border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold tracking-tight">
            Comparaison multi-axes (normalisé 0–100)
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Vitesse de contact (inversée), Taux de conversion, Saisie CRM
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(30, 10%, 88%)" />
              <PolarAngleAxis dataKey="axis" tick={{ fontSize: 12 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
              {courtiers.map((c, i) => (
                <Radar
                  key={c.nom}
                  name={c.nom}
                  dataKey={c.nom}
                  stroke={COLORS[i]}
                  fill={COLORS[i]}
                  fillOpacity={0.15}
                />
              ))}
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
