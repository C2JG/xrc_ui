import { useState, useEffect, useRef } from "react";
import { RoverSchematic } from "./components/RoverSchematic";
//import * as ROSLIB from "roslib";
import { MPU9250Dashboard } from "./components/MPU9250Dashboard";
import { Card } from "./components/ui/card";

//instance ross share 
const ros = new ROSLIB.Ros({
  url: 'ws://localhost:9090'
});
const ultrasonicTopic = new ROSLIB.Topic({
  ros,
  name: "/ultrasonic_distance_feedback",
  messageType: "custom_msg/UltrasonicDistance",
}); 

const mpuTopic = new ROSLIB.Topic({
  ros,
  name: '/mpu_data_feedback',
  messageType: 'custom_msg/MPUData'
});

const DCSpeedTopic = new ROSLIB.Topic({
  ros,
  name: "/dc_speed_feedback",
  messageType: "custom_msg/DCSpeed",
}); 

const AngleServoTopic = new ROSLIB.Topic({
  ros,
  name: "/servo_angle_update",
  messageType: "custom_msg/ServoAngle",
}); 

const cameraTopic = new ROSLIB.Topic({
  ros,
  name: '/camera/processed_image',
  messageType: 'sensor_msgs/Image'
});

const publisher = new ROSLIB.Topic({
  ros,
  name: 'gamepad_input',
  messageType: 'custom_msg/GamepadData'
});

const raceModePublisher = new ROSLIB.Topic({
  ros,
  name: '/gamepad_race_input',
  messageType: 'std_msgs/Int32'
});

const stateSwitchPublisher = new ROSLIB.Topic({
  ros,
  name: '/state_switch',
  messageType: 'std_msgs/String'
});

const powerOffPublisher = new ROSLIB.Topic({
  ros,
  name: '/poweroff',
  messageType: 'std_msgs/Empty'
});

type ultrasonicData = {
  uFL: number;
  uFFL: number;
  uFFR: number;
  uFR: number;
  uML: number;
  uMR: number;
  uBL: number;
  uBR: number;
};

type WheelData = {
   FL: { speed: number; servoAngle: number };
   FR:{ speed: number; servoAngle: number };
   ML: { speed: number;};
   MR: { speed: number};
   BL: { speed: number; servoAngle: number };
   BR: { speed: number; servoAngle: number };
  };



const SENSOR_ID_TO_KEY = {
  1: "uML",  // Middle Left
  2: "uB",   // Back (centré)
  3: "uMR",  // Middle Right
  4: "uFL",  // Front Left
  5: "uFR",  // Front Right
} as const;



const WHEELs_ID_TO_KEY = {
   1:"FL",
   2:"FR",
   5:"ML",
   6:"MR",
   3:"BL",
   4:"BR"
  } as const;


