# ShadowDesk — Personal Workspace

A React-based To-do App + Notes App, redesigned with a distinctive dark editorial/observatory visual style. Built to match the supplied Web Development Week 04 minor-project brief.

## Design direction
- Ink-black and graphite surfaces with warm coral accents and muted sage details.
- Custom eclipse-and-star brand mark drawn as inline SVG (no generic stock logo).
- Orbit lines, subtle grain-like gradients, editorial typography, small metadata labels, and quiet motion.
- Responsive sidebar/navigation that becomes a compact mobile bar.

## Features
### To-do App
- Add, edit, delete, and complete tasks.
- Optional due dates.
- All / Pending / Completed filters.
- Task counts and progress indicator.

### Notes App
- Create, edit, and delete notes.
- Search note titles, bodies, and categories.
- Categories and updated timestamps.

### Shared application
- One overview page to reach both apps.
- React functional components and props.
- `useState`, `useEffect`, and `useMemo`.
- Array methods such as `map`, `filter`, and `find`; spread syntax and event handling.
- Data persists in browser Local Storage.
- Responsive desktop, tablet, and mobile layouts.

## Run locally
1. Install Node.js (LTS) if you do not already have it.
2. Extract the ZIP and open this folder in VS Code.
3. Open the VS Code terminal in this folder.
4. Run `npm install`.
5. Run `npm run dev`.
6. Open the local URL printed by Vite (usually `http://localhost:5173`).

## Project structure
```text
shadowdesk/
├── index.html
├── package.json
├── README.md
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── styles.css
    ├── components/
    │   ├── TaskItem.jsx
    │   └── NoteCard.jsx
    ├── pages/
    └── assets/
```

## Before submission
- Test adding, editing, completing, filtering, and deleting tasks.
- Test creating, editing, deleting, and searching notes.
- Refresh the page to confirm Local Storage persistence.
- Test a narrow mobile viewport.
- Add your own screenshots and GitHub repository URL to your final submission/README if your teacher requires them.

The starter tasks and notes are sample content; replace them with your own examples before demonstrating the project.
