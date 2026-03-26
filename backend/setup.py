import os
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
import hashlib
import uuid
from datetime import datetime

# Load environment variables
load_dotenv()

def setup_database():
    """Set up the MySQL database and tables for Agro-Genix"""
    
    # Database connection parameters
    config = {
        'host': os.getenv('MYSQL_HOST', 'localhost'),
        'port': int(os.getenv('MYSQL_PORT', '3306')),
        'user': os.getenv('MYSQL_USER', 'root'),
        'password': os.getenv('MYSQL_PASSWORD', '')
    }
    
    conn = None
    cursor = None
    
    try:
        # Connect to MySQL server
        print("Connecting to MySQL server...")
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()
        
        # Create database if it doesn't exist
        db_name = os.getenv('MYSQL_DATABASE', 'agrogenix')
        print(f"Creating database '{db_name}' if it doesn't exist...")
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {db_name}")
        cursor.execute(f"USE {db_name}")
        
        # Create users table
        print("Creating users table...")
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
        
        # Create login_records table
        print("Creating login_records table...")
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS login_records (
            id VARCHAR(36) PRIMARY KEY,
            user_id VARCHAR(36) NOT NULL,
            login_time DATETIME NOT NULL,
            ip_address VARCHAR(50),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
        """)
        
        # Create bookings table
        print("Creating bookings table...")
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
        
        # Create admin user
        print("Creating admin user...")
        cursor.execute("SELECT * FROM users WHERE email = 'admin@agrogenix.com'")
        admin = cursor.fetchone()
        
        if not admin:
            admin_id = str(uuid.uuid4())
            admin_password = hashlib.sha256("admin123".encode()).hexdigest()  # Change in production
            now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            
            cursor.execute(
                "INSERT INTO users (id, email, password, name, role, created_at) VALUES (%s, %s, %s, %s, %s, %s)",
                (admin_id, "admin@agrogenix.com", admin_password, "Admin User", "admin", now)
            )
            print("Admin user created successfully.")
        else:
            print("Admin user already exists.")
        
        # Create test user
        print("Creating test user...")
        cursor.execute("SELECT * FROM users WHERE email = 'user@example.com'")
        test_user = cursor.fetchone()
        
        if not test_user:
            user_id = str(uuid.uuid4())
            user_password = hashlib.sha256("password123".encode()).hexdigest()
            now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            
            cursor.execute(
                "INSERT INTO users (id, email, password, name, role, created_at) VALUES (%s, %s, %s, %s, %s, %s)",
                (user_id, "user@example.com", user_password, "Test User", "user", now)
            )
            print("Test user created successfully.")
        else:
            print("Test user already exists.")
        
        conn.commit()
        print("Database setup completed successfully!")
        
    except Error as e:
        print(f"Error: {e}")
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()
            print("MySQL connection closed.")

if __name__ == "__main__":
    setup_database()
