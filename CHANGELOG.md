# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-02-05

### Added
- Electron desktop app with premium UI, drag-and-drop tagging, and history sidebar.
- ExifTool-based tagging and Image Tone extraction.
- Recently tagged thumbnails with persistence and clear-history control.
- Duplicate-tag prevention for reprocessed images.
- macOS ExifTool fetch script and packaging configuration for DMG builds.

### Changed
- Improved ExifTool resolution for packaged apps.
- History capped at 50 entries with auto-pruning for missing files.

### Fixed
- Main-process crash caused by process variable shadowing.
- Broken thumbnail URLs (now generated via nativeImage).
- Red close button now fully quits the app on macOS.
