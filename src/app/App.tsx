import { useState, useEffect, useRef } from "react";
import { RoverSchematic } from "./components/RoverSchematic";
import { MPU9250Dashboard } from "./components/MPU9250Dashboard";
import { Card } from "./components/ui/card";

export default function App() {
  // Ultrasonic sensor data (distance in cm) - 8 sensors total
  const [ultrasonicData, setUltrasonicData] = useState({
    uFL: 300,   // Front Left
    uFFL: 300,  // Front Front Left
    uFFR: 300,  // Front Front Right
    uFR: 300,   // Front Right
    uML: 300,   // Middle Left (side)
    uMR: 300,   // Middle Right (side)
    uBL: 300,   // Back Left
    uBR: 300,   // Back Right
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

  // Simulate real-time sensor data updates with smooth incrementation
  useEffect(() => {
    const interval = setInterval(() => {
      // Increment ultrasonic sensors (50-250 cm, increment by 2)
      const newUltrasonic = { ...ultrasonicRef.current };
      Object.keys(newUltrasonic).forEach((key) => {
        const k = key as keyof typeof newUltrasonic;
        newUltrasonic[k] -= 10;
        if (newUltrasonic[k] < 0) newUltrasonic[k] = 300;
      });
      ultrasonicRef.current = newUltrasonic;
      setUltrasonicData(newUltrasonic);

      // Increment wheel speeds (-100 to 100, increment by 2) and servo angles (-90 to 90, increment by 2)
      const newWheelData = { ...wheelRef.current };
      
      // Front Left
      newWheelData.FL.speed += 2;
      if (newWheelData.FL.speed > 100) newWheelData.FL.speed = -100;
      newWheelData.FL.servoAngle += 2;
      if (newWheelData.FL.servoAngle > 90) newWheelData.FL.servoAngle = -90;
      
      // Front Right
      newWheelData.FR.speed += 2;
      if (newWheelData.FR.speed > 100) newWheelData.FR.speed = -100;
      newWheelData.FR.servoAngle += 2;
      if (newWheelData.FR.servoAngle > 90) newWheelData.FR.servoAngle = -90;
      
      // Middle Left
      newWheelData.ML.speed += 2;
      if (newWheelData.ML.speed > 100) newWheelData.ML.speed = -100;
      
      // Middle Right
      newWheelData.MR.speed += 2;
      if (newWheelData.MR.speed > 100) newWheelData.MR.speed = -100;
      
      // Back Left
      newWheelData.BL.speed += 2;
      if (newWheelData.BL.speed > 100) newWheelData.BL.speed = -100;
      newWheelData.BL.servoAngle += 2;
      if (newWheelData.BL.servoAngle > 90) newWheelData.BL.servoAngle = -90;
      
      // Back Right
      newWheelData.BR.speed += 2;
      if (newWheelData.BR.speed > 100) newWheelData.BR.speed = -100;
      newWheelData.BR.servoAngle += 2;
      if (newWheelData.BR.servoAngle > 90) newWheelData.BR.servoAngle = -90;
      
      wheelRef.current = newWheelData;
      setWheelData(newWheelData);

      // Increment MPU 9250 data smoothly
      const newMpuData = { ...mpuRef.current };
      
      // Accelerometer: x and y from -0.2 to 0.2 (step 0.01), z from 9.6 to 10.0 (step 0.01)
      newMpuData.accelerometer.x += 0.01;
      if (newMpuData.accelerometer.x > 0.2) newMpuData.accelerometer.x = -0.2;
      
      newMpuData.accelerometer.y += 0.01;
      if (newMpuData.accelerometer.y > 0.2) newMpuData.accelerometer.y = -0.2;
      
      newMpuData.accelerometer.z += 0.01;
      if (newMpuData.accelerometer.z > 10.0) newMpuData.accelerometer.z = 9.6;
      
      // Gyroscope: from -5 to 5 (step 0.2)
      newMpuData.gyroscope.x += 0.2;
      if (newMpuData.gyroscope.x > 5) newMpuData.gyroscope.x = -5;
      
      newMpuData.gyroscope.y += 0.2;
      if (newMpuData.gyroscope.y > 5) newMpuData.gyroscope.y = -5;
      
      newMpuData.gyroscope.z += 0.1;
      if (newMpuData.gyroscope.z > 2.5) newMpuData.gyroscope.z = -2.5;
      
      // Magnetometer: x from 25 to 35, y from 10 to 20, z from -25 to -15 (step 0.5)
      newMpuData.magnetometer.x += 0.5;
      if (newMpuData.magnetometer.x > 35) newMpuData.magnetometer.x = 25;
      
      newMpuData.magnetometer.y += 0.5;
      if (newMpuData.magnetometer.y > 20) newMpuData.magnetometer.y = 10;
      
      newMpuData.magnetometer.z += 0.5;
      if (newMpuData.magnetometer.z > -15) newMpuData.magnetometer.z = -25;
      
      mpuRef.current = newMpuData;
      setMpuData(newMpuData);
    }, 500); // Update every 500ms

    return () => clearInterval(interval);
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
          <div>
            <MPU9250Dashboard data={mpuData} />
          </div>
        </div>
      </div>
    </div>
  );
}

const ros = new ROSLIB.Ros({
  url: 'ws://localhost:9090'
});

window.addEventListener("gamepadconnected", () => {
    
  const publisher = new ROSLIB.Topic({
    ros,
    name: 'gamepad_input',
    messageType: 'custom_msg/GamepadData'
  });

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