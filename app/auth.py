import sqlite3
import time
from pathlib import Path

import jwt
from passlib.context import CryptContext
from app.config import ScannerConfig

config = ScannerConfig()
BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "astraveda.db"
pwd_context = CryptContext(schemes=["pbkdf2_sha256", "bcrypt"], deprecated="auto")
UserRow = tuple[str, str, str, str, str | None, str | None, int]
AdminUserRow = tuple[int, str, str, str, int, str]

def init_db() -> None:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users_v4 (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            face_image TEXT,
            face_enrolled_at TIMESTAMP,
            is_admin BOOLEAN DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cursor.execute("PRAGMA table_info(users_v4)")
    user_columns = {row[1] for row in cursor.fetchall()}
    if "face_image" not in user_columns:
        cursor.execute("ALTER TABLE users_v4 ADD COLUMN face_image TEXT")
    if "face_enrolled_at" not in user_columns:
        cursor.execute("ALTER TABLE users_v4 ADD COLUMN face_enrolled_at TIMESTAMP")
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS journal_entries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_email TEXT NOT NULL,
            title TEXT NOT NULL,
            thesis TEXT NOT NULL,
            execution TEXT NOT NULL,
            lesson TEXT NOT NULL,
            tags TEXT DEFAULT '',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS watchlists (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_email TEXT NOT NULL,
            name TEXT NOT NULL,
            symbols TEXT NOT NULL,
            notes TEXT DEFAULT '',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS alert_rules (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_email TEXT NOT NULL,
            name TEXT NOT NULL,
            rule_type TEXT NOT NULL,
            scope TEXT NOT NULL,
            threshold TEXT NOT NULL,
            notes TEXT DEFAULT '',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS playbooks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_email TEXT NOT NULL,
            title TEXT NOT NULL,
            setup_type TEXT NOT NULL,
            bias TEXT NOT NULL,
            entry_rule TEXT NOT NULL,
            risk_rule TEXT NOT NULL,
            exit_rule TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS risk_profiles (
            user_email TEXT PRIMARY KEY,
            account_size REAL NOT NULL DEFAULT 100000,
            risk_per_trade REAL NOT NULL DEFAULT 1,
            max_daily_loss REAL NOT NULL DEFAULT 3,
            preferred_rr REAL NOT NULL DEFAULT 2,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS video_strategy_runs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_email TEXT NOT NULL,
            source_url TEXT NOT NULL,
            video_id TEXT NOT NULL,
            title TEXT NOT NULL,
            primary_strategy TEXT NOT NULL,
            confidence INTEGER NOT NULL DEFAULT 0,
            transcript_length INTEGER NOT NULL DEFAULT 0,
            tags TEXT DEFAULT '',
            scanner_lens TEXT DEFAULT '',
            guidance TEXT DEFAULT '',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS discipline_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_email TEXT NOT NULL,
            rule_type TEXT NOT NULL,
            severity TEXT NOT NULL,
            symbol TEXT DEFAULT '',
            note TEXT DEFAULT '',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS daily_loss_states (
            user_email TEXT NOT NULL,
            trade_date TEXT NOT NULL,
            realized_pnl REAL NOT NULL DEFAULT 0,
            note TEXT DEFAULT '',
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (user_email, trade_date)
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS aplus_setups (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_email TEXT NOT NULL,
            title TEXT NOT NULL,
            symbol TEXT NOT NULL,
            setup_type TEXT NOT NULL,
            bias TEXT NOT NULL,
            rationale TEXT NOT NULL,
            context_note TEXT DEFAULT '',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

# Initialize DB on import
init_db()

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_user_by_identifier(identifier: str) -> UserRow | None:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    # Check username, email, or phone
    query = "SELECT username, email, phone, password_hash, face_image, face_enrolled_at, is_admin FROM users_v4 WHERE username = ? OR email = ? OR phone = ?"
    cursor.execute(query, (identifier.lower(), identifier.lower(), identifier))
    user = cursor.fetchone()
    conn.close()
    return user

def get_all_users() -> list[AdminUserRow]:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT id, username, email, phone, is_admin, created_at FROM users_v4 ORDER BY created_at DESC")
    users = cursor.fetchall()
    conn.close()
    return users

def delete_user_by_id(user_id: int) -> None:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM users_v4 WHERE id = ?", (user_id,))
    conn.commit()
    conn.close()

def create_user(username: str, email: str, phone: str, password: str, face_image: str | None = None) -> bool:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    hashed = hash_password(password)
    try:
        cursor.execute(
            """
            INSERT INTO users_v4 (username, email, phone, password_hash, face_image, face_enrolled_at)
            VALUES (?, ?, ?, ?, ?, CASE WHEN ? IS NOT NULL THEN CURRENT_TIMESTAMP ELSE NULL END)
            """,
            (username.lower(), email.lower(), phone, hashed, face_image, face_image)
        )
        conn.commit()
        return True
    except sqlite3.IntegrityError as e:
        print(f"Registration Integrity Error: {e}")
        return False
    finally:
        conn.close()

def create_user_token(email: str, is_admin: bool = False) -> str:
    payload = {
        "email": email.lower(),
        "is_admin": is_admin,
        "iat": int(time.time()),
        "exp": int(time.time() + (24 * 3600))  # 24 hours
    }
    return jwt.encode(payload, config.jwt_secret, algorithm="HS256")

def verify_token(token: str | None) -> dict | None:
    if not token:
        return None
    try:
        payload = jwt.decode(token, config.jwt_secret, algorithms=["HS256"])
        return payload
    except Exception:
        return None
