website link : https://anukool-nu.vercel.app


# 🌟 ANUKOOL (Adaptive Digital Accessibility & Inclusion Platform)

An AI-powered, multi-modal accessibility platform designed to make digital services, banking, document reading, and emergency assistance seamlessly accessible for everyone through Indic voice interactions, cognitive simplifications, and assistive vision .

---

## 🛠️ Tech Stack & Badges

### 🎨 Frontend & User Experience
<p align="left">
  <img src="https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 18" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/Lucide_Icons-F05032?style=for-the-badge&logo=lucide&logoColor=white" alt="Lucide Icons" />
</p>

### ⚙️ Backend, Server & Databases
<p align="left">
  <img src="https://img.shields.io/badge/Next.js_API_Routes-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js API" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white" alt="Mongoose" />
</p>

### 🧠 AI, Indic Voice & Vision Models
<p align="left">
  <img src="https://img.shields.io/badge/Sarvam_AI_Indic-FF6F00?style=for-the-badge&logo=openai&logoColor=white" alt="Sarvam AI" />
  <img src="https://img.shields.io/badge/Tesseract.js_OCR-5C2D91?style=for-the-badge&logo=tesseract&logoColor=white" alt="Tesseract.js" />
  <img src="https://img.shields.io/badge/Web_Speech_API-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Web Speech API" />
</p>

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    %% Client Tier
    subgraph CLIENT["🖥️ Client Layer (Next.js 14 + React 18)"]
        UI["Accessible Responsive UI (Tailwind + Framer Motion)"]
        VOICE["VoiceContext & Multilingual Speech Controller"]
        SCANNER["Document Scanner / OCR UI"]
        A11Y["Motor & Cognitive Adaptation Layer"]
    end

    %% Security & API Gateway
    subgraph GATEWAY["🛡️ Security & Route Handlers"]
        AUTH_MW["Next.js Auth Middleware (Supabase SSR)"]
        API["API Route Handlers (/api/*)"]
    end

    %% Core Application Engines
    subgraph ENGINES["🧠 Core Processing Engines"]
        SPEECH_ENG["Speech Engine (STT & TTS Controller)"]
        MULTI_ENG["Multilingual Engine (Regional Translations)"]
        SIMP_ENG["Cognitive Simplification Engine"]
        OCR_ENG["Tesseract.js OCR Document Extractor"]
        AUDIT_ENG["Digital Accessibility Audit Engine"]
    end

    %% External Services
    subgraph EXTERNAL["⚡ External AI & Cloud Services"]
        SARVAM["Sarvam AI (Indic STT, TTS & Translation)"]
        WEB_SPEECH["Web Speech Web API (Browser Fallback)"]
    end

    %% Database Tier
    subgraph STORAGE["💾 Data Persistence Tier"]
        SUPABASE[("Supabase (PostgreSQL Auth & State)")]
        MONGODB[("MongoDB Atlas (Mongoose ODM - Profiles, Logs)")]
    end

    %% Flow Connections
    UI --> VOICE
    UI --> SCANNER
    UI --> A11Y
    
    VOICE --> SPEECH_ENG
    SCANNER --> OCR_ENG

    UI --> AUTH_MW
    AUTH_MW --> API

    API --> SPEECH_ENG
    API --> MULTI_ENG
    API --> SIMP_ENG
    API --> OCR_ENG
    API --> AUDIT_ENG

    SPEECH_ENG --> SARVAM
    SPEECH_ENG --> WEB_SPEECH
    MULTI_ENG --> SARVAM

    API --> SUPABASE
    API --> MONGODB
