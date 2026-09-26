# 🌸 GhoulGrid (Dota 2 Anime Multi-Layer Grid Art Studio & In-Game Simulator)

<p align="center">
  <img src="./public/vite.svg" width="96" height="96" alt="GhoulGrid Logo" />
</p>

<p align="center">
  <strong>Client-Side Single Page Application (SPA) for generating custom Dota 2 hero selection grid art from multi-layer anime and meme images using Unicode Braille with a live in-game simulator.</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#dota-2-installation-guide">Dota 2 Guide</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#localization">Localization</a> •
  <a href="#development">Development</a>
</p>

---

## ✨ Features

### 1. 📐 Flexible Custom Grid Dimensions & Aspect Ratio Presets
- Arbitrary grid dimensions from compact blocks (**30×20**) to massive high-density grids (**120×80+**).
- One-click monitor aspect ratio presets:
  - **Compact Block (40×24)** (`16:10`)
  - **Standard 16:9 (60×34)** (`16:9`)
  - **High-Res 16:9 (90×50)** (`16:9`)
  - **Ultrawide 21:9 (120×50)** (`21:9`)
- Real-time subpixel resolution display showing canvas pixel matrix (**2×4 subpixels per character**).

### 2. 🎨 Multi-Layer Engine & Interactive Transformation
- **Multiple Simultaneous Images**: Drag and drop multiple JPG, PNG, WEBP files at once.
- **Layer Stack Management**:
  - Reorder layers with Z-index control (`Move Up`, `Move Down`).
  - Toggle layer visibility (`Eye` / `EyeOff`).
  - Duplicate and delete layers.
- **Interactive Bounding Box Handles**:
  - 4 corner resize handles with intuitive cursors.
  - Free drag-and-drop repositioning across canvas.
  - Horizontal flip (`Flip H`).
  - Numeric coordinate fine-tuning (`X`, `Y`, `Width`, `Height`, `Lock Aspect Ratio`).
  - Quick actions: `Center on Canvas`, `Fit to Grid`.

### 3. 👁️ Computer Vision & Dithering Core
- **Individual Layer Filters**: Brightness (-100% to +100%), Contrast (-100% to +100%), Opacity (0% to 100%), Invert Colors.
- **Sobel 3x3 Edge Detection**: Extracts clean anime character outlines and high-frequency line-art.
- **Advanced Spatial Dithering Algorithms**:
  - **Atkinson Dithering**: Diffuses 6/8 of error, famous for crisp outlines on anime pixel art.
  - **Floyd-Steinberg Dithering**: Classic error diffusion matrix for smooth gradients.
  - **Threshold Only**: High-contrast black/white binary mapping.
- **60 FPS Performance**: Debounced `requestAnimationFrame` rendering pipeline with live performance telemetry (render time ms, active dots, total character count).

### 4. 🎮 Authentic Source 2 Engine Compatibility (`\u2800`)
- **Source 2 Space Trimming Prevention**: Dota 2 collapses standard ASCII whitespace characters. GhoulGrid strictly enforces **`\u2800` (Braille Pattern Blank)** for all empty subpixel cells. This guarantees pixel-perfect geometry and row alignment inside the game.

### 5. 🕹️ Dota 2 Live In-Game Simulator
- Authentic **16:9 Hero Pick Viewport** styled after Dota 2 Source 2 Panorama UI.
- Monospace font metrics and kerning matching in-game rendering (`JetBrains Mono`, `line-height: 0.92`).
- **Interactive Pan & Zoom Navigation**: Click and drag to pan viewport, mouse wheel to zoom in/out.
- **Draggable Mock Hero Cards**: Place iconic Dota 2 heroes (Shadow Fiend, Invoker, Pudge, Anti-Mage, Juggernaut, Phantom Assassin) around your grid art to test layout before playing.
- Color themes: *Sakura Pink, Cyber Cyan, Classic Slate, Radiant Emerald, Dire Crimson*.

### 6. 📄 Dota 2 Config Generator & Merge Engine
- Generates valid official **`hero_grid_config.json`** (Version 3 format).
- Converts each horizontal row of Braille characters into a scanline category with precise coordinates (`x_position`, `y_position`, `width`, `height`).
- **Merge with Existing Config**: Upload your existing `hero_grid_config.json` to append your new art without losing your previously customized hero grids.
- One-click file download with confetti celebration and clipboard copy actions.

### 7. 🔒 100% Client-Side / Zero Data Leak
- All image transformations, canvas compositions, and JSON generations occur strictly in the browser's memory.
- No server uploads, no external APIs, zero telemetry.

---

## 🗺️ Dota 2 Installation Guide

Place the exported `hero_grid_config.json` into your Steam userdata folder:

### Default Paths:
- **Windows**:
  ```text
  C:\Program Files (x86)\Steam\userdata\<YourSteamID32>\570\remote\cfg\hero_grid_config.json
  ```
- **Linux (Native / Steam Play)**:
  ```text
  ~/.local/share/Steam/userdata/<YourSteamID32>/570/remote/cfg/hero_grid_config.json
  ```
- **macOS**:
  ```text
  ~/Library/Application Support/Steam/userdata/<YourSteamID32>/570/remote/cfg/hero_grid_config.json
  ```

### Step-by-Step:
1. Make a backup copy of your current `hero_grid_config.json`.
2. Move or replace the downloaded `hero_grid_config.json` into the `cfg/` folder.
3. Launch Dota 2.
4. Go to **Heroes** tab -> click the **Layouts** dropdown menu in the bottom-left corner.
5. Select your custom layout!

---

## 🌐 Localization

Full multi-language support with automatic browser language detection and `localStorage` persistence:
- 🇺🇦 **Українська (UK)** — Базова
- 🇺🇸 **English (EN)** — Core
- 🇪🇸 **Español (ES)**
- 🇯🇵 **日本語 (JA)**
- 🇨🇳 **中文 (ZH)**
- 🇷🇺 **Русский (RU)**

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | Core reactive user interface framework |
| **TypeScript** | Strict type safety and compilation |
| **Vite 6** | Ultra-fast development and optimized production bundling |
| **Tailwind CSS** | Custom Anime Cyberpunk design system & utilities |
| **HTML5 Canvas API** | Multi-layer compositing, matrix transforms, image filters |
| **Custom CV Algorithms** | Sobel 3x3 Operator, Floyd-Steinberg & Atkinson Dithering |
| **Unicode Braille** | 2×4 subpixel character mapping (`0x2800` - `0x28FF`) |
| **i18next / react-i18next** | Full internationalization and language persistence |
| **Lucide React** | Modern cyberpunk iconography |
| **Canvas Confetti** | Export celebration animations |

---

## 💻 Development & Build

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run strict TypeScript verification and production bundle
npm run test:build

# Preview production build locally
npm run preview
```

---

## 📜 License

MIT License © 2026 GhoulGrid Studio.
All Dota 2 assets, hero icons, and trademarks belong to Valve Corporation.
