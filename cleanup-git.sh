#!/bin/bash

# Lab Inventory System - Git Cleanup Script
# This script removes unnecessary files from git tracking

echo "🧹 Starting Git Cleanup for Lab Inventory System..."
echo "================================================="

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository. Please run this script from the project root."
    exit 1
fi

# Remove large directories and files from git tracking
echo "📁 Removing large directories from git tracking..."

# Frontend node_modules and build files
git rm -r --cached frontend/node_modules/ 2>/dev/null || echo "   - node_modules/ not tracked"
git rm -r --cached frontend/build/ 2>/dev/null || echo "   - build/ not tracked"
git rm -r --cached frontend/dist/ 2>/dev/null || echo "   - dist/ not tracked"

# Backend virtual environment
git rm -r --cached backend/venv/ 2>/dev/null || echo "   - venv/ not tracked"
git rm -r --cached backend/env/ 2>/dev/null || echo "   - env/ not tracked"

# Database files
git rm --cached backend/db.sqlite3 2>/dev/null || echo "   - db.sqlite3 not tracked"
git rm --cached backend/*.sqlite3 2>/dev/null || echo "   - sqlite3 files not tracked"

# Python cache files
echo "🐍 Removing Python cache files..."
find . -name "__pycache__" -type d -exec git rm -r --cached {} + 2>/dev/null || echo "   - __pycache__/ directories not tracked"
find . -name "*.pyc" -exec git rm --cached {} + 2>/dev/null || echo "   - .pyc files not tracked"

# Log files
echo "📄 Removing log files..."
find . -name "*.log" -exec git rm --cached {} + 2>/dev/null || echo "   - .log files not tracked"

# Environment files
echo "🔐 Removing environment files..."
git rm --cached .env 2>/dev/null || echo "   - .env not tracked"
git rm --cached backend/.env 2>/dev/null || echo "   - backend/.env not tracked"
git rm --cached frontend/.env 2>/dev/null || echo "   - frontend/.env not tracked"

# IDE files
echo "💻 Removing IDE files..."
git rm -r --cached .vscode/ 2>/dev/null || echo "   - .vscode/ not tracked"
git rm -r --cached .idea/ 2>/dev/null || echo "   - .idea/ not tracked"

# OS files
echo "🖥️  Removing OS files..."
find . -name ".DS_Store" -exec git rm --cached {} + 2>/dev/null || echo "   - .DS_Store files not tracked"
find . -name "Thumbs.db" -exec git rm --cached {} + 2>/dev/null || echo "   - Thumbs.db files not tracked"

# Check repository size before and after
echo ""
echo "📊 Repository Statistics:"
echo "========================"
echo "📁 Tracked files: $(git ls-files | wc -l)"
echo "📏 Repository size: $(du -sh .git 2>/dev/null | cut -f1 || echo 'Unable to calculate')"

echo ""
echo "✅ Cleanup completed!"
echo ""
echo "🔄 Next steps:"
echo "   1. Review changes: git status"
echo "   2. Commit changes: git add . && git commit -m 'chore: add .gitignore and cleanup tracked files'"
echo "   3. Push changes: git push"
echo ""
echo "💡 Note: This cleanup will significantly reduce your repository size."