# Project Context

## Overview
BropertyAi adalah aplikasi chat AI cross-platform yang dikembangkan dengan React Native dan didukung oleh Amazon Bedrock, dengan kompatibilitas untuk berbagai provider model seperti Ollama, DeepSeek, OpenAI, dan model OpenAI Compatible. Aplikasi ini fokus pada sektor properti dengan fitur AI khusus untuk konsultasi properti, legal, dan perbankan.

**Nama**: BropertyAi  
**Versi**: 2.4.0  
**Lisensi**: MIT-0  
**Package Name**: com.broperty.app5

## Technical Stack
**Runtime**: Node.js 18+  
**Framework**: React Native 0.74.1  
**Bahasa**: TypeScript, JavaScript, Kotlin, Swift, Python  
**Arsitektur**: Modular dengan komponen native

## Dependencies
### Core Dependencies:
- React 18.2.0
- React Native 0.74.1
- React Navigation (Drawer, Native Stack)
- React Native Gesture Handler
- React Native Reanimated
- React Native MMKV (storage cepat)
- React Native Gifted Chat
- React Native Image Picker
- React Native Document Picker
- React Native Share

### AI/ML Dependencies:
- Amazon Bedrock SDK
- OpenAI API client
- Custom tokenizers untuk Markdown dan LaTeX

### UI/UX Dependencies:
- React Native Elements
- React Native Toast Message
- React Native Progress
- React Native SVG

## Configuration Files Penting
- `react-native/package.json` - Dependencies dan scripts
- `react-native/app.json` - Konfigurasi aplikasi
- `react-native/ios/SwiftChat/Info.plist` - iOS app configuration
- `react-native/ios/Podfile` - iOS dependencies
- `react-native/android/app/build.gradle` - Android build configuration
- `react-native/babel.config.js` - Babel configuration
- `react-native/metro.config.js` - Metro bundler config
- `react-native/tsconfig.json` - TypeScript configuration

## Struktur Folder Proyek
```
swiftchat-47/
├── react-native/                 # Aplikasi utama React Native
│   ├── src/
│   │   ├── api/                 # API clients (Bedrock, Ollama, OpenAI)
│   │   ├── assets/              # Gambar dan aset
│   │   ├── chat/                # Komponen chat screen
│   │   ├── history/             # Manajemen history chat
│   │   ├── prompt/              # System prompts preset
│   │   ├── settings/            # Settings screen components
│   │   ├── storage/             # Local storage utilities
│   │   ├── theme/               # Theme management
│   │   ├── types/               # TypeScript definitions
│   │   └── utils/               # Utility functions
│   ├── ios/                     # iOS native code
│   └── android/                 # Android native code
├── server/                      # Backend server Python
│   └── src/
│       ├── main.py              # FastAPI server
│       └── image_nl_processor.py # Image processing
└── memory-bank/                 # Dokumentasi proyek
```

## 7 Fitur Utama yang Teridentifikasi

### 1. Broperty AI - Main Bot Connector & Gateway
- Bot utama sebagai gerbang komunikasi antara user dan internal Broperty
- Hanya merespon komunikasi terkait properti real estate
- Mengidentifikasi kebutuhan spesifik user terkait properti
- Menyambungkan user ke sub-bot profesional, web view, atau Google Maps
- Bertindak sebagai filter untuk memastikan semua pertanyaan terkait properti

### 2. Sub Bot Profesional Ecosystem (7 Bot Spesialis)
- **🏠 Agensi Properti Ai** (ID: 926) - Konsultasi strategi jual beli properti, analisis harga pasar, negosiasi
- **📜 Notaris Ai** (ID: 900) - Pembuatan akta jual beli, pengurusan sertifikat tanah, legalisasi dokumen
- **⚖️ Pengacara Ai** (ID: 901) - Penanganan sengketa properti, pemeriksaan dokumen, pendampingan hukum
- **🏛 Aparatur Pemerintah Ai** (ID: 911) - Pengurusan prosedur kepemilikan properti di pemerintahan
- **💻 Sertifikasi Elektronik Ai** (ID: 920) - Pembuatan sertifikasi elektronik, prosedur digitalisasi sertifikat
- **🏦 KPR Bank Ai** (ID: 922) - Informasi KPR berbagai bank, syarat pengajuan, perbandingan suku bunga
- **📋 Menu & Utility Bot** - Akses ke Web View, Maps, dan fitur utility lainnya

### 3. Web View Integration
- Built-in web browser untuk mengakses konten properti terkini
- URL input dengan auto-completion (http/https)
- Real-time URL tracking dan navigation
- Cross-platform web rendering dengan React Native WebView
- Support untuk berbagai website properti dan listing services

### 4. Google Maps Integration  
- Peta properti interaktif dengan React Native Maps
- Marker untuk lokasi properti sample (Jakarta Selatan, Kuningan, BSD)
- Property details panel dengan informasi lengkap
- User location tracking dan navigation
- Support untuk landscape/portrait orientation

### 5. Token System & AdminCP Foundation
- Sistem token AWS STS untuk autentikasi aman
- Usage tracking (tokens, image counts, model usage)
- AdminCP backend foundation dengan FastAPI
- Role-based access control preparation
- Analytics dan reporting capabilities

### 6. Multi-Model AI Support
- **Amazon Bedrock**: Nova series, Claude models, Stable Diffusion
- **Ollama**: Local model deployment support
- **DeepSeek**: DeepSeek-V3, DeepSeek-R1 dengan hardcoded API key
- **OpenAI**: GPT-4o, GPT-4.1 series, GPT-4o mini
- **OpenAI Compatible**: Custom model provider integration

### 7. Advanced Cross-Platform Features
- Real-time streaming chat dengan abort controller
- Multimodal support (text, images, videos, documents)
- Voice chat dengan Amazon Nova Sonic (Speech-to-Speech)
- Markdown rendering dengan LaTeX matematika
- Image generation dengan progress tracking dan compression
- Dark/light mode theme system yang responsive

## Target Deployment
**iOS Version**: Minimum iOS 13.0  
**Android Version**: Minimum SDK 23 (Android 6.0)  
**macOS**: Mac Catalyst compatible  
**Device Compatibility**: Smartphones dan tablets (landscape/portrait optimized)

## Architecture Pattern
- **Frontend**: React Native dengan native modules
- **Backend**: FastAPI Python server dengan AWS integration
- **State Management**: Context API + Local Storage (MMKV)
- **Navigation**: React Navigation dengan drawer dan stack navigators
- **Theming**: Custom theme provider dengan dark/light mode support

## Development Workflow
- Hot reload development dengan Metro bundler
- Automated testing dengan Jest
- ESLint + Prettier untuk code quality
- TypeScript untuk type safety
- Git workflow dengan conventional commits
