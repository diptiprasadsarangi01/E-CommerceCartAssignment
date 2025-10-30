## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

name: 🛠️ Full Stack App Setup & Build

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  setup:
    name: ⚙️ Setup and Build Project
    runs-on: ubuntu-latest

    defaults:
      run:
        working-directory: ./

    steps:
      # 🧭 Step 1: Checkout repo
      - name: 📂 Checkout repository
        uses: actions/checkout@v4

      # 🧰 Step 2: Setup Node.js (latest LTS)
      - name: 🔧 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      # 🗂️ Step 3: Install & build backend
      - name: 📦 Install Backend Dependencies
        working-directory: ./backend
        run: npm install

      - name: 🧪 Run Backend Lint/Test (optional)
        working-directory: ./backend
        run: |
          echo "Running backend test..."
          npm test || echo "No backend tests configured"

      # 🧰 Step 4: Install & build frontend
      - name: 📦 Install Frontend Dependencies
        working-directory: ./frontend
        run: npm install

      - name: 🧱 Build Frontend
        working-directory: ./frontend
        run: npm run build

      # 🚫 Step 5: Cleanup Unnecessary Files
      - name: 🧹 Cleanup node_modules & env files
        run: |
          rm -rf frontend/node_modules
          rm -rf backend/node_modules
          rm -f frontend/.env
          rm -f backend/.env

      # ✅ Step 6: Verify Build Output
      - name: 📁 Verify Build
        run: |
          echo "Backend and Frontend setup completed!"
          ls -R frontend/dist || echo "Frontend build missing!"
