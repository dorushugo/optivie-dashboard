import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

type KpiCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  badge?: { label: string; variant: "default" | "secondary" | "destructive" | "outline" };
  progress?: { value: number; max: number };
};

export function KpiCard({ title, value, subtitle, badge, progress }: KpiCardProps) {
  return (
    <Card className="rounded-lg border bg-card shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {badge && <Badge variant={badge.variant}>{badge.label}</Badge>}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
        {progress && (
          <div className="mt-3">
            <Progress
              value={(progress.value / progress.max) * 100}
              className="h-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {progress.value} / {progress.max}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
