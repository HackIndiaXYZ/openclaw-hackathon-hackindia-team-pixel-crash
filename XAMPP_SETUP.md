# Setting Up Agro-Genix with XAMPP

This guide will help you set up the Agro-Genix application using XAMPP for the MySQL database.

## Prerequisites

1. [XAMPP](https://www.apachefriends.org/index.html) installed on your system
2. [Node.js](https://nodejs.org/) (v14 or higher)
3. [Python](https://www.python.org/) (v3.8 or higher)

## Step 1: Set Up XAMPP

1. Download and install XAMPP from [https://www.apachefriends.org/index.html](https://www.apachefriends.org/index.html)
2. Start the XAMPP Control Panel
3. Start the Apache and MySQL services
4. Open your browser and navigate to [http://localhost/phpmyadmin](http://localhost/phpmyadmin)
5. Create a new database named `agrogenix`

## Step 2: Set Up the Backend

1. Navigate to the backend directory:
   \`\`\`
   cd backend
   \`\`\`

2. Create a `.env` file with the following content:
   \`\`\`
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_DATABASE=agrogenix
   MYSQL_USER=root
   MYSQL_PASSWORD=
   SECRET_KEY=your-secret-key-for-jwt
   \`\`\`

3. Install the required Python packages:
   \`\`\`
   pip install -r requirements.txt
   \`\`\`

4. Run the setup script to create the database tables:
   \`\`\`
   python setup.py
   \`\`\`

5. Start the backend server:
   \`\`\`
   python main.py
   \`\`\`

   The backend server will run on [http://localhost:8000](http://localhost:8000)

## Step 3: Set Up the Frontend

1. Navigate to the root directory of the project
2. Create a `.env.local` file with the following content:
   \`\`\`
   NEXT_PUBLIC_WEATHER_API_KEY=your-weather-api-key
   OPENAI_API_KEY=your-openai-api-key
   \`\`\`

3. Install the required Node.js packages:
   \`\`\`
   npm install
   \`\`\`

4. Start the development server:
   \`\`\`
   npm run dev
   \`\`\`

   The frontend will run on [http://localhost:3000](http://localhost:3000)

## Step 4: Access the Application

1. Open your browser and navigate to [http://localhost:3000](http://localhost:3000)
2. You can log in with the following credentials:
   - Admin: admin@agrogenix.com / admin123
   - User: user@example.com / password123

## Troubleshooting

### Database Connection Issues

If you encounter database connection issues:

1. Make sure the MySQL service is running in XAMPP
2. Check that the database name, username, and password in the `.env` file match your XAMPP configuration
3. Ensure the `agrogenix` database exists in phpMyAdmin

### Backend Server Issues

If the backend server fails to start:

1. Check the Python version (should be 3.8 or higher)
2. Make sure all required packages are installed
3. Verify that the `.env` file is correctly configured
4. Check if another process is already using port 8000

### Frontend Issues

If the frontend fails to connect to the backend:

1. Make sure the backend server is running
2. Check that the API endpoints in the frontend code are pointing to the correct URL
3. Verify that CORS is properly configured in the backend

## Additional Resources

- [XAMPP Documentation](https://www.apachefriends.org/docs/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)

## Installing XAMPP

### Windows
1. Download XAMPP from [Apache Friends](https://www.apachefriends.org/index.html)
2. Run the installer and follow the installation wizard
3. Choose the components you want to install (at minimum, Apache, MySQL, and phpMyAdmin)
4. Complete the installation

### macOS
1. Download XAMPP from [Apache Friends](https://www.apachefriends.org/index.html)
2. Open the .dmg file and drag the XAMPP folder to the Applications folder
3. Open the XAMPP application from the Applications folder

### Linux
1. Download XAMPP from [Apache Friends](https://www.apachefriends.org/index.html)
2. Make the installer executable:
   \`\`\`
   chmod +x xampp-linux-x64-[version]-installer.run
   \`\`\`
3. Run the installer:
   \`\`\`
   sudo ./xampp-linux-x64-[version]-installer.run
   \`\`\`
4. Follow the installation wizard

## Starting XAMPP Services

1. Open the XAMPP Control Panel:
   - Windows: Start XAMPP Control Panel from the Start menu
   - macOS: Open XAMPP from the Applications folder
   - Linux: Run `sudo /opt/lampp/lampp start` or use the XAMPP Control Panel

2. Start the Apache and MySQL services by clicking the "Start" buttons next to them

3. Verify that the services are running (the status should turn green)

## Creating the Database

1. Open phpMyAdmin by clicking the "Admin" button next to MySQL in the XAMPP Control Panel, or by navigating to http://localhost/phpmyadmin in your web browser

2. In phpMyAdmin, click on "New" in the left sidebar

3. Enter "agrogenix" as the database name

4. Select "utf8mb4_general_ci" as the collation

5. Click "Create" to create the database

## Configuring the Application

1. Update the `.env` file in the backend directory with your MySQL credentials:
   \`\`\`
   MYSQL_HOST=localhost
   MYSQL_USER=root
   MYSQL_PASSWORD=your_password_if_any
   MYSQL_DATABASE=agrogenix
   MYSQL_PORT=3306
   \`\`\`

   Note: By default, XAMPP's MySQL root user has no password. If you haven't set a password, leave MYSQL_PASSWORD empty.

2. Start the backend application:
   \`\`\`
   python main.py
   \`\`\`

3. Run the setup script to initialize the database:
   \`\`\`
   python setup.py
   \`\`\`

## Troubleshooting

### MySQL Won't Start
- Check if another MySQL instance is already running on port 3306
- Look at the XAMPP logs for error messages
- Try stopping and restarting the service

### Connection Refused
- Make sure MySQL is running in XAMPP
- Check that the host and port in your .env file match XAMPP's configuration
- Verify that your firewall isn't blocking the connection

### Access Denied
- Verify your MySQL username and password
- Check that the user has permissions to access the database

### Database Not Found
- Make sure you've created the "agrogenix" database in phpMyAdmin
- Check the database name in your .env file

## Accessing MySQL Directly

If you need to access MySQL directly:

1. From the XAMPP Control Panel, click "Shell"
2. Run the following command:
   \`\`\`
   mysql -u root -p
   \`\`\`
3. Enter your password if prompted (press Enter if no password)
4. You can now run SQL commands directly, for example:
   \`\`\`
   USE agrogenix;
   SHOW TABLES;
   SELECT * FROM users;
   \`\`\`

## Database Structure

The application uses the following tables:

### users
- `id`: VARCHAR(36) - Primary key
- `email`: VARCHAR(255) - Unique email address
- `name`: VARCHAR(255) - User's name
- `password`: VARCHAR(255) - Hashed password
- `role`: VARCHAR(50) - User role (admin or user)
- `created_at`: TIMESTAMP - Account creation time

### login_records
- `id`: VARCHAR(36) - Primary key
- `user_id`: VARCHAR(36) - Foreign key to users.id
- `email`: VARCHAR(255) - Email used for login attempt
- `timestamp`: TIMESTAMP - Login attempt time
- `ip_address`: VARCHAR(50) - IP address of login attempt
- `user_agent`: TEXT - Browser/device information
- `success`: BOOLEAN - Whether login was successful

### bookings
- `id`: VARCHAR(36) - Primary key
- `user_id`: VARCHAR(36) - Foreign key to users.id
- `farm_id`: VARCHAR(36) - Farm identifier
- `farm_name`: VARCHAR(255) - Farm name
- `date`: DATE - Booking date
- `time_slot`: VARCHAR(50) - Time slot
- `adults`: INT - Number of adult visitors
- `children`: INT - Number of child visitors
- `total_price`: DECIMAL(10, 2) - Total booking price
- `activities`: JSON - Selected activities
- `special_requests`: TEXT - Special requests
- `status`: VARCHAR(50) - Booking status
- `created_at`: TIMESTAMP - Booking creation time
