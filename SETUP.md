# Agro-Genix Setup Guide

This guide will help you set up the Agro-Genix application on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **Python** (version 3.8 or higher)
- **pip** (comes with Python)
- **XAMPP** (for MySQL database)

## Step 1: Clone the Repository

\`\`\`bash
git clone <repository-url>
cd agro-genix
\`\`\`

## Step 2: Frontend Setup

### Install Dependencies
\`\`\`bash
npm install
\`\`\`

### Environment Variables
Create a `.env.local` file in the root directory:

\`\`\`env
# OpenAI API Key for AI features
OPENAI_API_KEY=your_openai_api_key_here

# Weather API Key
NEXT_PUBLIC_WEATHER_API_KEY=your_weather_api_key_here

# MySQL Database Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=agrogenix
MYSQL_USER=root
MYSQL_PASSWORD=
\`\`\`

### Start Frontend Development Server
\`\`\`bash
npm run dev
\`\`\`

The frontend will be available at `http://localhost:3000`

## Step 3: Backend Setup

### Navigate to Backend Directory
\`\`\`bash
cd backend
\`\`\`

### Install Python Dependencies
\`\`\`bash
pip install -r requirements.txt
\`\`\`

### Backend Environment Variables
Create a `.env` file in the `backend` directory:

\`\`\`env
# MySQL Database Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=agrogenix
MYSQL_USER=root
MYSQL_PASSWORD=

# JWT Secret Key (change this in production)
SECRET_KEY=your-secret-key-for-jwt-tokens
\`\`\`

### Start Backend Server
\`\`\`bash
python main.py
\`\`\`

The backend API will be available at `http://localhost:8000`

## Step 4: Database Setup

### Start XAMPP
1. Launch XAMPP Control Panel
2. Start **Apache** and **MySQL** services

### Create Database
1. Open your browser and go to `http://localhost/phpmyadmin`
2. Click on the "SQL" tab
3. Copy and paste the SQL script from the setup guide
4. Click "Go" to execute

### Verify Database Setup
- Check that the `agrogenix` database exists
- Verify that tables (`users`, `login_records`, `bookings`) are created
- Confirm that sample data is inserted

## Step 5: Test the Application

### Default Login Credentials
- **Admin User**: 
  - Email: `admin@agrogenix.com`
  - Password: `admin123`

- **Test User**: 
  - Email: `user@example.com`
  - Password: `password123`

### Test Features
1. Visit `http://localhost:3000`
2. Try logging in with the default credentials
3. Test various features like weather, crop suggestions, etc.
4. Try creating a booking in the Agro Tourism section

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure XAMPP MySQL is running
   - Check database credentials in `.env` files
   - Verify database exists in phpMyAdmin

2. **Frontend Build Errors**
   - Delete `node_modules` and run `npm install` again
   - Check that all environment variables are set

3. **Backend API Errors**
   - Ensure all Python dependencies are installed
   - Check that the backend server is running on port 8000
   - Verify database connection

4. **CORS Issues**
   - Ensure both frontend (3000) and backend (8000) are running
   - Check that CORS is properly configured in the backend

### Getting Help

If you encounter issues:
1. Check the console logs for error messages
2. Verify all services are running (frontend, backend, database)
3. Ensure all environment variables are correctly set
4. Check that ports 3000 and 8000 are not being used by other applications

## Production Deployment

For production deployment:
1. Update environment variables with production values
2. Use a production-grade database setup
3. Configure proper security settings
4. Set up SSL certificates
5. Use a process manager like PM2 for the backend

## Next Steps

Once everything is set up:
1. Explore the different features of the application
2. Customize the styling and branding
3. Add additional features as needed
4. Set up monitoring and logging for production use
