interface WheelData {
  speed: number;
  servoAngle?: number;
}

interface RoverSchematicProps {
  ultrasonicData: {
    uFL: number;
    uFR: number;
    uML: number;
    uMR: number;
    uB: number;
  };
  wheelData: {
    FL: WheelData;
    FR: WheelData;
    ML: WheelData;
    MR: WheelData;
    BL: WheelData;
    BR: WheelData;
  };
}

export function RoverSchematic({ ultrasonicData, wheelData }: RoverSchematicProps) {
  const getLayerColors = (distance: number) => {
    if (distance < 75) {
      return { inner: '#ef4444', middle: '#eab308', outer: '#22c55e' };
    } if (distance < 150) {
      return { inner: '#6b7280', middle: '#eab308', outer: '#22c55e' };
    } if (distance < 200) {
      return { inner: '#6b7280', middle: '#6b7280', outer: '#22c55e' };
    }
    return { inner: '#6b7280', middle: '#6b7280', outer: '#6b7280' };
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg
        viewBox="0 0 500 750"
        className="w-full h-full max-w-md"
        xmlns="http://www.w3.org/2000/svg"
      >

        {/* Rover Body */}
        <path
          d="M 150 150 L 100 200 L 100 550 L 350 550 L 400 550 L 400 200 L 350 150 Z"
          fill="#2a2a2a"
          stroke="#4a90e2"
          strokeWidth="3"
        />

        {/* Detection zones - dessinées APRES le corps pour ne pas être cachées */}

        {/* uFL - Front Left (diagonal) */}
        {(() => {
          const colors = getLayerColors(ultrasonicData.uFL);
          return (
            <>
              <line x1="120" y1="160" x2="80" y2="120" stroke={colors.outer} strokeWidth="3" opacity="0.8" />
              <line x1="115" y1="165" x2="85" y2="135" stroke={colors.middle} strokeWidth="3" opacity="0.8" />
              <line x1="110" y1="170" x2="90" y2="150" stroke={colors.inner} strokeWidth="3" opacity="0.8" />
            </>
          );
        })()}

        {/* uFR - Front Right (diagonal) */}
        {(() => {
          const colors = getLayerColors(ultrasonicData.uFR);
          return (
            <>
              <line x1="380" y1="160" x2="420" y2="120" stroke={colors.outer} strokeWidth="3" opacity="0.8" />
              <line x1="385" y1="165" x2="415" y2="135" stroke={colors.middle} strokeWidth="3" opacity="0.8" />
              <line x1="390" y1="170" x2="410" y2="150" stroke={colors.inner} strokeWidth="3" opacity="0.8" />
            </>
          );
        })()}

        {/* uML - Middle Left (horizontal) */}
        {(() => {
          const colors = getLayerColors(ultrasonicData.uML);
          return (
            <>
              <line x1="-4.5" y1="377.5" x2="62.5" y2="377.5" stroke={colors.outer} strokeWidth="3" opacity="0.8" />
              <line x1="15.5" y1="370" x2="62.5" y2="370" stroke={colors.middle} strokeWidth="3" opacity="0.8" />
              <line x1="35.5" y1="362.5" x2="62.5" y2="362.5" stroke={colors.inner} strokeWidth="3" opacity="0.8" />
            </>
          );
        })()}

        {/* uMR - Middle Right (horizontal) */}
        {(() => {
          const colors = getLayerColors(ultrasonicData.uMR);
          return (
            <>
              <line x1="437.5" y1="377.5" x2="504.5" y2="377.5" stroke={colors.outer} strokeWidth="3" opacity="0.8" />
              <line x1="437.5" y1="370" x2="484.5" y2="370" stroke={colors.middle} strokeWidth="3" opacity="0.8" />
              <line x1="437.5" y1="362.5" x2="464.5" y2="362.5" stroke={colors.inner} strokeWidth="3" opacity="0.8" />
            </>
          );
        })()}

        {/* uB - Back centré (vertical vers le bas) */}
        {(() => {
          const colors = getLayerColors(ultrasonicData.uB);
          return (
            <>
              <line x1="250" y1="562.5" x2="250" y2="629.5" stroke={colors.outer} strokeWidth="3" opacity="0.8" />
              <line x1="243" y1="562.5" x2="243" y2="609.5" stroke={colors.middle} strokeWidth="3" opacity="0.8" />
              <line x1="257" y1="562.5" x2="257" y2="589.5" stroke={colors.inner} strokeWidth="3" opacity="0.8" />
            </>
          );
        })()}

        {/* Wheels */}

        {/* Front Left Wheel (FL) */}
        <rect x="70" y="200" width="30" height="60" rx="8" fill="#1a1a1a" stroke="#4a90e2" strokeWidth="2" />
        {/* Middle Left Wheel (ML) */}
        <rect x="70" y="345" width="30" height="60" rx="8" fill="#1a1a1a" stroke="#4a90e2" strokeWidth="2" />
        {/* Back Left Wheel (BL) */}
        <rect x="70" y="490" width="30" height="60" rx="8" fill="#1a1a1a" stroke="#4a90e2" strokeWidth="2" />
        {/* Front Right Wheel (FR) */}
        <rect x="400" y="200" width="30" height="60" rx="8" fill="#1a1a1a" stroke="#4a90e2" strokeWidth="2" />
        {/* Middle Right Wheel (MR) */}
        <rect x="400" y="345" width="30" height="60" rx="8" fill="#1a1a1a" stroke="#4a90e2" strokeWidth="2" />
        {/* Back Right Wheel (BR) */}
        <rect x="400" y="490" width="30" height="60" rx="8" fill="#1a1a1a" stroke="#4a90e2" strokeWidth="2" />

        {/* Wheel data displays */}

        {/* FL */}
        <foreignObject x="110" y="205" width="80" height="50">
          <div className="bg-slate-900 border border-blue-400 rounded px-2 py-1 text-xs">
            <div className="text-yellow-400 w-[60px]">{wheelData.FL.speed} RPM</div>
            {wheelData.FL.servoAngle !== undefined && (
              <div className="text-green-400 w-[60px]">{wheelData.FL.servoAngle}°</div>
            )}
          </div>
        </foreignObject>

        {/* ML */}
        <foreignObject x="110" y="350" width="80" height="50">
          <div className="bg-slate-900 border border-blue-400 rounded px-2 py-1 text-xs">
            <div className="text-yellow-400 w-[60px]">{wheelData.ML.speed} RPM</div>
            <div className="text-gray-500 italic text-[10px]">No servo</div>
          </div>
        </foreignObject>

        {/* BL */}
        <foreignObject x="110" y="495" width="80" height="50">
          <div className="bg-slate-900 border border-blue-400 rounded px-2 py-1 text-xs">
            <div className="text-yellow-400 w-[60px]">{wheelData.BL.speed} RPM</div>
            {wheelData.BL.servoAngle !== undefined && (
              <div className="text-green-400 w-[60px]">{wheelData.BL.servoAngle}°</div>
            )}
          </div>
        </foreignObject>

        {/* FR */}
        <foreignObject x="310" y="205" width="80" height="50">
          <div className="bg-slate-900 border border-blue-400 rounded px-2 py-1 text-xs">
            <div className="text-yellow-400 w-[60px]">{wheelData.FR.speed} RPM</div>
            {wheelData.FR.servoAngle !== undefined && (
              <div className="text-green-400 w-[60px]">{wheelData.FR.servoAngle}°</div>
            )}
          </div>
        </foreignObject>

        {/* MR */}
        <foreignObject x="310" y="350" width="80" height="50">
          <div className="bg-slate-900 border border-blue-400 rounded px-2 py-1 text-xs">
            <div className="text-yellow-400 w-[60px]">{wheelData.MR.speed} RPM</div>
            <div className="text-gray-500 italic text-[10px]">No servo</div>
          </div>
        </foreignObject>

        {/* BR */}
        <foreignObject x="310" y="495" width="80" height="50">
          <div className="bg-slate-900 border border-blue-400 rounded px-2 py-1 text-xs">
            <div className="text-yellow-400 w-[60px]">{wheelData.BR.speed} RPM</div>
            {wheelData.BR.servoAngle !== undefined && (
              <div className="text-green-400 w-[60px]">{wheelData.BR.servoAngle}°</div>
            )}
          </div>
        </foreignObject>

        {/* Ultrasonic Sensors */}

        {/* uFL - Front Left diagonal */}
        <rect x="109" y="165" width="30" height="12" rx="3" fill="#e74c3c" stroke="#ff6b6b" strokeWidth="2"
          transform="rotate(-45 130 171)" />

        {/* uFR - Front Right diagonal */}
        <rect x="362" y="165" width="30" height="12" rx="3" fill="#e74c3c" stroke="#ff6b6b" strokeWidth="2"
          transform="rotate(45 370 171)" />

        {/* uML - Middle Left */}
        <rect x="94" y="360" width="12" height="30" rx="4" fill="#e74c3c" stroke="#ff6b6b" strokeWidth="2" />

        {/* uMR - Middle Right */}
        <rect x="393" y="360" width="12" height="30" rx="4" fill="#e74c3c" stroke="#ff6b6b" strokeWidth="2" />

        {/* uB - Back centré */}
        <rect x="235" y="544" width="30" height="12" rx="3" fill="#e74c3c" stroke="#ff6b6b" strokeWidth="2" />

        {/* Direction indicator */}
        <path
          d="M 250 280 L 250 250 M 250 250 L 235 265 M 250 250 L 265 265"
          stroke="#27ae60"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

      </svg>
    </div>
  );
}
