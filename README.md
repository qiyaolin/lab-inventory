# 🧪 Lab Inventory Management System

A modern, professional laboratory inventory management system built with Django REST Framework and React. Features a beautiful, responsive UI with comprehensive inventory tracking, user management, and real-time analytics.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Django](https://img.shields.io/badge/Django-4.2-green.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Node](https://img.shields.io/badge/Node.js-18+-green.svg)

## ✨ Features

### 🎯 Core Functionality
- **📦 Inventory Management**: Add, edit, track laboratory items
- **🏷️ Categorization**: Organize items by categories, locations, and vendors
- **⚠️ Stock Alerts**: Low stock warnings and expiration tracking
- **📊 Analytics Dashboard**: Real-time statistics and insights
- **👥 User Management**: Role-based access control
- **🔍 Advanced Search**: Multi-field search and filtering

### 🎨 Modern UI/UX
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Material Design**: Professional Material-UI components
- **Dark/Light Mode**: User preference support
- **Intuitive Interface**: Modern, clean, and user-friendly
- **Real-time Updates**: Live data synchronization

## 🏗️ Architecture

This project uses a **monorepo** structure with separate frontend and backend applications:

### 🔧 Backend (Django REST API)
- **Framework**: Django 4.2 + Django REST Framework
- **Database**: SQLite (development) / PostgreSQL (production)
- **Authentication**: JWT (JSON Web Tokens) with Djoser
- **Key Features**:
  - RESTful API design
  - Role-based permissions
  - Automatic API documentation
  - Database migrations

### 🎨 Frontend (React SPA)
- **Framework**: React 18 with modern hooks
- **UI Library**: Material-UI (MUI) with custom theming
- **State Management**: React Context + Local State
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios with interceptors

## 📁 Project Structure

```
lab-inventory/
├── 📄 README.md
├── 📄 .gitignore              # Comprehensive ignore rules
├── 📄 PROJECT_STRUCTURE.md    # Detailed structure guide
├── 📄 cleanup-git.sh          # Git cleanup script
├── 📁 backend/                # Django REST API
│   ├── 📄 manage.py
│   ├── 📄 requirements.txt
│   ├── 📁 backend/            # Project configuration
│   ├── 📁 users/              # User management
│   ├── 📁 inventory/          # Inventory management
│   └── 📁 orders/             # Order processing
└── 📁 frontend/               # React application
    ├── 📄 package.json
    ├── 📁 public/             # Static assets
    └── 📁 src/                # Source code
        ├── 📁 components/     # Reusable components
        ├── 📁 pages/          # Page components
        ├── 📁 modules/        # Feature modules
        ├── 📁 services/       # API services
        └── 📁 contexts/       # React contexts
```

## 🚀 Quick Start

### 📋 Prerequisites

- Python 3.8+
- Node.js 18.x+
- Git

### 🛠️ Installation

#### 1. Clone the repository
```bash
git clone https://github.com/qiyaolin/lab-inventory.git
cd lab-inventory
```

#### 2. Backend Setup (Django)
```bash
cd backend

# Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py migrate

# Create demo data (optional)
python manage.py shell -c "
from inventory.models import Category, Location, Vendor
Category.objects.get_or_create(name='Reagents')
Category.objects.get_or_create(name='Equipment')
Location.objects.get_or_create(name='Lab A')
Location.objects.get_or_create(name='Storage Room')
Vendor.objects.get_or_create(name='Sigma-Aldrich')
"

# Create superuser (optional)
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

Backend will be available at `http://localhost:8000`

#### 3. Frontend Setup (React)
```bash
# Open new terminal
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will be available at `http://localhost:3000`

### 🎉 Demo Credentials

For quick testing, you can use these demo credentials:
- **Username**: `admin`
- **Password**: `admin123`

*Note: These are created automatically when you first run the application.*

## 🧹 Repository Cleanup

This repository has been optimized for size and performance. If you're experiencing issues with large file sizes:

```bash
# Run the cleanup script
chmod +x cleanup-git.sh  # Linux/Mac
./cleanup-git.sh

# Or for Windows
cleanup-git.bat
```

This will remove unnecessary files like `node_modules/`, `venv/`, and build artifacts from git tracking.

## 📚 API Documentation

### 🔐 Authentication Endpoints
- `POST /api/auth/jwt/create/` - User login
- `POST /api/auth/users/` - User registration  
- `GET /api/auth/users/me/` - Get current user
- `POST /api/auth/jwt/refresh/` - Refresh JWT token

### 📦 Inventory Endpoints
- `GET /api/inventory/items/` - List all items
- `POST /api/inventory/items/` - Create new item
- `GET /api/inventory/items/{id}/` - Get specific item
- `PUT /api/inventory/items/{id}/` - Update item
- `DELETE /api/inventory/items/{id}/` - Delete item
- `GET /api/inventory/categories/` - List categories
- `GET /api/inventory/locations/` - List locations
- `GET /api/inventory/vendors/` - List vendors

## 🛠️ Tech Stack

### Backend
- **Django 4.2** - Web framework
- **Django REST Framework** - API framework
- **Djoser** - Authentication system
- **SQLite/PostgreSQL** - Database
- **JWT** - Authentication tokens
- **CORS Headers** - Cross-origin support

### Frontend  
- **React 18** - UI framework
- **Material-UI (MUI)** - Component library
- **React Router DOM v6** - Client-side routing
- **Axios** - HTTP client
- **React Context** - State management

## 🔧 Development

### Code Style
- **Backend**: Follow Django/PEP 8 conventions
- **Frontend**: Use modern React patterns with hooks
- **Git**: Conventional commit messages

### Project Structure
- Modular design with feature-based organization
- Separation of concerns between UI and business logic
- RESTful API design principles

## 🚀 Deployment

### Development
```bash
# Backend
cd backend && python manage.py runserver

# Frontend  
cd frontend && npm start
```

### Production
- Configure environment variables
- Use production database (PostgreSQL)
- Serve static files with nginx
- Use HTTPS for security

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Create an issue for bug reports
- 💡 Feature requests are welcome
- 📖 Check the documentation for common issues

## 🎯 Roadmap

- [ ] Advanced reporting and analytics
- [ ] Barcode scanning integration
- [ ] Mobile app development
- [ ] Multi-language support
- [ ] Docker containerization
- [ ] Automated testing suite 