export default function App() {
  // Ultrasonic sensor data (distance in cm) - 8 sensors total
  
  const [ultrasonicData, setUltrasonicData] = useState({
    uFL: 300,
    uFR: 300,
    uML: 300,
    uMR: 300,
    uB: 300,
  });


  // Wheel motor and servo data
  const [wheelData, setWheelData] = useState({
    FL: { speed: -100, servoAngle: -90 },
    FR: { speed: -100, servoAngle: -90 },
    ML: { speed: -100 }, // No servo
    MR: { speed: -100 }, // No servo
    BL: { speed: -100, servoAngle: -90 },
    BR: { speed: -100, servoAngle: -90 },
  });

  
  // MPU 9250 sensor data
  const [mpuData, setMpuData] = useState({
    accelerometer: { x: -0.2, y: -0.2, z: 9.6 },
    gyroscope: { x: -5, y: -5, z: -2.5 },
    magnetometer: { x: 25, y: 10, z: -25 },
  });

  const [raceMode, setRaceMode] = useState(0);

  const toggleRaceMode = () => {
  const newMode = raceMode === 0 ? 1 : 0;
  setRaceMode(newMode);
  raceModePublisher.publish(new ROSLIB.Message({ data: newMode }));
  console.log("[race_mode] published:", newMode);
  };

  const [autoMode, setAutoMode] = useState(false);
  const [powerOff, setPowerOff] = useState(false);

  const toggleAutoMode = () => {
  const newState = !autoMode;
  setAutoMode(newState);
  stateSwitchPublisher.publish(new ROSLIB.Message({ data: newState ? 'AUTO' : 'MANUAL' }));
  console.log("[state_switch] published:", newState ? 'AUTO' : 'MANUAL');
  };

  const togglePowerOff = () => {
  const newState = !powerOff;
  setPowerOff(newState);
  powerOffPublisher.publish(new ROSLIB.Message({}));
  console.log("[poweroff] published empty");
  };


  // Use refs to track current values for smooth incrementation
  const ultrasonicRef = useRef({ uFL: 300, uFFL: 300, uFFR: 300, uFR: 300, uML: 300, uMR: 300, uBL: 300, uBR: 300 });
  const wheelRef = useRef({
    FL: { speed: -100, servoAngle: -90 },
    FR: { speed: -100, servoAngle: -90 },
    ML: { speed: -100 },
    MR: { speed: -100 },
    BL: { speed: -100, servoAngle: -90 },
    BR: { speed: -100, servoAngle: -90 },
  });
  const mpuRef = useRef({
    accelerometer: { x: -0.2, y: -0.2, z: 9.6 },
    gyroscope: { x: -5, y: -5, z: -2.5 },
    magnetometer: { x: 25, y: 10, z: -25 },
  });

  const [cameraImage, setCameraImage] = useState<string | null>(null);

  useEffect(() => {
  cameraTopic.subscribe((msg: any) => {
    // msg.data est un array de bytes, on le convertit en base64
    const binary = String.fromCharCode(...new Uint8Array(msg.data));
    const base64 = btoa(binary);
    setCameraImage(`data:image/rgb8;base64,${base64}`);
  });
  }, []);
    
    
  // --- Souscriptions ROS ---
  useEffect(() => {
    const handleMessage = (msg: any) => {
      const key = SENSOR_ID_TO_KEY[msg.sensor as keyof typeof SENSOR_ID_TO_KEY];
      if (!key) return;
      console.log("[ultrasonic]", msg.sensor, "→", key, msg.distance);
      setUltrasonicData((prev) => ({
        ...prev,
        [key]: msg.distance,
      }));
    };

    const ActualisationSpeed = (msg: any) => {
      const key = WHEELs_ID_TO_KEY[msg.dc as keyof typeof WHEELs_ID_TO_KEY];
      if (!key) return;
      console.log("[dc speed]", msg.dc, "→", key, msg.speed);
      setWheelData((prev) => ({
        ...prev,
        [key]: { ...prev[key], speed: msg.speed },
      }));
    };

    const ActualisationAngle = (msg: any) => {
      const key = WHEELs_ID_TO_KEY[(msg.servo - 4) as keyof typeof WHEELs_ID_TO_KEY];
      if (!key) return;
      if (key === "ML" || key === "MR") return; // pas de servo au milieu
      console.log("[servo]", msg.servo, "→", key, msg.angle);
      setWheelData((prev) => ({
        ...prev,
        [key]: { ...prev[key], servoAngle: msg.angle },
      }));
    };

    const handleMPU = (msg: any) => {
    const { x, y, z, type } = msg;
    if (type === 97) {        // 'a'
      setMpuData(prev => ({ ...prev, accelerometer: { x, y, z } }));
    } else if (type === 103) { // 'g'
      setMpuData(prev => ({ ...prev, gyroscope: { x, y, z } }));
    } else if (type === 109) { // 'm'
      setMpuData(prev => ({ ...prev, magnetometer: { x, y, z } }));
    }
};

    mpuTopic.subscribe(handleMPU);
    ultrasonicTopic.subscribe(handleMessage);
    DCSpeedTopic.subscribe(ActualisationSpeed);
    AngleServoTopic.subscribe(ActualisationAngle);
    

  }, []);
      
  

  return (
  <div className="min-h-screen bg-slate-950 text-white p-6">
    <div className="max-w-7xl mx-auto space-y-6">

      {/* Status Bar */}
      <Card className="p-4 bg-slate-900 border-green-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-400 font-semibold">System Status: ONLINE</span>
          </div>
          <div className="text-gray-400 text-sm">
            Last Update: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </Card>

      {/* Control Buttons Row */}
      <Card className="p-3 bg-slate-900 border-slate-700">
        <div className="flex items-center gap-3">

          <button
            onDoubleClick={toggleRaceMode}
            className={`
              flex-1 py-2 rounded-full font-bold text-xs tracking-widest uppercase
              border-2 transition-all duration-200 active:scale-95
              ${raceMode === 1
                ? 'bg-red-600 border-red-400 text-white'
                : 'bg-slate-800 border-slate-600 text-gray-300 hover:border-slate-400'
              }
            `}
          >
            {raceMode === 1 ? '🏁 RACE' : '🐢 NORMAL'}
          </button>

          <button
            onDoubleClick={toggleAutoMode}
            className={`
              flex-1 py-2 rounded-full font-bold text-xs tracking-widest uppercase
              border-2 transition-all duration-200 active:scale-95
              ${autoMode
                ? 'bg-green-600 border-green-400 text-white'
                : 'bg-slate-800 border-red-600 text-red-400 hover:border-red-400'
              }
            `}
          >
            {autoMode ? '🤖 AUTO' : '🕹️ MANUAL'}
          </button>

          <button
            onDoubleClick={togglePowerOff}
            className={`
              flex-1 py-2 rounded-full font-bold text-xs tracking-widest uppercase
              border-2 transition-all duration-200 active:scale-95
              ${powerOff
                ? 'bg-slate-800 border-red-600 text-red-400 hover:border-red-400'
                : 'bg-green-600 border-green-400 text-white'
              }
            `}
          >
            {powerOff ? '💀' : '⚡ POWER ON'}
          </button>

        </div>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Rover Schematic Section */}
        <Card className="p-6 bg-slate-900 border-blue-500">
          <h2 className="text-2xl font-bold text-blue-400 mb-4">
            Rover Schematic
          </h2>
          <div className="h-[600px]">
            <RoverSchematic ultrasonicData={ultrasonicData} wheelData={wheelData} />
          </div>
        </Card>

        {/* MPU 9250 Dashboard Section */}
        <div className="self-start">
          <MPU9250Dashboard data={mpuData} cameraImage={cameraImage} />
        </div>

      </div>
    </div>
  </div>
);
}



