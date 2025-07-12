import os
from pathlib import Path

EXTRA_IGNORES = {'.git', '.github', ',vscode', '.gitignore', 'tree.txt', 'tree_view.py'}  # Carpetas que se ignorarán explícitamente

def load_gitignore(base_path):
    gitignore_path = os.path.join(base_path, ".gitignore")
    ignore_paths = set()

    if os.path.exists(gitignore_path):
        with open(gitignore_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                ignore_paths.add(os.path.normpath(os.path.join(base_path, line.rstrip("/"))))
    return ignore_paths

def should_ignore(path, ignore_paths):
    resolved_path = Path(path).resolve()
    for ignore in ignore_paths:
        if resolved_path.as_posix().startswith(Path(ignore).resolve().as_posix()):
            return True
    if resolved_path.name in EXTRA_IGNORES:
        return True
    return False

def scan_directory(base_path, prefix="", ignore_paths=set(), output_lines=[]):
    entries = sorted(os.listdir(base_path))
    entries = [e for e in entries if not should_ignore(os.path.join(base_path, e), ignore_paths)]

    total = len(entries)
    for i, entry in enumerate(entries):
        path = os.path.join(base_path, entry)
        is_last = i == (total - 1)
        connector = "└── " if is_last else "├── "
        line = prefix + connector + entry
        output_lines.append(line)

        if os.path.isdir(path):
            extension = "    " if is_last else "│   "
            scan_directory(path, prefix + extension, ignore_paths, output_lines)

if __name__ == "__main__":
    current_path = os.path.dirname(os.path.abspath(__file__))
    ignore_paths = load_gitignore(current_path)

    output_lines = [f"{os.path.basename(current_path)}/"]
    scan_directory(current_path, ignore_paths=ignore_paths, output_lines=output_lines)

    # Mostrar en consola
    for line in output_lines:
        print(line)

    # Guardar en archivo
    output_file = os.path.join(current_path, "tree.txt")
    with open(output_file, "w", encoding="utf-8") as f:
        f.write("\n".join(output_lines))

    print(f"\n✅ Estructura guardada en: {output_file}")
