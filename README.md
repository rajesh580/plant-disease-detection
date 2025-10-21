# Plant Disease Detection System

<div align="center">

![Plant Disease Detection](https://img.shields.io/badge/AI-Plant%20Disease%20Detection-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Python](https://img.shields.io/badge/python-3.11+-blue)
![Node](https://img.shields.io/badge/node-16+-green)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110.1-009688)
![React](https://img.shields.io/badge/React-18.2.0-61dafb)

[Features](#features) • [Prerequisites](#prerequisites) • [Installation](#installation) • [Usage](#usage) • [API](#api) • [Contributing](#contributing)

</div>

## Overview

The Plant Disease Detection System is an advanced, AI-powered full-stack application that leverages Google's Gemini AI technology to identify and analyze plant diseases. This system provides real-time analysis, treatment recommendations, and preventive measures to help maintain plant health.

## ✨ Features

- 🔍 **Advanced Disease Detection** using Google's Gemini AI
- 📸 **Real-time Image Analysis** with instant results
- 📊 **Severity Assessment** with confidence scores
- 💊 **Treatment Recommendations** based on detected conditions
- 🛡️ **Prevention Guidelines** for future plant health
- 📱 **Responsive Design** works on all devices
- 🔄 **Real-time Updates** with WebSocket support
- 📦 **MongoDB Integration** for result storage

## 🛠️ Tech Stack

### Frontend
- ⚛️ **React** - UI Framework
- 🎨 **TailwindCSS** - Styling
- 🎯 **Shadcn/ui** - Component Library
- 📱 **Responsive Design** - Mobile-first approach

### Backend
- ⚡ **FastAPI** - Python web framework
- 🍃 **MongoDB** - Database
- 🤖 **Google Gemini AI** - AI/ML capabilities
- 🔐 **JWT Authentication** - Security

## Installation Guide

### Prerequisites

Before installing the Plant Disease Detection System, ensure your system meets the following requirements:

#### Required Software

| Software | Version | Purpose | Installation Guide |
|----------|---------|---------|-------------------|
| Node.js | 16.x or higher | Frontend Development | [Download](https://nodejs.org/) |
| Python | 3.11 or higher | Backend Development | [Download](https://www.python.org/downloads/) |
| MongoDB | 6.0 or higher | Database | [Download](https://www.mongodb.com/try/download/community) |
| Git | Latest | Version Control | [Download](https://git-scm.com/downloads) |

#### System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| CPU | 2 cores, 2.0 GHz | 4+ cores, 3.0+ GHz |
| RAM | 4 GB | 8+ GB |
| Storage | 1 GB free | 5+ GB free |
| Internet | 5 Mbps | 10+ Mbps |

#### API Requirements

1. **Google Cloud Account Setup**
   ```bash
   # Visit Google Cloud Console
   1. Go to https://console.cloud.google.com/
   2. Create a new project or select existing
   3. Enable Gemini API for your project
   4. Create API credentials
   5. Save the API key securely
   ```

### Environment Setup

1. **Verify Installations**
   ```bash
   # Check installed versions
   node --version        # Should be 16.x or higher
   python --version      # Should be 3.11.x or higher
   pip --version        # Should be 21.x or higher
   git --version        # Should show installed version
   mongosh --version    # Should be 6.x or higher
   ```

2. **MongoDB Configuration**
   ```bash
   # Windows
   1. Open Services (services.msc)
   2. Locate "MongoDB Server"
   3. Ensure service is running
   4. Default port: 27017

   # Linux
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

3. **Code Editor Setup**
   - Install Visual Studio Code or preferred IDE
   - Recommended Extensions:
     ```
     - Python
     - ES7+ React/Redux/React-Native snippets
     - Tailwind CSS IntelliSense
     - MongoDB for VS Code
     ```

### Project Installation

#### 1. Backend Setup

1. **Clone and Navigate**
   ```bash
   # Clone repository
   git clone https://github.com/rajesh580/plant-disease-detection.git
   cd plant-disease-detection

   # Create necessary directories
   mkdir -p data/db
   mkdir -p logs
   ```

2. **Backend Environment Setup**
   ```bash
   # Navigate to backend
   cd backend

   # Create and activate virtual environment
   # Windows
   python -m venv venv
   .\venv\Scripts\activate

   # Linux/macOS
   python -m venv venv
   source venv/bin/activate

   # Upgrade pip
   python -m pip install --upgrade pip

   # Install dependencies
   pip install -r requirements.txt
   ```

3. **Backend Configuration**
   Create `.env` file in `backend/` directory:
   ```env
   # Required: MongoDB Configuration
   MONGO_URL="mongodb://localhost:27017"
   DB_NAME="plant_disease_db"

   # Required: CORS Settings (comma-separated)
   CORS_ORIGINS="http://localhost:3000,http://localhost:3001"

   # Required: Google API Configuration
   GOOGLE_API_KEY="your-google-api-key"

   # Optional: Logging Configuration
   LOG_LEVEL="INFO"
   LOG_FILE="logs/app.log"

   # Optional: Server Configuration
   HOST="0.0.0.0"
   PORT=4000
   WORKERS=4

   # Optional: Rate Limiting
   RATE_LIMIT_PER_MINUTE=2
   ```

4. **Database Initialization**
   ```bash
   # Windows
   net start MongoDB

   # Linux/macOS
   sudo systemctl start mongod

   # Verify MongoDB connection
   mongosh --eval "db.version()"
   ```

5. **Start Backend Server**
   ```bash
   # Development mode
   uvicorn server:app --reload --port 4000

   # Production mode
   uvicorn server:app --host 0.0.0.0 --port 4000 --workers 4
   ```

6. **Verify Backend**
   ```bash
   # Check API status
   curl http://localhost:4000/api/
   # Should return: {"message":"Plant Disease Detection API"}
   ```

#### 2. Frontend Setup

1. **Dependencies Installation**
   ```bash
   # Navigate to frontend
   cd ../frontend

   # Install dependencies (choose one)
   yarn install    # Recommended
   # OR
   npm install
   ```

2. **Frontend Configuration**
   Create `.env` file in `frontend/` directory:
   ```env
   # Required: Backend API URL
   REACT_APP_BACKEND_URL=http://localhost:4000

   # Optional: Environment
   NODE_ENV=development

   # Optional: Port Configuration
   PORT=3000

   # Optional: Analytics
   REACT_APP_GA_ID=your-ga-id

   # Optional: Image Upload
   REACT_APP_MAX_IMAGE_SIZE=10485760  # 10MB
   REACT_APP_ALLOWED_FORMATS=".jpg,.jpeg,.png"
   ```

3. **Build Dependencies**
   ```bash
   # Development build
   yarn build:dev    # or npm run build:dev

   # Production build
   yarn build        # or npm run build
   ```

4. **Start Frontend Server**
   ```bash
   # Development mode
   yarn start        # or npm start

   # Production mode with server
   yarn serve        # or npm run serve
   ```

5. **Verify Frontend**
   - Open browser: http://localhost:3000
   - Verify connection to backend
   - Test image upload functionality

#### 3. Post-Installation Verification

1. **System Check**
   ```bash
   # Check running services
   curl http://localhost:4000/api/status
   curl http://localhost:3000
   ```

2. **Database Check**
   ```bash
   # Connect to MongoDB
   mongosh
   use plant_disease_db
   db.status_checks.find().limit(1)
   ```

3. **Log Check**
   ```bash
   # Check backend logs
   tail -f logs/app.log
   ```

### Troubleshooting Guide

#### Common Issues and Solutions

| Issue | Possible Cause | Solution |
|-------|---------------|----------|
| Backend won't start | Port in use | `netstat -ano \| findstr :4000` to find process, then change port |
| MongoDB connection fails | Service not running | Restart service: `net stop MongoDB && net start MongoDB` |
| Frontend build fails | Node modules corruption | Clear and reinstall: `rm -rf node_modules && yarn install` |
| Image upload fails | File size/format | Check console for specific error and verify file constraints |

#### Backend Troubleshooting

1. **MongoDB Issues**
   ```bash
   # Check MongoDB Status
   # Windows
   sc query MongoDB
   
   # Linux
   systemctl status mongod
   
   # Verify Database Connection
   mongosh --eval "db.runCommand({ connectionStatus: 1 })"
   ```

2. **Python Environment Issues**
   ```bash
   # Reset Virtual Environment
   deactivate
   rm -rf venv
   python -m venv venv
   source venv/bin/activate  # or .\venv\Scripts\activate on Windows
   pip install -r requirements.txt
   ```

3. **API Issues**
   ```bash
   # Check API Status
   curl http://localhost:4000/api/status
   
   # Check Logs
   tail -f logs/app.log
   
   # Verify CORS
   curl -H "Origin: http://localhost:3000" \
        -H "Access-Control-Request-Method: POST" \
        -X OPTIONS \
        http://localhost:4000/api/status
   ```

#### Frontend Troubleshooting

1. **Build Issues**
   ```bash
   # Clear Build Cache
   rm -rf build
   rm -rf .cache
   yarn cache clean
   yarn install --force
   ```

2. **Runtime Issues**
   ```bash
   # Check Node Version
   node --version
   
   # Clear Browser Cache
   # Chrome: chrome://settings/clearBrowserData
   # Firefox: about:preferences#privacy
   ```

3. **Network Issues**
   ```bash
   # Test Backend Connection
   curl -I http://localhost:4000/api
   
   # Check Frontend Dev Server
   netstat -ano | findstr :3000
   ```

#### Performance Optimization

1. **Backend Performance**
   ```bash
   # Monitor CPU/Memory
   top -p $(pgrep -f "uvicorn")
   
   # Check Response Times
   curl -w "\nTotal: %{time_total}s\n" http://localhost:4000/api/status
   ```

2. **Frontend Performance**
   ```bash
   # Analyze Bundle Size
   yarn analyze
   
   # Check for Memory Leaks
   # Chrome DevTools > Memory > Record Allocation Timeline
   ```

3. **Database Performance**
   ```bash
   # Monitor Queries
   mongosh --eval "db.setProfilingLevel(2)"
   
   # Check Indexes
   mongosh --eval "db.status_checks.getIndexes()"
   ```

## � System Requirements

### Minimum Requirements
- **CPU**: Dual-core processor, 2.0 GHz or higher
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 1GB free space
- **OS**: 
  - Windows 10/11
  - Ubuntu 20.04 or newer
  - macOS 11 or newer
- **Browser**: 
  - Chrome 90+
  - Firefox 90+
  - Safari 14+
  - Edge 90+

### Recommended Specifications
- **CPU**: Quad-core processor, 3.0 GHz or higher
- **RAM**: 16GB
- **Storage**: 5GB free space
- **Network**: 10Mbps+ stable internet connection

## 🌐 Production Deployment

### Backend Deployment
1. **Server Setup**
   - Use Ubuntu 22.04 LTS
   - Install Python 3.11+
   - Setup MongoDB
   - Configure Nginx as reverse proxy

2. **Application Deployment**
   ```bash
   # Install production dependencies
   sudo apt-get update
   sudo apt-get install python3-venv nginx

   # Setup application
   git clone https://github.com/rajesh580/plant-disease-detection.git
   cd plant-disease-detection/backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Setup Systemd Service**
   ```ini
   # /etc/systemd/system/plantdetection.service
   [Unit]
   Description=Plant Disease Detection Backend
   After=network.target

   [Service]
   User=ubuntu
   WorkingDirectory=/path/to/backend
   Environment="PATH=/path/to/venv/bin"
   ExecStart=/path/to/venv/bin/uvicorn server:app --host 0.0.0.0 --port 4000

   [Install]
   WantedBy=multi-user.target
   ```

### Frontend Deployment
1. **Build Production Bundle**
   ```bash
   cd frontend
   yarn install
   yarn build
   ```

2. **Nginx Configuration**
   ```nginx
   # /etc/nginx/sites-available/plantdetection
   server {
       listen 80;
       server_name yourdomain.com;

       # Frontend
       location / {
           root /path/to/frontend/build;
           try_files $uri $uri/ /index.html;
       }

       # Backend API
       location /api {
           proxy_pass http://localhost:4000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **SSL Setup**
   ```bash
   # Install Certbot
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

## �📊 API Usage & Limits

### Rate Limits
- ⏱️ **Requests**: 2 per minute (free tier)
- 📁 **File Size**: Maximum 10MB
- 🖼️ **Formats**: JPG, PNG
- 📝 **Response Time**: ~2-3 seconds

### Endpoints
- `POST /api/analyze-upload` - Upload and analyze images
- `GET /api/status` - System health check
- `POST /api/status` - Create status records
- `GET /api/analyses` - Retrieve analysis history

## 💡 Usage Guide

1. **Access Application**
   - Open http://localhost:3001 in your browser
   - Ensure backend is running on port 4000

2. **Image Analysis**
   - Upload image or use camera
   - Wait for AI processing (~3s)
   - View detailed analysis results

3. **Results Include**
   - Disease identification
   - Confidence percentage
   - Severity assessment
   - Treatment recommendations
   - Preventive measures

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open a pull request

## 📝 License

This project is MIT licensed - see [LICENSE](LICENSE) file for details.

## 📧 Contact

Rajesh - [@rajesh580](https://github.com/rajesh580)

Project Link: [https://github.com/rajesh580/plant-disease-detection](https://github.com/rajesh580/plant-disease-detection)

## 🙏 Acknowledgments

- Google Gemini AI team
- FastAPI community
- React and Tailwind teams
- MongoDB team
