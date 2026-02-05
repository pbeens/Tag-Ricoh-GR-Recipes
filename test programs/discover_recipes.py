import os
import json
import subprocess
import re
from pathlib import Path

def get_exif_data_advanced(image_path, executable, use_shell):
    """
    Extracts data with advanced command handling.
    """
    tags = ['ImageTone', 'Saturation', 'Contrast', 'Hue', 'HighLowKeyAdj', 'Clarity', 'Toning']
    tags_str = " ".join([f"-{t}" for t in tags])
    
    # Only add +k if we are specifically using an .exe with (-k) in the name
    k_flag = '+k' if '(-k)' in executable and not executable.endswith('.pl"') else ''
    
    if use_shell:
        # Extra care for k_flag space
        k_part = f" {k_flag}" if k_flag else ""
        cmd = f'{executable} -json{k_part} {tags_str} "{image_path}"'
    else:
        cmd_args = ['-json']
        if k_flag: cmd_args.append(k_flag)
        cmd = [executable] + cmd_args + [f"-{t}" for t in tags] + [str(image_path)]
        
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True, shell=use_shell)
        data = json.loads(result.stdout)
        if data: return data[0]
    except subprocess.CalledProcessError as e:
        print(f"Error: {e.stderr}")
    except Exception as e:
        print(f"Unexpected error: {e}")
    return {}

def parse_filename(filename):
    """
    Parses the filename to extract the 'Key'.
    Example: 'R0001546 - Standard.JPG' -> 'Standard'
    """
    name = Path(filename).stem
    match = re.search(r'-\s*(.+)$', name)
    if match:
        return match.group(1).strip()
    match = re.search(r'IMG_(.+)$', name, re.IGNORECASE)
    if match:
        return match.group(1).strip()
    return name

def update_readme(readme_path, json_output):
    """
    Updates the README.md file by replacing content between markers.
    """
    start_marker = "<!-- DISCOVERED RECIPES START -->"
    end_marker = "<!-- DISCOVERED RECIPES END -->"
    
    content = ""
    if readme_path.exists():
        with open(readme_path, 'r', encoding='utf-8') as f:
            content = f.read()

    new_section = f"{start_marker}\n\n## Discovered Recipes\n\n```json\n{json_output}\n```\n\n{end_marker}"
    
    if start_marker in content and end_marker in content:
        pattern = re.compile(f"{re.escape(start_marker)}.*?{re.escape(end_marker)}", re.DOTALL)
        updated_content = pattern.sub(new_section, content)
    else:
        if start_marker in content:
             updated_content = content.split(start_marker)[0] + new_section
        else:
            updated_content = content.strip() + "\n\n" + new_section

    with open(readme_path, 'w', encoding='utf-8') as f:
        f.write(updated_content.strip() + "\n")

def main():
    script_dir = Path(__file__).parent.absolute()
    images_dir = script_dir.parent / "Test-Images"
    readme_path = script_dir.parent / "README.md"
    
    if not images_dir.exists():
        print(f"Error: {images_dir} does not exist.")
        return

    # Determine executable path
    executable = "exiftool"
    local_exif = script_dir / "exiftool.exe"
    local_exif_k = script_dir / "exiftool(-k).exe"
    local_exif_folder = script_dir / "exiftool_files"

    if local_exif_folder.exists():
        perl_exe = local_exif_folder / "perl.exe"
        exiftool_pl = local_exif_folder / "exiftool.pl"
        if perl_exe.exists() and exiftool_pl.exists():
            executable = f'"{perl_exe}" "{exiftool_pl}"'
            print(f"Using Perl-based ExifTool: {executable}")
        else:
            if local_exif.exists(): executable = f'"{local_exif}"'
            elif local_exif_k.exists(): executable = f'"{local_exif_k}"'
    else:
        try:
            subprocess.run(['exiftool', '-ver'], capture_output=True, check=True)
        except (subprocess.CalledProcessError, FileNotFoundError):
            if local_exif.exists(): executable = f'"{local_exif}"'
            elif local_exif_k.exists(): executable = f'"{local_exif_k}"'
            else:
                print("Error: 'exiftool' not found.")
                return

    recipes = {}
    
    # Use a set to avoid processing the same image twice (Windows glob can be case-insensitive)
    images_to_process = set()
    for ext in ['*.jpg', '*.jpeg', '*.JPG', '*.JPEG']:
        images_to_process.update(images_dir.glob(ext))

    for image_path in sorted(list(images_to_process)):
        key = parse_filename(image_path.name)
        print(f"Processing {image_path.name}...")
        
        use_shell = '"' in executable
        exif_data = get_exif_data_advanced(image_path, executable, use_shell)
        exif_data.pop('SourceFile', None)
        recipes[key] = exif_data

    if not recipes:
        print("No recipes found.")
        return

    json_output = json.dumps(recipes, indent=4)
    update_readme(readme_path, json_output)
    print("Done!")

if __name__ == "__main__":
    main()
