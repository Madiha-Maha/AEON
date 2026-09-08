import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server as SocketIOServer } from 'socket.io';
import { CompositionService } from './services/composition.service';
import { setupPulseSocket } from './sockets/pulse.socket';

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 4000;
const allowedOrigins = (process.env.CORS_ORIGIN || 'https://aeon.vercel.app,http://localhost:3000').split(',');

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some(o => origin.startsWith(o.trim()))) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive in preview / development
    }
  },
  credentials: true,
}));

app.use(express.json());

// Mandatory Healthcheck for Railway deploy
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Current world parameters REST endpoint
const compositionService = new CompositionService();
app.get('/api/parameters', async (req, res) => {
  try {
    const params = await compositionService.getNormalizedParameters();
    res.json(params);
  } catch {
    res.status(500).json({ error: 'Failed to compute parameters' });
  }
});

// Socket.io setup for real-time parameter streaming
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

setupPulseSocket(io, compositionService);

server.listen(PORT, () => {
  console.log(`Aeon Planetary API running on port ${PORT}`);
});
