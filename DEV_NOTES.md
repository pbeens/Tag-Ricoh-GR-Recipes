# Development Notes - Ricoh GR Image Tagger

## Iteration 1: Project Selection & Initialization

**Timestamp**: 2026-02-04 20:36 - 20:40

- **Goal**: Transition from a Python script to a user-friendly standalone application.
- **Decision**: User selected the **Electron** path for its premium UI capabilities.
- **Action**: Initialized a new Node.js project using `electron-vite`, `vite`, `react`, and `lucide-react`.
- **Verification**:
  - [ ] **Dependency Check**: Run `npm install` and verify all packages are installed without errors.
  - [ ] **Structure Check**: Confirm the project root contains `src/main`, `src/renderer`, and `src/preload`.

## Iteration 2: Core Architecture & Backend

**Timestamp**: 2026-02-04 20:41 - 20:44

- **Goal**: Implement the ExifTool interface in the Electron Main process.
- **Action**:
  - Created `src/main/index.js` with IPC handlers for `getImageTone` and `tagImage`.
  - Integrated `spawn` to call `exiftool.exe`.
  - Set up a Preload script (`src/preload/index.js`) to expose the API safely to the renderer.
- **Verification**:
  - [ ] **Entry Point Check**: Verify `package.json` points to the correct main process file.
  - [ ] **API Exposure**: Check `src/preload/index.js` to ensure `getImageTone` and `tagImage` are exposed to the `window.api` object.

## Iteration 3: UI Implementation (The "Stunning" Phase)

**Timestamp**: 2026-02-04 20:45 - 20:46

- **Goal**: Build a high-end interface matching the proposed mockup.
- **Action**:
  - Designed a CSS system (`index.css`) featuring glassmorphism, sunset gradients, and dark mode.
  - Implemented `App.jsx` with drag-and-drop functionality and real-time progress state.
- **Verification**:
  - [ ] **CSS Check**: Run `npm run dev` and verify that the background has a sunset-themed radial gradient and the sidebar is distinct.

## Iteration 4: Debugging the "Welcome" Screen

**Timestamp**: 2026-02-04 20:47 - 20:49

- **Goal**: Fix the issue where Electron showed its default startup page instead of the project UI.
- **Action**:
  - Found that `is.dev` and `ELECTRON_RENDERER_URL` needed to be correctly synced.
- **Verification**:
  - [ ] **Launch Test**: Run `npm run dev` and confirm the window loads the project's "Loading..." screen (or the UI) instead of the Electron "Welcome" screen.

## Iteration 5: Debugging the "Black Screen" (React Crash)

**Timestamp**: 2026-02-04 20:50 - 21:00

- **Goal**: Resolve the black screen caused by a JavaScript crash.
- **Action**:
  - Identified a `ReferenceError: React is not defined` via DevTools.
  - Added `import React from 'react'` to `App.jsx`.
- **Verification**:
  - [ ] **UI Visibility**: Run `npm run dev` and confirm the "RICOH GR IMAGE TAGGER" header and the drag-and-drop zone are visible.

## Iteration 6: Structural Refinement & Asset Organization

**Timestamp**: 2026-02-04 21:01 - 21:02

- **Goal**: Optimize the file structure for production reliability.
- **Action**:
  - Flattened the renderer folder (`src/renderer`).
  - Moved `exiftool.exe` to `resources/`.
- **Verification**:
  - [ ] **Path Check**: Open `src/main/index.js` and verify the `runExifTool` function looks for the executable in the `resources` directory.

## Iteration 7: Window Controls & Draggability

**Timestamp**: 2026-02-04 21:05 - 21:07

- **Goal**: Fix the issue where the frameless window could not be moved or closed.
- **Action**:
  - Implemented IPC listeners for `minimize`, `maximize`, and `close`.
  - Added a custom `window-controls` UI with color-coded buttons.
  - Refined `-webkit-app-region: drag` on the header.
- **Verification**:
  - [ ] **Drag Test**: Click and hold the header area to move the window.
  - [ ] **Close Test**: Click the Red button to exit the app.
  - [ ] **Minimize Test**: Click the Yellow button to hide the window to the taskbar.
  - [ ] **Maximize Test**: Click the Green button to toggle between full screen and windowed mode.

## Iteration 8: Documentation & Verification Policy Overhaul

**Timestamp**: 2026-02-04 21:08 - 21:10

- **Goal**: Formalize the project's documentation and testing standards.
- **Action**:
  - Updated `Gemini.md` to require timestamps and user-centric verification sections in all dev notes.
  - Standardized `DEV_NOTES.md` with structured checklists for user testing.
- **Verification**:
  - [ ] **Documentation Check**: Verify `DEV_NOTES.md` follows the new format (Date/Time + User Verification instructions) for every iteration.

## Iteration 9: Window Behavior Refinement

**Timestamp**: 2026-02-04 21:10 - 21:12

