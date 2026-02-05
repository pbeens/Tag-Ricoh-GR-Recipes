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

## Iteration 16: Project Planning Stabilization

**Timestamp**: 2026-02-04 21:36 - 21:38

- **Goal**: Introduce a formal section for tracking project growth and future tasks.
- **Action**:
  - Updated `Gemini.md` to mandate a "Backlog & Feature Ideas" section.
  - Added the initial backlog to the project documentation.
- **Verification**:
  - [ ] **Section Check**: Scroll to the bottom of `DEV_NOTES.md` and confirm the "Backlog & Feature Ideas" section exists.

## Current Status

- **Dev Mode**: Fully functional with `npm run dev`.
- **UI**: Premium matching design proposal.
- **Features**: Drag-and-drop JPEG tagging working; custom window controls active; Git clean.

## Iteration 17: Local Tag Scanner Script

**Timestamp**: 2026-02-05 07:49 - 07:52

- **Goal**: Provide a quick local script to list image tags for the test images.
- **Action**:
  - Added `test programs/scan_image_tags.py` to scan `Test-Images` and print tags or `none`.
- **Verification**:
  - [ ] **Run Script**: Execute `python3 "test programs/scan_image_tags.py"` and confirm each file prints a line with tags or `none`.
  - [ ] **Custom Folder**: Execute `python3 "test programs/scan_image_tags.py" /path/to/images` to scan a different folder.

## Iteration 18: Cross-Platform ExifTool Resolution

**Timestamp**: 2026-02-05 07:56 - 07:58

- **Goal**: Prevent main-process crashes when ExifTool is missing on macOS/Linux.
- **Action**:
  - Updated `runExifTool` to use the system `exiftool` on non-Windows platforms and added clearer ENOENT error messaging.
  - Kept Windows lookup for `resources/exiftool.exe` and app-root `exiftool.exe`.
- **Verification**:
  - [ ] **macOS/Linux**: Install ExifTool (`exiftool -ver`) and run `npm run dev`, then tag an image; app should not crash.
  - [ ] **Windows**: Ensure `resources/exiftool.exe` exists; tag an image and confirm tags are written.

## Iteration 19: Tagging Diagnostics + ExifTool-Based Scanner

**Timestamp**: 2026-02-05 08:01 - 08:04

- **Goal**: Make tagging failures visible and improve tag scanning accuracy.
- **Action**:
  - Added main-process logging for ExifTool command execution.
  - Updated renderer to surface missing ImageTone and tagging errors in the status badge.
  - Enhanced `test programs/scan_image_tags.py` to use ExifTool (if installed) to read Keywords/Subject/ IPTC/XMP.
- **Verification**:
  - [ ] **Run App**: Drag a Ricoh GR JPEG and confirm status updates on success or error.
  - [ ] **Run Scanner**: Execute `python3 "test programs/scan_image_tags.py"` and confirm tags show if present.

## Iteration 20: Fix Process Shadowing Crash in ExifTool Runner

**Timestamp**: 2026-02-05 08:06 - 08:07

- **Goal**: Resolve the `Cannot access 'process2' before initialization` error in the main process.
- **Action**:
  - Renamed the spawned child process variable to avoid shadowing Node's global `process`.
- **Verification**:
  - [ ] **Run App**: `npm run dev` and drag-drop an image; no `process2` error should appear.

## Iteration 21: Recently Tagged Thumbnails

**Timestamp**: 2026-02-05 08:10 - 08:12

- **Goal**: Show image thumbnails in the "Recently Tagged" panel.
- **Action**:
  - Stored a file-based preview URL for each tagged image.
  - Updated the sidebar list to render thumbnails alongside filename and recipe tag.
- **Verification**:
  - [ ] **Thumbnail Check**: Drag a few images and confirm the right panel shows a thumbnail for each recently tagged image.
  - [ ] **Layout Check**: Confirm filenames and tags remain readable next to the thumbnail.

## Iteration 22: Persistent Recently Tagged History

**Timestamp**: 2026-02-05 08:16 - 08:19

- **Goal**: Preserve a recent history of tagged images between app runs and prune missing files.
- **Action**:
  - Added IPC `file-exists` to validate stored history entries.
  - Persisted `history` to localStorage and reload it on startup, removing missing files silently.
