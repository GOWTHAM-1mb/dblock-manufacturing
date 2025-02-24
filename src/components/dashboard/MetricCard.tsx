
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
    className="p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50 dark:from-navy-light dark:to-navy relative overflow-hidden group"
    onClick={onClick}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="flex items-center justify-between relative">
      <div className="space-y-2">
        <p className="text-4xl font-bold bg-gradient-to-r from-navy to-primary bg-clip-text text-transparent animate-fadeIn">
          {value}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
          {title}
        </p>
      </div>
      <div className="relative">
        <div className="absolute -inset-4 bg-primary/10 rounded-full blur-lg group-hover:blur-xl transition-all duration-300 opacity-0 group-hover:opacity-75" />
        <Icon className="h-10 w-10 text-navy dark:text-white opacity-80 relative z-10 transition-transform duration-300 group-hover:scale-110" />
      </div>
    </div>
  </Card>
);
