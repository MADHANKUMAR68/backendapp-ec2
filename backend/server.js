const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    message: 'Backend is running!',
    timestamp: new Date().toISOString(),
    server: 'AWS EC2 us-east-1'
  });
});

app.get('/api/greet/:name', (req, res) => {
  const name = req.params.name || 'Stranger';
  res.json({
    greeting: `Hello, ${name}! 👋`,
    from: 'Node.js Backend on EC2'
  });
});

// Catch-all: serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running at http://0.0.0.0:${PORT}`);
});