- **Verification**:
  - [ ] **Persistence**: Tag 2–3 images, quit the app, relaunch, and confirm they still appear in Recently Tagged.
  - [ ] **Prune**: Move one tagged image out of the folder, relaunch, and confirm it disappears from Recently Tagged without errors.

## Iteration 23: Reliable Thumbnail URLs

**Timestamp**: 2026-02-05 08:23 - 08:25

- **Goal**: Fix broken thumbnail URLs in the Recently Tagged panel.
- **Action**:
  - Exposed `pathToFileUrl` from preload using Node's URL utilities.
  - Rebuilt preview URLs from file paths when loading history and when tagging.
- **Verification**:
  - [ ] **Thumbnail Check**: Drag a few images and confirm thumbnails render (no broken image icon).
  - [ ] **Relaunch Check**: Restart the app and confirm thumbnails still render for saved history.

## Iteration 24: Thumbnail Rendering via NativeImage

**Timestamp**: 2026-02-05 08:30 - 08:32

- **Goal**: Fix broken image icons in Recently Tagged.
- **Action**:
  - Added IPC `get-thumbnail` to generate a resized data URL via Electron `nativeImage`.
  - Switched history thumbnails to use data URLs instead of `file://` paths.
- **Verification**:
  - [ ] **Thumbnail Check**: Drag images and confirm actual thumbnails render (no placeholder icon).
  - [ ] **Relaunch Check**: Restart and confirm thumbnails persist in Recently Tagged.

## Iteration 25: Red Close Button Quits App on macOS

**Timestamp**: 2026-02-05 08:36 - 08:37

- **Goal**: Ensure the red close control fully quits the app on macOS.
- **Action**:
  - Added an `app-quit` IPC channel and wired the red button to call `app.quit()`.
- **Verification**:
  - [ ] **Quit Test**: Run `npm run dev`, click the red close button, and confirm the app process exits.

## Iteration 26: History Cap + Thumbnail Refresh

**Timestamp**: 2026-02-05 08:44 - 08:46

- **Goal**: Limit history growth and fix stale thumbnail URLs from earlier runs.
- **Action**:
  - Capped Recently Tagged history at 50 items.
  - Regenerated thumbnails when stored previews are missing or `file://` based.
- **Verification**:
  - [ ] **Cap Check**: Tag more than 50 images; list should never exceed 50.
  - [ ] **Refresh Check**: Restart app and confirm older entries now show real thumbnails.

## Iteration 27: Clear History Control

**Timestamp**: 2026-02-05 08:50 - 08:52

- **Goal**: Allow users to clear the Recently Tagged history.
- **Action**:
  - Added a "Clear" button in the sidebar header that wipes history and localStorage.
- **Verification**:
  - [ ] **Clear Test**: Tag a few images, click "Clear", and confirm the list is empty after restart.

## Iteration 28: Prevent Duplicate Tags

**Timestamp**: 2026-02-05 08:56 - 08:58

- **Goal**: Avoid adding duplicate recipe tags when an image is re-processed.
- **Action**:
  - Read existing Keywords/Subject via ExifTool before tagging.
  - Skip tagging when the desired tag already exists and surface a status message.
- **Verification**:
  - [ ] **Duplicate Test**: Tag an image twice; second pass should skip and not duplicate the tag.

## Iteration 29: Remove ExifTool Console Noise

**Timestamp**: 2026-02-05 09:02 - 09:03

- **Goal**: Reduce console log noise during tagging.
- **Action**:
  - Removed the ExifTool command logging line.
- **Verification**:
  - [ ] **Noise Check**: Run `npm run dev`, tag images, and confirm ExifTool commands are no longer printed.

## Iteration 30: Bundle ExifTool for macOS

**Timestamp**: 2026-02-05 09:14 - 09:20

- **Goal**: Bundle ExifTool for macOS so the app runs without system installs.
- **Action**:
  - Copied Homebrew ExifTool into `resources/exiftool-mac/` (bin + libexec).
  - Patched the bundled `exiftool` script to use relative lib paths and a portable shebang (`#!/usr/bin/env perl`).
  - Updated `runExifTool` to prefer the bundled macOS binary and fall back to system `exiftool`.
