# Ricoh GR IV Recipe Tagger

A collection of tools and images for discovering and managing Ricoh GR IV image processing "recipes".

## Overview

This repository contains:
- **Test-Images**: A set of sample JPEG images taken with a Ricoh GR IV using various Image Control settings.
- **Test-Programs**: Utility scripts to extract and manage metadata from these images.

## Getting Started

### Prerequisites

To use the discovery tools, you need:
1.  **Python 3.x**: [Download Python](https://www.python.org/downloads/)
2.  **ExifTool**: A powerful command-line application for metadata management.
    - **Download**: [exiftool.org](https://exiftool.org/) (Download the "Windows Executable" `.zip`).
    - **Setup**: 
        1. Extract the `.zip` file.
        2. **Option A**: Place the extracted `exiftool(-k).exe` directly in the `Test-Programs` folder (no renaming required!).
        3. **Option B**: Rename it to `exiftool.exe` and add it to your system's PATH (e.g., put it in `C:\Windows`).

### Usage

To extract recipes from the provided test images:

1.  Open a terminal/command prompt.
2.  Navigate to the `Test-Programs` directory:
    ```bash
    cd Test-Programs
    ```
3.  Run the discovery script:
    ```bash
    python discover_recipes.py
    ```

The script will:
- Scan the `../Test-Images` folder.
- Extract MakerNote settings (Saturation, Contrast, etc.) using `exiftool`.
- **Smart Update**: Automatically replace the content between the markers in this `README.md` with the latest results.

## Community Contributions

If you have unique Ricoh GR IV recipes, feel free to contribute!
1.  Upload your sample image to `Test-Images` with a descriptive filename (e.g., `MyCustomRecipe.jpg`).
2.  Run the `discover_recipes.py` script to update the metadata registry.
3.  Submit a Pull Request.

---
<!-- DISCOVERED RECIPES START -->

## Discovered Recipes

```json
{
    "IV-001448 - Unknown": {
        "ImageTone": "Hi-contrast B&W",
        "Saturation": "Normal",
        "Contrast": "Normal"
    },
    "IV-001449 - Cross Processing 2": {
        "ImageTone": "Cross Processing 2",
        "Saturation": "Normal",
        "Contrast": "Normal"
    },
    "IV-001452 20260113": {
        "ImageTone": "Cross Processing 2",
        "Saturation": "Normal",
        "Contrast": "Normal"
    },
    "Standard": {
        "ImageTone": "Standard",
        "Saturation": "Normal",
        "Contrast": "Normal"
    },
    "Vivid": {
        "ImageTone": "Vivid",
        "Saturation": "Normal",
        "Contrast": "High"
    }
}
```

<!-- DISCOVERED RECIPES END -->
