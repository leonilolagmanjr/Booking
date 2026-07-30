const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Chat = require('./models/Chat'); // Import Chat model
const http = require('http'); // Import HTTP module
const { initSocket } = require('./socket'); // Import initSocket from socket.js


dotenv.config();
const app = express();

// Middleware
app.use(cors({
  origin: process.env.WEBSOCKET_ORIGINS,
  credentials: true
}));

app.use(express.json({
  verify: (req, res, buf) => {
    if (req.originalUrl.startsWith('/api/transactions/webhook')) {
      req.rawBody = buf.toString();
    }
  }
}));
// Note: Static serving of /uploads removed as files are now served from Cloudinary

// Routes
const jobRoutes = require('./routes/jobRoutes');
app.use('/api/job', jobRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes); 

const userRoutes = require('./routes/userRoutes');
app.use('/api/user', userRoutes); 

const infoRoutes = require('./routes/infoRoutes'); // Import info routes
app.use('/api/info', infoRoutes); // Use info routes

const chatRoutes = require('./routes/chatRoutes');
app.use('/api/chat', chatRoutes);

// Existing video routes
const videoRoutes = require('./routes/videoRoutes');
app.use('/api/videos', videoRoutes);

// New post routes
const postRoutes = require('./routes/postRoutes');
app.use('/api/posts', postRoutes);

// Forum routes
const forumRoutes = require('./routes/forumRoutes');
app.use('/api/forum', forumRoutes);

// Notification routes
const notificationRoutes = require('./routes/notificationRoutes');
app.use('/api/notifications', notificationRoutes);

// Application chat routes
const applicationChatRoutes = require('./routes/applicationChatRoutes');
app.use('/api/application-chat', applicationChatRoutes);




// DB Connect
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
  })
  .catch(err => console.error('MongoDB Connection Error:', err.message));


// Dummy route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Health check route
app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

// Create HTTP server
const server = http.createServer(app); 

// Initialize socket.io
initSocket(server);

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));

// Automated ping system to keep Render backend awake
const https = require('https');
setInterval(async () => {
  try {
    const url = `${process.env.BACKEND_URL}/health`;
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        console.log('Ping sent ✅');
      } else {
        console.error('Ping failed ❌ - Status:', res.statusCode);
      }
    }).on('error', (err) => {
      console.error('Ping failed ❌', err.message);
    });
  } catch (err) {
    console.error('Ping failed ❌', err.message);
  }
}, 5 * 60 * 1000); // every 10 minutes

