import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type AlertBadgeProps = {
  title: string;
  description: string;
  variant?: "destructive" | "warning";
};

export function AlertBadge({ title, description, variant = "destructive" }: AlertBadgeProps) {
  const borderColor = variant === "destructive" ? "border-l-destructive" : "border-l-warning";
  const iconColor = variant === "destructive" ? "text-destructive" : "text-warning";

  return (
    <Card className={`rounded-lg border bg-card shadow-sm border-l-4 ${borderColor}`}>
      <CardContent className="flex items-start gap-3 pt-4">
        <AlertTriangle className={`size-5 shrink-0 mt-0.5 ${iconColor}`} />
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
