![A voice waveform leads into a folded routine blueprint showing a lamp, a wait and music beside a checklist.](assets/banner/banner.png)

# 🎙️ Alexa Automation Architect

Plan an Alexa routine before opening the Alexa app. Describe what should happen, review the proposed action order, and take the blueprint with you as plain text or JSON. If Alexa keeps mishearing the trigger, try a different phrasing in the voice workspace.

## 📑 Table of contents

[Workspaces](#workspaces) · [Routine flow](#flow) · [Quick start](#start) · [Architecture and stack](#stack) · [Project status](#status) · [Contributing](#contributing) · [License](#license)

<a id="workspaces"></a>

## 🎙️ Core workspaces

| Workspace | What you can do |
| --- | --- |
| [Routine Blueprint Generator](src/components/RoutineBuilder.tsx) | Enter a goal and review a suggested routine name, trigger, device, ordered actions and explanation. Copy the plan or download its JSON. |
| [Voice Trigger Variation Engine](src/components/VoiceOptimizer.tsx) | Enter a troublesome phrase. The app requests five to eight alternatives, each with a category and recognition rationale. Sort the suggestions alphabetically or by type. |
| [Departure Checklist](src/components/Diagnostics.tsx) | Work through 15 manual checks covering account permissions, device connectivity and routine configuration. Checkmarks persist in the current browser and can be reset. |

<a id="flow"></a>

## 🔊 From idea to routine

Try *“For movie night, dim the lights, wait a moment, then play music.”* In the blueprint, look at where playback starts. The generation prompt asks for waits between dependent device commands, volume changes before playback and terminal actions last. Review the proposed sequence, then enter it in the Alexa app and try the trigger on your device. The downloaded JSON records the proposal. [Blueprint prompt and response fields](src/services/ai.ts)

<a id="start"></a>

## ⚡ Quick start

From the repository root, use Node.js and npm. For the two generation workspaces, supply a Gemini API key through the local `GEMINI_API_KEY` environment setting before starting Vite.

```powershell
npm install
npm run dev -- --host 127.0.0.1
```

Open the local address printed by Vite (configured port 3000). Vite embeds the configured key in browser code. Keep a key-bearing build on a trusted local machine. Public hosting would require moving the credential and Gemini calls behind a server. [Scripts](package.json) · [Vite configuration](vite.config.ts)

<a id="stack"></a>

## 🏗️ Architecture and tech stack

| Repository path | Responsibility |
| --- | --- |
| [src/main.tsx](src/main.tsx) and [src/App.tsx](src/App.tsx) | Mount the React 19 application and switch between its three workspaces. |
| [src/components/](src/components/) | Render inputs, generation results, exports and checklist controls. |
| [src/services/ai.ts](src/services/ai.ts) | Send text to Gemini through the Google GenAI SDK and parse the structured replies. The configured model is `gemini-3.1-pro-preview`. |
| [src/index.css](src/index.css) and [package.json](package.json) | Tailwind CSS 4 styling, Lucide icons and Motion animations in a TypeScript and Vite 6 project. |

<a id="status"></a>

## 🔬 Project status

The application provides design guidance. Device discovery, routine installation, SSML playback and measured recognition or latency tests are outside the current implementation. Checklist progress reflects the items you mark yourself. Generation depends on access to the configured preview model. [Workspace components](src/components/) · [Model configuration](src/services/ai.ts)

<a id="contributing"></a>

## 🤝 Contributing

For a change to the blueprint fields, update the generation schema and the component that renders the result together. Run `npm run lint` for TypeScript checks and `npm run build` for the production bundle. Use `npm run preview` to inspect that build locally. [Project scripts](package.json)

<a id="license"></a>

## 📄 License

Distributed under the [MIT License](LICENSE).
