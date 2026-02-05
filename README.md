# Ricoh GR Image Tagger v1.0.0

A premium desktop application designed for Ricoh GR photographers to automatically tag their JPEGs with "Film Recipe" metadata.

## Overview

The Ricoh GR Image Tagger streamlines your post-processing workflow by automatically extracting the **Image Tone** (e.g., "Negative Film", "Positive Film") from your photos' EXIF data and writing it to the **Keywords** and **Subject** tags. This makes your recipes searchable in Adobe Lightroom, Capture One, and Windows File Explorer.

## Key Features

- **Stunning UI**: A modern, dark-themed interface featuring glassmorphism and sunset-themed accents.
- **Drag-and-Drop Workflow**: Simply drag your JPEGs onto the application to start tagging.
- **Zero Configuration**: Comes bundled with ExifTool—no manual installation or command-line knowledge required.
- **Batched Processing**: Process dozens of high-resolution images in seconds.
- **History Tracking**: Keep track of your recently tagged images and their extracted recipes directly in the sidebar.
- **Lossless Tagging**: Preserves the "Date Modified" of your files while adding metadata.

## Download (Release Builds)

Get the latest macOS and Windows builds from the GitHub Releases page:

[https://github.com/pbeens/Tag-Ricoh-GR-Recipes/releases](https://github.com/pbeens/Tag-Ricoh-GR-Recipes/releases)

The release builds include a bundled copy of ExifTool, so no extra installs are required.

## How to Use

1. **Launch**: Open the app from the release build (`.dmg` on macOS, `.exe` on Windows).
2. **Import**: Drag a folder or a selection of JPEGs into the central drop zone.
3. **Wait**: The app will automatically read the "Image Tone" and apply the corresponding tag (e.g., `Negative Film Film Recipe`).
4. **Done**: Your files are now updated and will appear in the "Recently Tagged" sidebar.

## Build From Source (macOS)

### Prerequisites
- **Node.js** (LTS recommended) and **npm**
- **Git**

### Setup & Run (Dev)
```bash
git clone https://github.com/pbeens/Tag-Ricoh-GR-Recipes.git
cd Tag-Ricoh-GR-Recipes
npm install
npm run fetch:exiftool:mac
npm run dev
```

### Build a DMG
```bash
npm run dist
```

The DMG will be created under `dist/`.

## Build From Source (Windows)

### Prerequisites
- **Node.js** (LTS recommended) and **npm**
- **Git**
- **ExifTool** for Windows

### Setup & Run (Dev)
```bat
git clone https://github.com/pbeens/Tag-Ricoh-GR-Recipes.git
cd Tag-Ricoh-GR-Recipes
npm install
npm run dev
```

### ExifTool (Windows)
Place `exiftool.exe` in `resources/` so the app can find it during development and packaging.

### Build an EXE (Windows)
```bat
npm run dist
```

The installer or portable build will be created under `dist/`.

## Technical Details

Built with a modern stack for performance and aesthetics:

- **Framework**: Electron
- **Frontend**: React + Vite
- **Metadata Engine**: Bundles ExifTool in release builds for robust industry-standard metadata handling.
- **Design**: custom Vanilla CSS with dark-mode optimizations.

## Community & Support

This project is dedicated to the Ricoh GR community. If you encounter any issues, have feature requests, or want to contribute, please use the **[GitHub Issues](https://github.com/pbeens/Tag-Ricoh-GR-Recipes/issues)** area of this repository.

---
*Developed for the Ricoh GR series.*
