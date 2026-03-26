from fastapi import FastAPI, Depends, HTTPException, status, Form
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
import mysql.connector
import os
import uuid
import jwt
from dotenv import load_dotenv
import hashlib
import logging

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(title="Agro-Genix API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection function
def get_db_connection():
    try:
        conn = mysql.connector.connect(
            host=os.getenv("MYSQL_HOST", "localhost"),
            port=int(os.getenv("MYSQL_PORT", "3306")),
            user=os.getenv("MYSQL_USER", "root"),
            password=os.getenv("MYSQL_PASSWORD", ""),
            database=os.getenv("MYSQL_DATABASE", "agrogenix")
        )
        return conn
    except mysql.connector.Error as err:
        logger.error(f"Database connection error: {err}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database connection error"
        )

# JWT settings
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-for-jwt")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Models
class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: str
    role: str

class UserCreate(BaseModel):
    email: str
    password: str
    name: Optional[str] = None

class User(BaseModel):
    id: str
    email: str
    name: Optional[str] = None
    role: str = "user"

class BookingCreate(BaseModel):
    user_id: str
    tour_id: str
    date: str
    guests: int
    special_requests: Optional[str] = None

class Booking(BaseModel):
    id: str
    user_id: str
    tour_id: str
    date: str
    guests: int
    special_requests: Optional[str] = None
    created_at: str

class LoginRecord(BaseModel):
    id: str
    user_id: str
    login_time: str
    ip_address: Optional[str] = None

# Helper functions
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hash_password(plain_password) == hashed_password

# Authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
    user_data = cursor.fetchone()
    cursor.close()
    conn.close()
    
    if user_data is None:
        raise credentials_exception
    
    return User(
        id=user_data["id"],
        email=user_data["email"],
        name=user_data.get("name"),
        role=user_data.get("role", "user")
    )

# Routes
@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    # Connect to database
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        # Get user by email
        cursor.execute("SELECT * FROM users WHERE email = %s", (form_data.username,))
        user = cursor.fetchone()
        
        if not user or not verify_password(form_data.password, user["password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user["id"]}, expires_delta=access_token_expires
        )
        
        # Record login
        login_id = str(uuid.uuid4())
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        cursor.execute(
            "INSERT INTO login_records (id, user_id, login_time) VALUES (%s, %s, %s)",
            (login_id, user["id"], now)
        )
        conn.commit()
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user_id": user["id"],
            "role": user.get("role", "user")
        }
    except Exception as e:
        conn.rollback()
        logger.error(f"Login error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )
    finally:
        cursor.close()
        conn.close()

@app.post("/register", response_model=User)
async def register_user(user: UserCreate):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        # Check if user already exists
        cursor.execute("SELECT * FROM users WHERE email = %s", (user.email,))
        if cursor.fetchone():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create new user
        user_id = str(uuid.uuid4())
        hashed_password = hash_password(user.password)
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        cursor.execute(
            "INSERT INTO users (id, email, password, name, created_at) VALUES (%s, %s, %s, %s, %s)",
            (user_id, user.email, hashed_password, user.name, now)
        )
        conn.commit()
        
        return {
            "id": user_id,
            "email": user.email,
            "name": user.name,
            "role": "user"
        }
    except Exception as e:
        conn.rollback()
        logger.error(f"Registration error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )
    finally:
        cursor.close()
        conn.close()

@app.post("/bookings", response_model=Booking)
async def create_booking(booking: BookingCreate, current_user: User = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        booking_id = str(uuid.uuid4())
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        cursor.execute(
            """
            INSERT INTO bookings 
            (id, user_id, tour_id, date, guests, special_requests, created_at) 
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (
                booking_id, 
                booking.user_id, 
                booking.tour_id, 
                booking.date, 
                booking.guests, 
                booking.special_requests, 
                now
            )
        )
        conn.commit()
        
        return {
            "id": booking_id,
            "user_id": booking.user_id,
            "tour_id": booking.tour_id,
            "date": booking.date,
            "guests": booking.guests,
            "special_requests": booking.special_requests,
            "created_at": now
        }
    except Exception as e:
        conn.rollback()
        logger.error(f"Booking creation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Booking creation failed: {str(e)}"
        )
    finally:
        cursor.close()
        conn.close()

@app.get("/admin/login-records", response_model=List[Dict[str, Any]])
async def get_login_records(current_user: User = Depends(get_current_user)):
    # Check if user is admin
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this resource"
        )
    
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        cursor.execute(
            """
            SELECT lr.id, lr.user_id, lr.login_time, u.email 
            FROM login_records lr
            JOIN users u ON lr.user_id = u.id
            ORDER BY lr.login_time DESC
            """
        )
        records = cursor.fetchall()
        return records
    except Exception as e:
        logger.error(f"Error fetching login records: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch login records: {str(e)}"
        )
    finally:
        cursor.close()
        conn.close()

@app.get("/admin/bookings", response_model=List[Dict[str, Any]])
async def get_all_bookings(current_user: User = Depends(get_current_user)):
    # Check if user is admin
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this resource"
        )
    
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        cursor.execute(
            """
            SELECT b.*, u.email as user_email 
            FROM bookings b
            JOIN users u ON b.user_id = u.id
            ORDER BY b.created_at DESC
            """
        )
        bookings = cursor.fetchall()
        return bookings
    except Exception as e:
        logger.error(f"Error fetching bookings: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch bookings: {str(e)}"
        )
    finally:
        cursor.close()
        conn.close()

# Setup database tables if they don't exist
@app.on_event("startup")
async def startup_db_client():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Create users table if it doesn't exist
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id VARCHAR(36) PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            name VARCHAR(255),
            role VARCHAR(50) DEFAULT 'user',
            created_at DATETIME NOT NULL
        )
        """)
        
        # Create login_records table if it doesn't exist
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS login_records (
            id VARCHAR(36) PRIMARY KEY,
            user_id VARCHAR(36) NOT NULL,
            login_time DATETIME NOT NULL,
            ip_address VARCHAR(50),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
        """)
        
        # Create bookings table if it doesn't exist
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS bookings (
            id VARCHAR(36) PRIMARY KEY,
            user_id VARCHAR(36) NOT NULL,
            tour_id VARCHAR(36) NOT NULL,
            date DATE NOT NULL,
            guests INT NOT NULL,
            special_requests TEXT,
            created_at DATETIME NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
        """)
        
        # Create admin user if it doesn't exist
        cursor.execute("SELECT * FROM users WHERE email = 'admin@agrogenix.com'")
        admin = cursor.fetchone()
        
        if not admin:
            admin_id = str(uuid.uuid4())
            admin_password = hash_password("admin123")  # Change in production
            now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            
            cursor.execute(
                "INSERT INTO users (id, email, password, name, role, created_at) VALUES (%s, %s, %s, %s, %s, %s)",
                (admin_id, "admin@agrogenix.com", admin_password, "Admin User", "admin", now)
            )
            
            logger.info("Created admin user: admin@agrogenix.com")
        
        conn.commit()
        logger.info("Database setup completed successfully")
    except Exception as e:
        logger.error(f"Database setup error: {e}")
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
