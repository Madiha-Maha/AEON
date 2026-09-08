import { Server as SocketIOServer } from 'socket.io';
import { CompositionService } from '../services/composition.service';

export function setupPulseSocket(io: SocketIOServer, compositionService: CompositionService) {
  // Broadcast live parameters every 6 seconds to all connected clients
  const intervalMs = 6000;

  setInterval(async () => {
    try {
      const params = await compositionService.getNormalizedParameters();
      io.emit('pulse:update', params);
    } catch (err) {
      console.error('Failed to emit pulse:update:', err);
    }
  }, intervalMs);

  io.on('connection', async (socket) => {
    // Send immediate state on connect
    const initialParams = await compositionService.getNormalizedParameters();
    socket.emit('pulse:update', initialParams);

    // Resonance room blending events
    socket.on('room:join', (roomId: string) => {
      socket.join(`room:${roomId}`);
    });

    socket.on('room:leave', (roomId: string) => {
      socket.leave(`room:${roomId}`);
    });

    socket.on('room:frequency-update', (data: { roomId: string; note: string; location: string }) => {
      socket.to(`room:${data.roomId}`).emit('room:peer-frequency', data);
    });
  });
}
