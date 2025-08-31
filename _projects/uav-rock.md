---
layout: project
title: "Autonomous UAV for Object Correspondence in Digital Twin Terrains"
date: 2025-01-01
summary: "PX4 + ROS 2 UAV pipeline for rock displacement detection in simulated digital twin terrains using photogrammetry, Gazebo, and YOLOv8."
image: /assets/projects/space-robotics/cover.png   # Replace with a 16:9 cover image
tags: [uav, ros2, px4, gazebo, yolo, photogrammetry, space-robotics]
links:
  - title: GitHub Repo
    url: https://github.com/btvvardhan/RAS598_project
  - title: Final Report
    url: /assets/projects/space-robotics/space-robotics-report.pdf
  - title: Demo Video
    url: https://www.youtube.com/watch?v=wzYCpQy7FVQ

---

## Autonomous UAV for Object Correspondence in Digital Twin Terrains
This project ( **RAS 598: Space Robotics and AI**) develops an **integrated UAV framework** for detecting and quantifying **rock displacements in a digital twin terrain**.  
It combines **PX4 flight control**, **ROS 2 middleware**, **Gazebo simulation**, and **YOLOv8 object detection** in a single workflow.  

The UAV autonomously flies over a photogrammetry-generated terrain, detects rocks in real time, estimates 3D world coordinates, and compares positions across terrains to measure displacement.

---

## Methodology

1. **Terrain Reconstruction**  
   - 150+ overlapping photos processed in **Meshroom** (SfM + MVS).  
   - Cleaned in **Blender**, exported as textured meshes.  
   - Rocks modeled individually for detection.  

   ![3D Terrain Reconstruction](/assets/projects/space-robotics/meshroom.png)

2. **Simulation Setup in Gazebo**  
   - Terrain + rocks imported as meshes in a custom SDF world.  
   - UAV platform: **PX4 x500_depth drone**.  
   - ROS–Gazebo bridge enabled RGB, depth, odometry topics.  

   ![Gazebo UAV Setup](/assets/projects/uav/gazebo.png)

3. **Data Collection & YOLOv8 Training**  
   - RGB images captured via teleoperation, annotated in Roboflow.  
   - YOLOv8n fine-tuned for 4 rock classes.  
   - Achieved mAP@0.5 ≈ **0.995** with near-perfect classification.  

   ![YOLO Training Dataset](/assets/projects/space-robotics/yolo.png)  
   ![PR & F1 Curves](/assets/projects/uav/pr-curve.png)

4. **Real-Time Detection & Localization**  
   - Rock centers projected via pinhole camera model using depth data.  
   - Coordinates transformed with TF2 (world → base_link → camera_link).  
   - Results visualized in **RViz2**.  

   ![RViz Visualization](/assets/projects/uav/rviz.png)

5. **Displacement Detection**  
   - A second world with displaced rocks validated correspondence detection.  
   - UAV detected **0.2–0.4 m displacements** with ±0.2 m accuracy.  

---

## Results

- **YOLOv8**: 0.99+ precision, recall, and F1 across thresholds.  
- **Localization**: ±0.2 m deviation in world-frame coordinates.  
- **Change Detection**: Correctly flagged displaced rocks across scenes.  
- **Inference Speed**: 15–20 ms per image → real-time capable.

---

## Demo Video

<div class="video-wrap">
  <iframe src="https://youtu.be/wzYCpQy7FVQ" 
  title="Simulation Demo" frameborder="0" allowfullscreen></iframe>
</div>

<!-- <div class="video-wrap">
  <iframe src="https://www.youtube.com/embed/YYYYYYYYYYY" title="YOLOv8 Detection Demo" frameborder="0" allowfullscreen></iframe>
</div> -->
<!-- 
(Replace `XXXXXXXXXXX` and `YYYYYYYYYYY` with your YouTube video IDs.) -->

---

## System Pipeline

- **ROS 2 Nodes**:
  1. `control.py` → UAV teleop & arming.  
  2. `yolo.py` → real-time inference from RGB feed.  
  3. `coordinates.py` → depth-based 3D estimation + TF transforms.  
  4. `tf_broadcaster` → PX4 odometry to world transforms.  
  5. `ros_gz_bridge` → ROS–Gazebo communication.  

- **Workflow**: detect → localize → transform → visualize → compare.  

---

## Conclusion

This UAV project demonstrates a complete **simulation-driven framework** for autonomous perception and environmental change detection.  
It is directly extensible to:
- **Planetary exploration**  
- **Disaster response**  
- **Archaeological site monitoring**  
- **Infrastructure inspection**  

---

📄 **Full Report**: [Download PDF](/assets/projects/space-robotics-report/space-robotics-report.pdf)  
🔗 **GitHub Repository**: [RAS598 Project](https://github.com/btvvardhan/RAS598_project)
