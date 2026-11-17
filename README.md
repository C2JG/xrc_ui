# XRC UI – Tableau de contrôle du rover

Interface web de **pilotage et de supervision** du rover [XRC Rover](https://github.com/C2JG/xrc_rover), développée en équipe dans le cadre d'**EPFL Xplore**. Elle communique en temps réel avec le rover sous **ROS 2** grâce à **rosbridge** (WebSocket) et à la librairie **roslib**.

# Mon rôle :
intégration de la manette dans l'interface (lecture via la Gamepad API et envoi des commandes au rover), et affichage en temps réel des données des capteurs ultrasons et du gyroscope.

## Équipe

- [@C2JG](https://github.com/C2JG)
- [@AquIce](https://github.com/AquIce)

---
## Fonctionnalités

- **Pilotage à la manette** : la manette branchée sur le PC est lue directement dans le navigateur (Gamepad API). Ses joysticks, gâchettes et boutons sont envoyés au rover sur le topic `gamepad_input`.
- **Retour vidéo** : affichage du flux de la caméra du rover (`/camera/compressed_image`).
- **Capteurs en temps réel** :
  - distances mesurées par les capteurs **ultrasons** ;
  - accéléromètre et **gyroscope** (centrale inertielle MPU9250), affichés sous forme de graphiques.
- **Schéma du rover** : vitesse de chaque roue et angle des servomoteurs, mis à jour en direct.
- **Commandes du rover** :
  - bascule entre les modes **manuel et automatique** (topic `/state_switch`) ;
  - **mode course** (`/gamepad_race_input`) ;
  - **extinction** du rover (`/poweroff`).

## Comment ça marche

```
Manette ──► Navigateur (React + Gamepad API) ──► rosbridge (ws://localhost:9090) ──► Rover (ROS 2)
                       ▲                                                               │
                       └──────────── vidéo, capteurs, vitesses des roues ◄─────────────┘
```

| Topic ROS | Sens | Contenu |
|---|---|---|
| `gamepad_input` | UI → rover | État de la manette (`GamepadData`) |
| `/state_switch` | UI → rover | Mode `MANUAL` / `AUTO` |
| `/gamepad_race_input` | UI → rover | Mode course |
| `/poweroff` | UI → rover | Extinction |
| `/ultrasonic_distance_feedback` | rover → UI | Distances des ultrasons |
| `/mpu_data_feedback` | rover → UI | Accéléromètre et gyroscope |
| `/dc_speed_feedback` | rover → UI | Vitesse des moteurs |
| `/servo_angle_update` | rover → UI | Angle des servomoteurs |
| `/camera/compressed_image` | rover → UI | Flux caméra |

## Technologies

React · TypeScript · Vite · Tailwind CSS · shadcn/ui · Recharts · roslib / rosbridge · Gamepad API · maquette Figma

## Lancer le projet

Prérequis : **Node.js**, ainsi que le rover (ou sa stack ROS 2) lancé avec **rosbridge** sur le port 9090 :

```bash
ros2 launch rosbridge_server rosbridge_websocket_launch.xml
```

Puis lancer l'interface :

```bash
npm install
npm run dev
```

Ouvre ensuite l'adresse affichée (par défaut `http://localhost:5173`) et branche une manette.



_Maquette initiale réalisée sur Figma. Copie du projet d'équipe original, publiée ici à titre de portfolio._
  # RoverDashbaord

  This is a code bundle for RoverDashbaord. The original project is available at https://www.figma.com/design/nxds9RTPWRbqARN6ElgURj/RoverDashbaord.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  
