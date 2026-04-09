import sqlite3
from pathlib import Path
from passlib.context import CryptContext

DB_PATH = Path("c:/Users/prath/Desktop/Breakout-Stocks/astraveda.db")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def init():
    print(f"Targeting Database: {DB_PATH}")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Ensure table exists
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users_v4 (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            is_admin BOOLEAN DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    admin_pass = "Akpr@#4923"
    hashed = hash_password(admin_pass)
    
    try:
        cursor.execute("""
            INSERT OR REPLACE INTO users_v4 (username, email, phone, password_hash, is_admin)
            VALUES (?, ?, ?, ?, ?)
        """, ('admin', 'admin@astraveda.link', '+00 00000 00000', hashed, 1))
        conn.commit()
        print("SUCCESS: Master Admin identity injected into v4 registry.")
    except Exception as e:
        print(f"FAILURE: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    init()