window.addEventListener("gamepadconnected", () => {

  setInterval(() => {
    const gamepad = navigator.getGamepads()[0];
  
    if(!gamepad) {
      return;
    }

    publisher.publish(
      new ROSLIB.Message({ 
        axis_left_x:   gamepad.axes[0],
        axis_left_y:   (-1)*(gamepad.axes[1]),
        axis_right_x:  gamepad.axes[2],
        axis_right_y:  (-1)*(gamepad.axes[3]),
        trigger_left :(gamepad.axes[4] + 1) / 2,
        trigger_right :(gamepad.axes[5] + 1) / 2,
        button_right: gamepad.buttons[5].pressed,
        button_left: gamepad.buttons[4].pressed,
        button_a: gamepad.buttons[0].pressed,
        button_b: gamepad.buttons[1].pressed,
        button_x: gamepad.buttons[2].pressed,
        button_y: gamepad.buttons[3].pressed
      })
    );
  
    /*console.log({
      leftX:   gamepad.axes[0].toFixed(2),
      leftY:   gamepad.axes[1].toFixed(2),
      rightX:  gamepad.axes[2].toFixed(2),
      rightY:  gamepad.axes[3].toFixed(2),
      trigger_left :(gamepad.axes[4] + 1) / 2,
      trigger_right :(gamepad.axes[5] + 1) / 2,
      button_a: gamepad.buttons[0].pressed,
      button_b: gamepad.buttons[1].pressed,
      button_x: gamepad.buttons[2].pressed,
      button_y: gamepad.buttons[3].pressed,
    });*/
  
  }, 50);
});

/*setInterval(() => {
    const gamepad = navigator.getGamepads()[0];
    if (!gamepad) return;
    
    gamepad.buttons.forEach((btn, index) => {
        if (btn.pressed) console.log(`Button index: ${index}`);
    });
}, 50);*/