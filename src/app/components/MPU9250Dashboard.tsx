import { Card } from "./ui/card";
import { useState, useEffect } from "react";
import { SensorDataCard } from "./SensorDataCard";
import { X } from "lucide-react";

interface MPU9250Data {
  accelerometer: {
    x: number;
    y: number;
    z: number;
  };
  gyroscope: {
    x: number;
    y: number;
    z: number;
  };
  magnetometer: {
    x: number;
    y: number;
    z: number;
  };
}

interface MPU9250DashboardProps {
  data: MPU9250Data;
}

export function MPU9250Dashboard({ data }: MPU9250DashboardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handle escape key to close fullscreen
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFullscreen(false);
      }
    };

    if (isFullscreen) {
      window.addEventListener("keydown", handleEscape);
      return () => window.removeEventListener("keydown", handleEscape);
    }
  }, [isFullscreen]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-blue-400">MPU 9250 Sensor Data</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Accelerometer */}
        <SensorDataCard
          title="Accelerometer"
          unit="g"
          data={data.accelerometer}
          precision={3}
          borderColor="border-blue-500"
          titleColor="text-blue-300"
          valueColor="text-green-400"
          footer={
            <>
              {"=>"} {Math.sqrt(
                data.accelerometer.x ** 2 +
                data.accelerometer.y ** 2 +
                data.accelerometer.z ** 2
              ).toFixed(3)} g
            </>
          }
        />

        {/* Gyroscope */}
        <SensorDataCard
          title="Gyroscope"
          unit="°/s"
          data={data.gyroscope}
          precision={2}
          borderColor="border-purple-500"
          titleColor="text-purple-300"
          valueColor="text-purple-400"
          footer={
            <>
              {"=>"} {Math.sqrt(
                data.gyroscope.x ** 2 +
                data.gyroscope.y ** 2 +
                data.gyroscope.z ** 2
              ).toFixed(2)} °/s
            </>
          }
        />

        {/* Magnetometer */}
        <SensorDataCard
          title="Magnetometer"
          unit="µT"
          data={data.magnetometer}
          precision={1}
          borderColor="border-cyan-500"
          titleColor="text-cyan-300"
          valueColor="text-cyan-400"
          footer={
            <>
              Heading: {Math.round((Math.atan2(data.magnetometer.y, data.magnetometer.x) * 180 / Math.PI + 360) % 360)}°
            </>
          }
        />

        {/* Camera Live Feed */}
        <Card className="p-4 bg-slate-900 border-red-500">
          <h3 className="text-lg font-semibold text-red-300 mb-3">Camera Feed</h3>
          <div 
            className="relative h-[calc(100%-2rem)] min-h-[150px] bg-black rounded overflow-hidden cursor-pointer hover:ring-2 hover:ring-red-500 transition-all"
            onClick={() => setIsFullscreen(true)}
          >
            {/* Camera feed image */}
            <img
              src="https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=400&h=300&fit=crop"
              alt="Rover camera view"
              className="w-full h-full object-cover"
            />
            
            {/* Live indicator */}
            <div className="absolute top-2 left-2 flex items-center gap-2 bg-black/70 px-2 py-1 rounded">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-400 text-xs font-semibold">LIVE</span>
            </div>
            
            {/* Crosshair overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-8 h-8">
                <div className="absolute top-0 left-1/2 w-0.5 h-3 bg-green-500/50 -translate-x-1/2"></div>
                <div className="absolute bottom-0 left-1/2 w-0.5 h-3 bg-green-500/50 -translate-x-1/2"></div>
                <div className="absolute left-0 top-1/2 w-3 h-0.5 bg-green-500/50 -translate-y-1/2"></div>
                <div className="absolute right-0 top-1/2 w-3 h-0.5 bg-green-500/50 -translate-y-1/2"></div>
              </div>
            </div>
          </div>
        </Card>
        
      </div>

      {/* Fullscreen Camera Modal */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={() => setIsFullscreen(false)}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 z-10 p-2 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
            onClick={() => setIsFullscreen(false)}
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Fullscreen camera view */}
          <div className="relative w-full h-full">
            <img
              src="https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=1920&h=1080&fit=crop"
              alt="Rover camera view fullscreen"
              className="w-full h-full object-contain"
            />
            
            {/* Live indicator */}
            <div className="absolute top-8 left-8 flex items-center gap-3 bg-black/70 px-4 py-2 rounded">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-400 text-lg font-semibold">LIVE</span>
            </div>

            {/* Timestamp */}
            <div className="absolute bottom-8 left-8 bg-black/70 px-4 py-2 rounded">
              <span className="text-white text-lg font-mono">
                {currentTime.toLocaleTimeString()}
              </span>
            </div>
            
            {/* Crosshair overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-16 h-16">
                <div className="absolute top-0 left-1/2 w-1 h-6 bg-green-500/50 -translate-x-1/2"></div>
                <div className="absolute bottom-0 left-1/2 w-1 h-6 bg-green-500/50 -translate-x-1/2"></div>
                <div className="absolute left-0 top-1/2 w-6 h-1 bg-green-500/50 -translate-y-1/2"></div>
                <div className="absolute right-0 top-1/2 w-6 h-1 bg-green-500/50 -translate-y-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}