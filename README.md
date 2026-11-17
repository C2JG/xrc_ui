# XRC UI – Rover Control Dashboard


Web interface to **drive and monitor** the [XRC Rover](https://github.com/C2JG/xrc_rover), built as a team project at **EPFL Xplore**. It talks to the rover's **ROS 2** stack in real time through **rosbridge** (WebSocket) and the **roslib** library.

# My role:
  integrated the gamepad into the interface (reading it through the Gamepad API and sending commands to the rover), and built the real-time display of the ultrasonic and gyroscope sensor data.


## Team

- [@C2JG](https://github.com/C2JG)
- [@AquIce](https://github.com/AquIce)
  
## Features

- **Gamepad driving**: a gamepad plugged into the computer is read directly in the browser (Gamepad API). Its sticks, triggers and buttons are sent to the rover on the `gamepad_input` topic.
- **Video feed**: displays the rover's camera stream (`/camera/compressed_image`).
- **Live sensor data**:
  - distances measured by the **ultrasonic** sensors;
  - accelerometer and **gyroscope** readings (MPU9250 IMU), shown as charts.
- **Rover schematic**: speed of each wheel and servo angles, updated live.
- **Rover controls**:
  - switch between **manual and automatic** modes (`/state_switch` topic);
  - **race mode** (`/gamepad_race_input`);
  - rover **power off** (`/poweroff`).

## How it works

```
Gamepad ──► Browser (React + Gamepad API) ──► rosbridge (ws://localhost:9090) ──► Rover (ROS 2)
                    ▲                                                             │
                    └───────────── video, sensors, wheel speeds ◄─────────────────┘
```

| ROS topic | Direction | Content |
|---|---|---|
| `gamepad_input` | UI → rover | Gamepad state (`GamepadData`) |
| `/state_switch` | UI → rover | `MANUAL` / `AUTO` mode |
| `/gamepad_race_input` | UI → rover | Race mode |
| `/poweroff` | UI → rover | Power off |
| `/ultrasonic_distance_feedback` | rover → UI | Ultrasonic distances |
| `/mpu_data_feedback` | rover → UI | Accelerometer and gyroscope |
| `/dc_speed_feedback` | rover → UI | Motor speeds |
| `/servo_angle_update` | rover → UI | Servo angles |
| `/camera/compressed_image` | rover → UI | Camera stream |

## Tech stack

React · TypeScript · Vite · Tailwind CSS · shadcn/ui · Recharts · roslib / rosbridge · Gamepad API · Figma mockup

## Getting started

Requirements: **Node.js**, and the rover (or its ROS 2 stack) running with **rosbridge** on port 9090:

```bash
ros2 launch rosbridge_server rosbridge_websocket_launch.xml
```

Then start the interface:

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (`http://localhost:5173` by default) and plug in a gamepad.


## Original Figma bundle

This project started as a code bundle exported from Figma for **RoverDashboard**. The original design is available on [Figma](https://www.figma.com/design/nxds9RTPWRbqARN6ElgURj/RoverDashbaord).

To run the code:

- Run `npm i` to install the dependencies.
- Run `npm run dev` to start the development server.

---

_Copy of the original team project, published here as part of my portfolio._
