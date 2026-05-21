# 🚀 2-Tier Web App on AWS EC2 — Full Deployment Guide

> **Stack:** Node.js + Express (Backend) · HTML/CSS/JS (Frontend) · AWS EC2 `us-east-1` · Port 3000

---

## 📁 Project Structure

```
myapp/
├── backend/
│   ├── server.js        ← Node.js + Express API server
│   └── package.json     ← Dependencies config
└── frontend/
    └── index.html       ← Stylish frontend UI
```

---

## ✅ Prerequisites

- AWS Account
- A Linux terminal (local machine)
- Your EC2 `.pem` key file downloaded

---

## 🖥️ STEP 1 — Launch EC2 Instance (AWS Console)

1. Go to **AWS Console → EC2 → Launch Instance** (region: `us-east-1`)
2. Choose **Amazon Linux 2023** (Free tier eligible)
3. Instance type: **t2.micro**
4. Key pair: **Create new** → download the `.pem` file (e.g. `mykey.pem`)
5. Under **Security Group**, add these Inbound Rules:

| Type       | Protocol | Port | Source    |
|------------|----------|------|-----------|
| SSH        | TCP      | 22   | My IP     |
| Custom TCP | TCP      | 3000 | 0.0.0.0/0 |

6. Click **Launch Instance**

---

## 🔐 STEP 2 — SSH Into EC2 (From Your Local Linux Terminal)

```bash
# Fix key file permissions (required)
chmod 400 mykey.pem

# Connect to EC2 (replace with your EC2 Public IP)
ssh -i mykey.pem ec2-user@YOUR_EC2_PUBLIC_IP
```

> After login, you land at: `/home/ec2-user/`

---

## 📦 STEP 3 — Install Node.js on EC2

Run these commands inside the EC2 terminal:

```bash
# Update system packages
sudo dnf update -y

# Add Node.js 20 repo and install
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs

# Verify installation
node -v
npm -v
```

---

## 📂 STEP 4 — Create Project Files

### 4a. Create folder structure

```bash
mkdir -p ~/myapp/backend ~/myapp/frontend
```

### 4b. Create `package.json`

```bash
nano ~/myapp/backend/package.json
```

Paste this content:

```json
{
  "name": "myapp-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": { "start": "node server.js" },
  "dependencies": { "express": "^4.18.2", "cors": "^2.8.5" }
}
```

Save: `Ctrl+X` → `Y` → `Enter`

---

### 4c. Create `server.js`

Use the `cat` command to avoid paste issues:

```bash
cat > ~/myapp/backend/server.js << 'ENDOFFILE'
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    message: 'Backend is running!',
    timestamp: new Date().toISOString(),
    server: 'AWS EC2 us-east-1'
  });
});

app.get('/api/greet/:name', (req, res) => {
  const name = req.params.name;
  res.json({
    greeting: 'Hello, ' + name + '! Hi there!',
    from: 'Node.js Backend on EC2'
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, '0.0.0.0', () => console.log('Server running at http://0.0.0.0:' + PORT));
ENDOFFILE
```

> ⚠️ Always use the `cat` command above for `server.js` — never paste it via nano/vim to avoid backtick issues.

---

### 4d. Create `index.html`

```bash
nano ~/myapp/frontend/index.html
```

Paste the full HTML code (from the chat), then save: `Ctrl+X` → `Y` → `Enter`

---

## ▶️ STEP 5 — Install Dependencies & Run

```bash
cd ~/myapp/backend

# Install Node packages
npm install

# Test run
node server.js
```

You should see:
```
Server running at http://0.0.0.0:3000
```

Press `Ctrl+C` to stop before moving to Step 6.

---

## ♾️ STEP 6 — Keep App Running 24/7 with PM2

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start your app
cd ~/myapp/backend
pm2 start server.js --name myapp

# Enable auto-start on system reboot
pm2 startup
pm2 save
```

---

## 🌐 STEP 7 — Access Your Live App

Open your browser and go to:

```
http://YOUR_EC2_PUBLIC_IP:3000
```

Your app is now **live on AWS EC2!** 🎉

---

## 🛠️ PM2 Cheat Sheet

| Command                  | What it does               |
|--------------------------|----------------------------|
| `pm2 status`             | Check if app is running    |
| `pm2 logs myapp`         | View live logs             |
| `pm2 restart myapp`      | Restart the app            |
| `pm2 stop myapp`         | Stop the app               |
| `pm2 delete myapp`       | Remove from PM2            |

---

## 🔗 API Endpoints

| Method | Endpoint           | Description              |
|--------|--------------------|--------------------------|
| GET    | `/api/status`      | Returns server status    |
| GET    | `/api/greet/:name` | Returns greeting message |
| GET    | `/`                | Serves the frontend UI   |

---

## 🗂️ File Summary

| File                         | Purpose                          |
|------------------------------|----------------------------------|
| `backend/package.json`       | Node.js dependencies config      |
| `backend/server.js`          | Express API + static file server |
| `frontend/index.html`        | Frontend UI (served by backend)  |

---

## 💡 Tips

- Find your **EC2 Public IP** in AWS Console → EC2 → Instances → Public IPv4 address
- If you restart the EC2 instance, the Public IP may change (use Elastic IP to fix it)
- To update your app: edit the files, then run `pm2 restart myapp`
- To check server logs anytime: `pm2 logs myapp`

---

*Built with Node.js · Express · AWS EC2 · us-east-1*
