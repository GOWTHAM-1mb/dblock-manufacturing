
import { Card } from "@/components/ui/card";
import { ElementType } from "react";

interface MetricCardProps {
  title: string;
  value: number;
  icon: ElementType;
  onClick: () => void;
}

export const MetricCard = ({ title, value, icon: Icon, onClick }: MetricCardProps) => (
  <Card
    className="p-6 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
    onClick={onClick}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-3xl font-bold text-navy">{value}</p>
        <p className="text-sm text-gray-600 mt-1">{title}</p>
      </div>
      <Icon className="h-8 w-8 text-navy opacity-80" />
    </div>
  </Card>
);
