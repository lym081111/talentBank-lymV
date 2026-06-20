import { describe, expect, it, vi } from 'vitest';
import { parseResumeIntoEvidence } from '../ProfileAndEvidence';

vi.mock('../../utils/pdfExport', () => ({
  exportEvidenceToPDF: vi.fn(),
}));

describe('resume import parsing', () => {
  it('splits a flattened PDF resume into separate project and competition evidence records', () => {
    const flattenedResume = `
      Liew Yi Mei LinkedIn | 6 0169084992 | lymymei@gmail.com SELF-INTRODUCTION
      I'm a dedicated Communication and Networking student at Universiti Tunku Abdul Rahman (UTAR).
      PROJECTS Design and Implementation of a Bicycle-Based Energy Harvesting System with Real-Time Mobile App Visualisation
      Technologies Used: ESP32, Hardware Circuitry (TP4056, Sensors), IoT (Blynk App), Arduino IDE
      - Designed and implemented a micro-scale renewable energy system that converts mechanical kinetic energy from cycling into stable 5V electrical power.
      - Built and deployed a mobile IoT dashboard via the Blynk platform.
      Student Curriculum Management System Technologies Used: PHP, MySQL
      - Developed a PHP and MySQL Student Co-Curricular Management System with authentication and CRUD functionality.
      Smart Coffee Bean Factory: IoT & Computer Vision Automation System Technologies Used: Raspberry Pi, Node-RED, Computer Vision, IoT MQTT Panel, InfluxDB, Telegram Bot API, Python
      - Designed and implemented an automated IoT-driven coffee roasting system.
      - Developed a computer vision quality control pipeline using a web camera and MQTT.
      IoT-Based Smart Meeting Room Monitoring & Automation System Technologies Used: Node-RED, IoT MQTT Panel, InfluxDB, Telegram Bot API, Virtual Raspberry Pi, Python, Windows LAN Networking
      - Programmed custom control logic within a Node-RED environment and achieved a 15% reduction in total air conditioner operational time.
      COMPETITION EXPERIENCE Participant | L'Oreal Brainstorm 2026 Mar 2026
      - Developed an innovative tech-driven marketing strategy and product concept.
      Participant | HackAttack 2.0 Jun 2025
      - Designed a browser extension interface via Figma and deployed a Streamlit prototype.
      SKILLS Programming Languages: HTML, CSS, JavaScript, Java, Python, C++, PHP
      EDUCATION Universiti Tunku Abdul Rahman (UTAR) Bachelor of Communications and Networking (Honours)
    `;

    const evidence = parseResumeIntoEvidence(flattenedResume);

    expect(evidence).toHaveLength(6);
    expect(evidence.map((item) => item.title)).toEqual([
      'Design and Implementation of a Bicycle-Based Energy Harvesting System with Real-Time Mobile App Visualisation',
      'Student Curriculum Management System',
      'Smart Coffee Bean Factory: IoT & Computer Vision Automation System',
      'IoT-Based Smart Meeting Room Monitoring & Automation System',
      "Participant | L'Oreal Brainstorm 2026",
      'Participant | HackAttack 2.0',
    ]);
    expect(evidence.map((item) => item.type)).toEqual([
      'portfolio',
      'portfolio',
      'portfolio',
      'portfolio',
      'hackathon',
      'hackathon',
    ]);
  });
});
