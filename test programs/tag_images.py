import os
import json
import subprocess
import tkinter as tk
from tkinter import filedialog
from pathlib import Path

def get_exif_executable(script_dir):
    """
    Determines the best way to run ExifTool and returns it as a list of args.
    """
    # Prefer the local perl-based version if it exists
    local_exif_folder = script_dir / "exiftool_files"
    if local_exif_folder.exists():
        perl_exe = local_exif_folder / "perl.exe"
        exiftool_pl = local_exif_folder / "exiftool.pl"
        if perl_exe.exists() and exiftool_pl.exists():
            return [str(perl_exe), str(exiftool_pl)]
    
    # Fallback to local .exe
    local_exif = script_dir / "exiftool.exe"
    if local_exif.exists():
        return [str(local_exif)]
        
    local_exif_k = script_dir / "exiftool(-k).exe"
    if local_exif_k.exists():
        return [str(local_exif_k), "+k"]
        
    # Final fallback to system command
    try:
        subprocess.run(['exiftool', '-ver'], capture_output=True, check=True)
        return ['exiftool']
    except (subprocess.CalledProcessError, FileNotFoundError):
        return None

def get_image_tone(image_path, executable_args):
    """
    Extracts ImageTone from image metadata using list-based args.
    """
    cmd = executable_args + ['-json', '-ImageTone', str(image_path)]
    try:
        # shell=False is safer on Windows for paths with spaces or special characters
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        data = json.loads(result.stdout)
        if data and 'ImageTone' in data[0]:
            return data[0]['ImageTone']
    except Exception as e:
        print(f"  Error reading metadata for {image_path.name}: {e}")
    return None

def tag_image_with_tone(image_path, image_tone, executable_args):
    """
    Appends ImageTone to the Keywords and Subject tags safely.
    """
    # Using list-based arguments avoids shell mangling of special characters like '&'
    # We use -P to preserve modification date/time
    # -overwrite_original to avoid creating ._original files
    # -Keywords+= and -Subject+= appends to existing lists
    cmd = executable_args + [
        '-P', 
        '-overwrite_original',
        f'-Keywords+={image_tone}',
        f'-Subject+={image_tone}',
        str(image_path)
    ]
        
    try:
        subprocess.run(cmd, capture_output=True, text=True, check=True)
        print(f"  Successfully tagged {image_path.name} with: {image_tone}")
        return True
    except Exception as e:
        print(f"  Error tagging {image_path.name}: {e}")
    return False

def select_folder():
    """
    Opens a GUI dialog to select a folder.
    Returns the selected Path or None if cancelled.
    """
    # Hide the main tkinter window
    root = tk.Tk()
    root.withdraw()
    
    # Make sure the dialog is on top
    root.attributes('-topmost', True)
    
    folder_path = filedialog.askdirectory(title="Select Image Folder")
    
    root.destroy()
    return Path(folder_path) if folder_path else None

def main():
    script_dir = Path(__file__).parent.absolute()
    
    print("--- Ricoh GR Image Tagger ---")
    
    # Prompt for folder path using GUI
    print("Opening folder selection dialog...")
    images_dir = select_folder()
    
    if not images_dir:
        print("No folder selected. Exiting.")
        return
    
    if not images_dir.exists():
        print(f"Error: {images_dir} does not exist.")
        return

    # Set prefix and suffix programmatically
    prefix = '' # Example: 'Film Recipe: ' 
    suffix = ' Film Recipe' # Example: ' Film Recipe'

    executable_args = get_exif_executable(script_dir)
    if not executable_args:
        print("Error: 'exiftool' not found. Please ensure it's in the Test-Programs folder.")
        return

    images_to_process = set()
    # Double check that the program is only inspecting and tagging Jpegs
    for ext in ['*.jpg', '*.jpeg', '*.JPG', '*.JPEG']:
        images_to_process.update(images_dir.glob(ext))

    if not images_to_process:
        print(f"No images found in {images_dir}.")
        return

    print(f"\nFound {len(images_to_process)} images in {images_dir.name}. Starting...")

    for image_path in sorted(list(images_to_process)):
        tone = get_image_tone(image_path, executable_args)
        if tone:
            final_tag = f"{prefix}{tone}{suffix}"
            tag_image_with_tone(image_path, final_tag, executable_args)
        else:
            print(f"  Skipping {image_path.name}: No ImageTone metadata found.")

    print("\nProcessing complete!")

if __name__ == "__main__":
    main()
