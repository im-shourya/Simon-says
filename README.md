# Simon Says

A sleek, modern web implementation of the classic Simon Says memory game built with Next.js and JavaScript.

## Features

- **Progressive Difficulty**: The game gradually speeds up the playback as you reach higher levels, making it more challenging.
- **Synthesized Audio**: Uses the native Web Audio API to generate custom, distinct frequencies for each color button, along with a dissonant chord for game-over.
- **Premium Aesthetics**: Built with Vanilla CSS, featuring a beautiful dark-mode gradient, glassmorphism UI elements, and glowing neon interactive buttons.
- **Local Persistence**: Automatically saves and loads your highest score using the browser's `localStorage`.

## Getting Started

First, install the dependencies if you haven't already:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to play the game!

## Tech Stack
- React & Next.js (App Router)
- Vanilla CSS
- Web Audio API (No external sound assets required)
