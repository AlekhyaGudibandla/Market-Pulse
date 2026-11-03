import os
import sys
from pathlib import Path

# Ensure backend directory is always in sys.path regardless of where script is invoked
ROOT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = ROOT_DIR / "backend"

if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

if __name__ == "__main__":
    import uvicorn

    print(f"[*] Starting MarketPulse Intelligence Engine from: {BACKEND_DIR}")
    uvicorn.run(
        "app.main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        reload_dirs=[str(BACKEND_DIR)],
    )
