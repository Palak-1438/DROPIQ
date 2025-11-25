import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { json } from 'body-parser';
import { authRouter } from './routes/auth';
import { customersRouter } from './routes/customers';
import { mlRouter } from './routes/ml';

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.SOCKET_IO_CORS_ORIGIN || '*', credentials: true }));
app.use(json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'dropiq-server' });
});

app.use('/api/auth', authRouter);
app.use('/api/customers', customersRouter);
app.use('/api/ml', mlRouter);

const port = process.env.PORT || 4000;
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.SOCKET_IO_CORS_ORIGIN || '*',
  },
});

io.on('connection', (socket) => {
  // In a real app, authenticate via JWT
  console.log('Socket connected', socket.id);
});

export const notifyHighRisk = (payload: any) => {
  io.emit('high-risk-customer', payload);
};

server.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
