# 🧾 Vyapari Khata (व्यापारी खाता) — Voice Billing & Ledger with Billu AI

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

> **"बोल कर बिल बनाओ" (Create bills just by speaking)**  
> **Vyapari Khata** is an offline-first, voice-powered billing and credit management (Udhaar Khata) web application designed specifically for Indian small business and Kirana store owners (*Vyaparis*). Powered by **Billu AI**, an in-browser conversational assistant that understands natural Hindi, English, and Hinglish speech.

---

## 🌟 Key Features

### 🎙️ 1. Voice Billing ("Bol Kar Bill")
* **Zero Typing Required**: Simply speak natural commands (e.g., *"Aloo 5 kilo"*, *"Cheeni 2 packet 45 rupaye kilo"*).
* **Multi-Item Support**: Add multiple items in a single sentence using connectors like *"aur"*, *"and"*, or comma separation.
* **Instant Auto-Calculation**: Automatically multiplies quantity by rate, compiles itemized invoices, and calculates totals on the fly.

### 🤖 2. "Billu AI" Conversational Parser
* **Natural Hinglish & Hindi NLP**: Custom client-side natural language processor that extracts entities (Item Name, Quantity, Units, Rates) without requiring third-party cloud APIs.
* **Unit Recognition**: Understands Indian measurements including `kg`, `kilo`, `gram`, `litre`, `packet`, `nag`, `piece`, `dozen`, `pao`, etc.
* **Voice Feedback**: Billu AI answers back in Hindi or English to confirm additions, adjustments, and cancellations.

### 📒 3. Digital Udhaar Khata (Credit Ledger)
* Track customer-wise credit balances and payment histories.
* Separate credit (*Udhaar*) transactions from paid cash transactions.
* Settle accounts and maintain clean financial records for trusted regular customers.

### 📸 4. Paper-to-Digital Link
* Built to help traditional shopkeepers transition from physical register books (*Bahi Khata*) to digital ledgers seamlessly.
* Quick camera capture and link functionality for paper receipts.

### 📊 5. Daily Sales Dashboard & Summary
* Live tracking of today's total revenue, daily bill count, and pending credit balances.
* Instant transaction logs and audit trail.

### ⚡ 6. Offline-First & Privacy-Focused
* Operates completely in the browser using local storage (`db.ts`).
* Works smoothly even without active internet connectivity.
* Shopkeeper data stays securely on their device.

---

## 🗣️ Supported Voice Commands Examples

| What You Say (Voice Input) | Language | Billu AI Extraction |
| :--- | :--- | :--- |
| *"Aloo 5 kilo 30 rupaye kilo"* | Hinglish | **Aloo** &bull; Qty: **5 kg** &bull; Rate: **₹30** &bull; Total: **₹150** |
| *"2 packet milk aur 1 dozen ande"* | Hinglish / Eng | **Milk** (2 packets) + **Ande** (1 dozen) |
| *"Cheeni do kilo hata do"* | Hindi | Removes item from active bill draft |
| *"Namaste Billu bhai"* | Hindi / Hinglish | Billu replies: *"Namaste! Main Billu hoon. Boliye kya add karna hai?"* |

---

## 🛠️ Tech Stack

* **Frontend Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
* **Build Tool**: [Vite 7](https://vitejs.dev/)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + PostCSS
* **Icons**: [Lucide React](https://lucide.dev/)
* **Speech Processing**: Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`) + Custom Rule-based Regex NLP Parser
* **Routing**: [React Router DOM v7](https://reactrouter.com/)
* **Storage**: In-Browser Client Storage (Local database layer)

---

## 📂 Repository Structure

```text
Khata/
├── voice-billing-proto/       # 🚀 Core Vyapari Khata Application
│   ├── src/
│   │   ├── hooks/
│   │   │   └── useVoice.ts    # Web Speech API hook (Speech-to-Text)
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx  # Quick stats & daily sales
│   │   │   ├── LandingPage.tsx# Product showcase & feature highlight
│   │   │   ├── VoiceBilling.tsx# Voice bill creator UI
│   │   │   ├── Udhaar.tsx     # Credit book & customer ledger
│   │   │   ├── PaperToDigital.tsx # Camera & paper ledger integration
│   │   │   └── Summary.tsx    # Detailed sales analytics
│   │   ├── utils/
│   │   │   ├── parser.ts      # Billu AI conversational NLP & entity extractor
│   │   │   └── db.ts          # Local database & persistent store
│   │   ├── App.tsx            # Main layout and route definitions
│   │   └── main.tsx           # React application entry point
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
├── assets/                    # Project screenshots & media assets
├── index.html                 # Root presentation & landing portfolio
├── styles.css
└── script.js