- **Verification**:
  - [ ] **Bundled Run**: Temporarily move `/opt/homebrew/bin/exiftool` aside and confirm the app still tags images.
  - [ ] **Path Check**: Confirm `resources/exiftool-mac/bin/exiftool` runs from the repo: `resources/exiftool-mac/bin/exiftool -ver`.

### Windows Notes (For Anti-Gravity)

**What Windows still needs**:
- Place a Windows ExifTool binary at `resources/exiftool.exe` (rename `exiftool(-k).exe` to `exiftool.exe`).
- Add an `extraResources` entry for `resources/exiftool.exe` in `package.json` build config.

**Suggested Anti-Gravity prompt**:
"Bundle ExifTool for Windows in this Electron app. Download the Windows ExifTool zip, place `exiftool.exe` into `resources/`, and make sure the build/packaging config ships the `resources` folder. Confirm `runExifTool` checks `resources/exiftool.exe` and update dev notes with verification steps."

## Iteration 31: Production Packaging Setup (macOS)

**Timestamp**: 2026-02-05 09:32 - 09:36

- **Goal**: Prepare the app for DMG packaging with bundled macOS ExifTool.
- **Action**:
  - Added `electron-builder` config and scripts for `pack`/`dist`.
  - Updated ExifTool resolution to use `process.resourcesPath` when packaged.
  - Added `extraResources` to include `resources/exiftool-mac` in builds.
- **Verification**:
  - [ ] **Install Deps**: Run `npm install` to fetch `electron-builder`.
  - [ ] **Pack Test**: Run `npm run pack` and confirm the app launches from the output directory.
  - [ ] **DMG Build**: Run `npm run dist` and verify a DMG is produced under `dist/`.

## Iteration 32: Fix DMG Codesign Permission Error

**Timestamp**: 2026-02-05 09:44 - 09:46

- **Goal**: Resolve macOS codesign failure when packaging ExifTool resources.
- **Action**:
  - Normalized permissions under `resources/exiftool-mac` to be readable during codesigning.
- **Verification**:
  - [ ] **DMG Build**: Run `npm run dist` and confirm DMG is created without permission errors.

## Iteration 33: ExifTool Fetch Script + Repo Cleanup

**Timestamp**: 2026-02-05 10:02 - 10:07

- **Goal**: Keep the repo lean while still bundling ExifTool for macOS builds.
- **Action**:
  - Added `scripts/fetch_exiftool_macos.sh` to download and stage ExifTool locally.
  - Ignored `resources/exiftool-mac/` in `.gitignore` and wired `fetch:exiftool:mac` into build scripts.
  - Updated README dev steps to run the fetch script on macOS.
- **Verification**:
  - [ ] **Fetch**: Run `npm run fetch:exiftool:mac` and confirm `resources/exiftool-mac/bin/exiftool -ver` works.
  - [ ] **Build**: Run `npm run dist` and confirm a DMG is produced.

## Iteration 34: Add Changelog

**Timestamp**: 2026-02-05 10:18 - 10:20

- **Goal**: Add a release changelog for v1.0.0.
- **Action**:
  - Created `CHANGELOG.md` with v1.0.0 notes.
- **Verification**:
  - [ ] **Review**: Open `CHANGELOG.md` and confirm the entries reflect the current release.

## Backlog & Feature Ideas

### Things to Do

- [ ] Implement production build/packaging script (Iteration 17+).
- [ ] Create official GitHub release v1.0.0 on repository.
- [ ] Add an "Official Website" or "GitHub Repo" link in the sidebar.
- [ ] Add a screenshot of the program to the `README.md` file.

### Things to Verify

- [ ] **History Sidebar**: Investigate why images don't appear in the right-hand sidebar during/after the tagging process.
- [ ] **Cross-Platform**: Test UI aesthetics on macOS/Linux (currently optimized for Windows).
- [ ] **Large Batches**: Test performance with 500+ images in a single drop.

### Features to Add

- [ ] **Image Previews**: Hover over a history item to see a small thumbnail of the image.
- [ ] **Custom Tagging**: Allow users to manually override a recipe if the metadata is missing.
- [ ] **Export History**: Export the tagging logs as a CSV for photography records.
- [ ] **Automated Updates**: Check for new bundled ExifTool versions.


