# Bahi Khata - Voice-First Billing Prototype

A standalone, voice-first billing application designed for Indian shop owners. Built for speed, ease of use, and zero technical friction.

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run the App**:
   ```bash
   npm run dev
   ```

3. **Open in Browser**:
   Visit `http://localhost:5173`. Use **Google Chrome** for the best voice recognition experience.

## ✨ Key Features

- **Voice Billing**: Tap the mic and say items in Hindi/English (e.g., "Aloo 5 kilo 30 rupaye").
- **Udhaar Khata**: Manage customer credit with simple one-tap buttons.
- **Paper-to-Digital**: Take a photo of a handwritten bill and see it turn into a digital record (Simulated OCR).
- **Daily Summary**: Get a clear hiasab of your sales, cash, and udhaar.
- **Offline First**: Works without internet using LocalStorage.
- **PWA Ready**: Can be installed on mobile home screens.

## 🛠️ Tech Stack

- **React + Vite** (Frontend)
- **Tailwind CSS** (Styling)
- **Web Speech API** (STT & TTS)
- **LocalStorage** (Persistence)
- **Lucide React** (Icons)

## 📝 Prototype Notes
- Voice parsing is rule-based and designed for demonstration logic.
- OCR in Paper-to-Digital is a functional simulation for UX demonstration.
- No backend required; all data stays in the browser.