- **Goal**: Disable window resizing/maximization and fix the "unable to drag" issue.
- **Action**:
  - Updated Main process to set `resizable: false` and `maximizable: false`.
  - Removed the Maximize button from `App.jsx` and `index.css`.
  - Removed `no-drag` policy from header children and added `pointer-events: none` to logo/text to ensure they don't block dragging.
- **Verification**:
  - [ ] **Drag Test**: Click and hold any part of the header (including text/logo) to move the window.
  - [ ] **Resize Test**: Hover over the window edges; verify no resize cursor appears.
  - [ ] **Maximize Test**: Confirm the green maximize button is gone and double-clicking the title bar does nothing.

## Iteration 10: Robust Window Dragging & Frame Removal

**Timestamp**: 2026-02-04 21:12 - 21:15

- **Goal**: Resolve persistent "unable to drag" issue and strictly enforce window constraints on Windows.
- **Action**:
  - Switched Main process to `frame: false` (frameless window) for cleaner custom title bar control.
  - Explicitly disabled `resizable`, `maximizable`, and `fullscreenable` in BrowserWindow options.
  - Restructured the React UI to include a dedicated `<div class="app-header">` at the top level.
  - Applied `-webkit-app-region: drag` to the new header and used `pointer-events: none` on its text/logo children.
- **Verification**:
  - [ ] **Drag Test**: Click anywhere on the top 60px bar (including title text) and drag to move the window.
  - [ ] **Frame Test**: Confirm the default Windows title bar (and its buttons) is completely gone.
  - [ ] **Resize Test**: Confirm the window cannot be resized by dragging edges or corners.

## Iteration 11: UI Layout Restoration & Drag Region Reinforcement

**Timestamp**: 2026-02-04 21:15 - 21:18

- **Goal**: Restore the broken UI layout and finalize a working drag region for Windows.
- **Action**:
  - Switches `app-container` to a strict `grid-template-rows: 60px 1fr` to prevent component overlap.
  - Simplified `app-header` and added `z-index` to ensure it stays on top.
  - Fixed `main-content` flex height to allow the `drop-zone` to fill the available space.
  - Enhanced `sidebar` styling with blur and better spacing.
- **Verification**:
  - [ ] **Layout Test**: Run `npm run dev` and verify the "RICOH GR IMAGE TAGGER" header is at the top, drop zone on the left, and sidebar on the right.
  - [ ] **Drag Test**: Click any part of the header bar and attempt to move the window.
  - [ ] **Fill Test**: Verify the drop zone expands to fill the left side of the window.

## Iteration 12: Git Cleanup & File Path Logic Fix

**Timestamp**: 2026-02-04 21:23 - 21:26

- **Goal**: Resolve the 7000+ file Git issue and fix the "undefined" file path error during tagging.
- **Action**:
  - Created a `.gitignore` to exclude `node_modules`, `out`, and `resources/exiftool_files`.
  - Exposed `webUtils.getPathForFile` via the preload script to safely retrieve absolute paths in the renderer.
  - Updated `App.jsx` to use the new path retrieval method for dropped files.
- **Verification**:
  - [ ] **Git Test**: Check your Git status; the file count should drop from 7000+ to under 100.
  - [ ] **Tagging Test**: Drag a JPEG into the app; verify the terminal no longer shows "File not found - undefined" and the sidebar shows the tagged result.

## Iteration 13: Production Documentation Overhaul

**Timestamp**: 2026-02-04 21:26 - 21:28

- **Goal**: Rebrand the project as a v1.0.0 production standalone application.
- **Action**:
  - Rewrote `README.md` to focus exclusively on the Electron application.
  - Removed all legacy references to Python scripts and internal conversion notes.
  - Updated feature list to highlight premium UI and batched processing.
- **Verification**:
  - [ ] **README Review**: Read the new `README.md` and confirm it reads like a professional product manual.

## Iteration 14: Community Support Refinement

**Timestamp**: 2026-02-04 21:27 - 21:28

- **Goal**: Direct all public support to GitHub Issues and remove internal documentation references from `README.md`.
- **Action**:
  - Updated `README.md` to point users to the repository's "Issues" area.
  - Removed all mentions of `DEV_NOTES.md` from the public-facing documentation.
- **Verification**:
  - [ ] **README Review**: Confirm the "Community & Support" section only mentions GitHub Issues.

## Iteration 15: Camera Compatibility Generalization

**Timestamp**: 2026-02-04 21:28 - 21:29

- **Goal**: Generalize the target camera series to avoid inaccuracy regarding specific models.
- **Action**:
  - Updated `README.md` to refer to "Ricoh GR series" instead of "III and IV".
- **Verification**:
  - [ ] **README Review**: Confirm the footer says "Developed for the Ricoh GR series."

## Current Status

- **Dev Mode**: Fully functional with `npm run dev`.
- **UI**: Premium matching design proposal.
- **Features**: Drag-and-drop JPEG tagging working; custom window controls active.
