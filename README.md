# Eight34 Studio Landing (`e34labs.com`)

Official marketing and agency website for **Eight34 Labs**, an independent web engineering studio crafting brand-defining websites, bespoke full-stack applications, and lightweight telemetry infrastructure.

[![Astro](https://img.shields.io/badge/Astro-5-ff5d01?logo=astro)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-Source--Available-red)](./LICENSE)
[![Proprietary](https://img.shields.io/badge/Eight34%20Labs-Proprietary-blue)](#-proprietary-source-available)

## 🔒 Proprietary Source-Available Project

This repository is proprietary to Eight34 Labs and is **not open source**. Access is provided for viewing and evaluation only. No unauthorized reproduction, deployment, or commercial use is permitted without prior written consent.

---

## 🎨 What It Does

- **Studio Showcase**: Highlights Eight34's capabilities across editorial brand sites, full-stack applications, and privacy-first analytics.
- **Engineering Standards**: Details performance benchmarks (sub-50ms TTFB, zero layout shift, strict TypeScript, tactile micro-interactions).
- **Collaboration Process**: Outlines the 3-phase studio workflow (Blueprint → High-Craft Development → Production & Hypercare).
- **Smooth Navigation**: Native smooth-scrolling anchor navigation with responsive off-canvas mobile menu.
- **Client Conversion**: Clear call-to-actions connecting potential clients directly with the studio at `hello@e34labs.com`.

---

## 🛠️ Stack

| Layer | Technology |
| :--- | :--- |
| Framework | [Astro 5](https://astro.build) |
| Styling | Native CSS with modern custom properties & fluid typography |
| Language | TypeScript 5 |
| Telemetry | Embedded Eight34 Telemetry Tag SDK |
| Hosting | [Vercel](https://vercel.com) / Cloudflare Pages |

---

## 📁 Project Structure

```
apps/landing/
├── public/
│   ├── E34_Short.svg      # Studio vector monogram
│   ├── Eight34_Full.svg   # Full studio logo
│   ├── favicon.ico        # Site favicon
│   └── eight34.js         # Local SDK fallback
├── src/
│   ├── layouts/
│   │   └── Layout.astro   # Root HTML layout with metadata and tracker
│   ├── pages/
│   │   └── index.astro    # Main agency landing page
│   └── styles/
│       └── global.css     # Global theme and responsive CSS
├── astro.config.mjs       # Astro build configuration
├── package.json           # Standalone dependencies
└── LICENSE                # Proprietary source-available license
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm 10+

### Setup & Development

```bash
# Install dependencies
npm install

# Start local development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📄 License

Copyright © 2026 Eight34 Labs. All rights reserved. This repository is source-available for viewing only — it is **not** open source. No use, copying, modification, distribution, or deployment is permitted without written permission. See [LICENSE](./LICENSE).
