"""Force UTF-8 encoding for stdout/stderr on Windows."""
import sys
import io

def fix_windows_encoding():
    """Reconfigure stdout/stderr to UTF-8 on Windows."""
    if sys.platform == "win32":
        try:
            sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
            sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
        except Exception:
            pass

# Auto-run on import
fix_windows_encoding()