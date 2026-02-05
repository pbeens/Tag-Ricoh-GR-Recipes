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

## How to Use

1. **Launch**: Open `Ricoh GR Image Tagger.exe`.
2. **Import**: Drag a folder or a selection of JPEGs into the central drop zone.
3. **Wait**: The app will automatically read the "Image Tone" and apply the corresponding tag (e.g., `Negative Film Film Recipe`).
4. **Done**: Your files are now updated and will appear in the "Recently Tagged" sidebar.

## Technical Details

Built with a modern stack for performance and aesthetics:

- **Framework**: Electron
- **Frontend**: React + Vite
- **Metadata Engine**: Bundles ExifTool for robust industry-standard metadata handling.
- **Design**: custom Vanilla CSS with dark-mode optimizations.

## Community & Support

This project is dedicated to the Ricoh GR community. If you encounter any issues, have feature requests, or want to contribute, please use the **GitHub Issues** area of this repository.

---
*Developed for the Ricoh GR series.*
