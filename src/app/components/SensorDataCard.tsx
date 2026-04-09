import { Card } from "./ui/card";
import { ReactNode } from "react";

interface SensorDataCardProps {
  title: string;
  unit: string;
  data: {
    x: number;
    y: number;
    z: number;
  };
  precision: number;
  borderColor: string;
  titleColor: string;
  valueColor: string;
  footer?: ReactNode;
}

export function SensorDataCard({
  title,
  unit,
  data,
  precision,
  borderColor,
  titleColor,
  valueColor,
  footer,
}: SensorDataCardProps) {
  return (
    <Card className={`p-4 bg-slate-900 ${borderColor}`}>
      <h3 className={`text-lg font-semibold ${titleColor} mb-3`}>
        {title} [{unit}]
      </h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">X</span>
          <span className={`text-xl font-mono ${valueColor}`}>
            {data.x.toFixed(precision)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Y</span>
          <span className={`text-xl font-mono ${valueColor}`}>
            {data.y.toFixed(precision)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Z</span>
          <span className={`text-xl font-mono ${valueColor}`}>
            {data.z.toFixed(precision)}
          </span>
        </div>
      </div>
      {footer && (
        <div className="mt-3 pt-3 border-t border-slate-700">
          <div className="text-xs text-gray-500">{footer}</div>
        </div>
      )}
    </Card>
  );
}
