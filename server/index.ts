import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import expressWs from 'express-ws';

import { deviceRoute } from './src/routes/device.route';
import mqttService from './src/services/mqtt.service';

dotenv.config();

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || '8000', 10);

// Initialize express-ws
const wsInstance = expressWs(app);

app.set('view engine', 'ejs');
app.use(
  cors({
    origin: '*',
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set express-ws instance in MQTT service
mqttService.setExpressWs(wsInstance);

app.get('/', (req: Request, res: Response) => {
  res.send('connection success!!');
});

app.use('/api/v1/device', deviceRoute);

// WebSocket endpoint for real-time communication
(app as any).ws('/ws', (ws: any, req: any) => {
  console.log('WebSocket client connected');
  
  ws.on('message', (msg: any) => {
    console.log('Received WebSocket message:', msg);
    // Handle WebSocket messages here
  });
  
  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  mqttService.disconnect();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down gracefully...');
  mqttService.disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
  console.log('MQTT service initialized');
}); 