# Ricoh GR Image Tagger - Development Context

This document serves as the central knowledge base for building the Electron-based version of the Ricoh GR Image Tagger.

## Core Objective

Convert the Python-based tagging logic into a premium, user-friendly desktop application that allows Ricoh GR users to quickly tag their photos with "Film Recipe" metadata.

## Technology Stack

- **Framework**: Electron
- **Build Tool**: Vite
- **UI Architecture**: React or Vue (to be determined during initialization)
- **Styling**: Vanilla CSS with custom tokens for a "stunning" aesthetic
- **Backend Logic**: Node.js `child_process` to interface with `exiftool.exe`

## Development Skills & Constraints

### 1. Metadata Handling (ExifTool)

- **Executable**: Must bundle `exiftool.exe` and its supporting files.
- **Commands**:
  - Read: `exiftool -json -ImageTone <path>`
  - Write: `exiftool -P -overwrite_original -Keywords+=<tone> -Subject+=<tone> <path>`
- **Safety**: Always use array-based arguments for `spawn` or `execFile` to avoid shell injections and path errors.

### 2. Design Philosophy

- **Aesthetic**: Dark mode by default, glassmorphism, sunset gradients.
- **Interactions**: Primary interaction should be Drag-and-Drop.
- **Feedback**: Real-time progress bars and a "Recently Tagged" list with image previews.

### 3. Folder Structure (Proposed)

- `src/main`: Electron main process (OS integration, file system).
- `src/renderer`: Frontend UI (React/CSS).
- `bin/`: Location for bundled `exiftool` binaries.

## Known Challenges

- **Permissions**: Ensuring the app has write access to image folders.
- **Pathing**: Handling Windows paths with spaces correctly in Node/ExifTool.
- **Performance**: Asynchronously processing batches of high-resolution images to keep the UI responsive.

## Testing & Verification

To provide a consistent environment for testing, use the provided test assets:

- **Test Asset**: `Test_Images.zip` contains a collection of untagged images.
- **Workflow**: Extract the contents of `Test_Images.zip` into the `Test-Images` folder (overwriting if necessary) to reset your testing environment with fresh, untagged images.

## Development Notes

Put every development iteration, successful or not, in the `DEV_NOTES.md` file. Include the date and time of each iteration, and a **Verification** section providing clear instructions for the user to test and validate the changes.

Additionally, maintain a **Backlog & Feature Ideas** section at the end of `DEV_NOTES.md` to track planned improvements, things to verify in the future, and new feature requests.
