# Changelog

## [1.1.0] - 2026-02-09

### Added

- **Metadata Options Panel**: New UI section to select which photography parameters are included in tags.
- **EV Support**: Option to include Exposure Compensation (e.g., "EV: +0.7").
- **ISO Support**: Option to include ISO value (e.g., "ISO: 400").
- **White Balance**: Option to include White Balance (e.g., "WB: Daylight").
- **Bulk Actions**: "All" and "None" buttons for quick configuration.
- **Persistence**: Application settings and metadata choices are now saved between sessions.

### Fixed

- Improved tagging logic to better handle multiple simultaneous tags and prevent duplicates.

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-02-05

Initial Release:

- Electron desktop app with premium UI, drag-and-drop tagging, and history sidebar.
- ExifTool-based tagging and Image Tone extraction.
- Recently tagged thumbnails with persistence and clear-history control.
- Duplicate-tag prevention for reprocessed images.
- Improved ExifTool resolution for packaged apps and portable binaries.
- macOS ExifTool fetch script and packaging configuration for DMG builds.
- Support for Windows and macOS with native-looking window controls.
