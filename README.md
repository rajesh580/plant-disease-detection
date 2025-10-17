# 🌿 Plant Disease Detection System

An AI-powered full-stack application for detecting and analyzing plant diseases using Google's Gemini AI technology.

![Plant Disease Detection](https://img.shields.io/badge/AI-Plant%20Disease%20Detection-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

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

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- Python 3.11+
- MongoDB 6.0+
- Google Cloud API Key

### Backend Setup
1. Clone and navigate:
```bash
git clone https://github.com/rajesh580/plant-disease-detection.git
cd plant-disease-detection/backend
```

2. Set up Python environment:
```bash
python -m venv .venv
.\.venv\Scripts\activate  # Windows
source .venv/bin/activate # Linux/Mac
pip install -r requirements.txt
```

3. Configure environment:
```bash
# Create .env file with:
MONGO_URL="mongodb://localhost:27017"
DB_NAME="plant_disease_db"
CORS_ORIGINS="*"
GOOGLE_API_KEY="your-api-key"
```

4. Start server:
```bash
uvicorn server:app --reload --port 4000
```

### Frontend Setup
1. Navigate and install:
```bash
cd ../frontend
yarn install
```

2. Configure:
```bash
# Create .env file with:
REACT_APP_BACKEND_URL=http://localhost:4000
```

3. Start development:
```bash
yarn start
```

## 📊 API Usage & Limits

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
