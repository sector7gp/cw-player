# CW Player Node

An advanced Morse Code (CW) web application built with **Next.js 16**, featuring real-time audio synthesis, visual monitoring, and progressive learning modules.

---

## 🚀 Features

- **Text to Morse Converter**: Real-time CW generation from manual text input.
- **Random Group Generator**: Practice decoding with random alphanumeric sequences.
- **Progressive Lessons**: Structured curriculum to learn Morse code from scratch.
- **Evaluation Quiz**: Test your receiving skills and get instant feedback with accuracy metrics.
- **Keying Practice**: Manual transmission mode using your keyboard (Spacebar) or touch interface with real-time decoding.
- **Signal Monitor**: Live oscilloscope visualization of the audio waveform.
- **Farnsworth Timing**: Support for character speed vs. effective spacing speed.
- **Multi-language**: Available in English and Spanish.
- **Persistence**: Remembers your configuration and language preferences using local storage.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) with persistence.
- **Audio Engine**: [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API).
- **Styling**: [TailwindCSS](https://tailwindcss.com/) with Glassmorphism effects.
- **Animations**: [Framer Motion](https://www.framer.com/motion/).
- **Icons**: [Lucide React](https://lucide.dev/).

---

## 📦 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sector7gp/cw-player.git
   cd cw-player
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_CW_DEFAULT_WPM=20
   NEXT_PUBLIC_CW_DEFAULT_FREQ=600
   NEXT_PUBLIC_CW_DEFAULT_VOL=0.8
   NEXT_PUBLIC_CW_FARNSWORTH_WPM=20
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

Open [http://localhost:3002](http://localhost:3002) to see the application.

---

## 📜 Credits & Attribution

- **Developer**: sector7gp
- **Inspiration**: Based on the logic and concepts of [cwpEA by F1ORL](https://www.f1orl.org/cwpEA.htm).
- **License**: Provided for educational and amateur radio practice purposes.

---

## 📖 Manual

For detailed instructions on how to use each module, please refer to the [MANUAL.md](./MANUAL.md) file.
