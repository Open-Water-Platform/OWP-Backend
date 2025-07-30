import mqtt, { MqttClient as MqttClientType, IClientOptions, QoS } from 'mqtt';
import { 
  handleHardwareUpdate
} from '../controllers/hardware.controller';
import { MqttClient } from '../types';

class MqttService {
  private client: MqttClientType | null = null;
  private expressWs: any = null;

  constructor() {
    this.connect();
  }

  private connect(): void {
    const mqttConfig: IClientOptions = {
      host: process.env.MQTT_HOST || 'localhost',
      port: parseInt(process.env.MQTT_PORT || '1883'),
      protocol: (process.env.MQTT_PROTOCOL as 'mqtt' | 'wss' | 'ws' | 'mqtts' | 'tcp' | 'ssl' | 'wx' | 'wxs') || 'mqtt',
      username: process.env.MQTT_USERNAME || '',
      password: process.env.MQTT_PASSWORD || '',
      clientId: `backend_${Math.random().toString(16).slice(3)}`,
      clean: true,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
    };

    try {
      this.client = mqtt.connect(mqttConfig);
      this.setupEventHandlers();
      console.log('MQTT client connecting...');
    } catch (error) {
      console.error('Failed to create MQTT client:', error);
    }
  }

  private setupEventHandlers(): void {
    if (!this.client) return;

    this.client.on('connect', () => {
      console.log('MQTT client connected');
      this.subscribeToTopics();
    });

    this.client.on('message', (topic: string, message: Buffer) => {
      this.handleMessage(topic, message.toString());
    });

    this.client.on('error', (error) => {
      console.error('MQTT client error:', error);
    });

    this.client.on('close', () => {
      console.log('MQTT client disconnected');
    });

    this.client.on('reconnect', () => {
      console.log('MQTT client reconnecting...');
    });
  }

  private subscribeToTopics(): void {
    if (!this.client) return;

    const topics = [
      'devices/set/+',          // Device data
    ];

    topics.forEach(topic => {
      this.client!.subscribe(topic, { qos: 1 }, (err) => {
        if (err) {
          console.error(`Failed to subscribe to ${topic}:`, err);
        } else {
          console.log(`Subscribed to ${topic}`);
        }
      });
    });
  }

  private handleMessage(topic: string, message: string): void {
    if (!this.client) return;

    console.log(`Received message on topic: ${topic}`);
    
    try {
      // Route messages based on topic pattern
      if (topic.match(/^devices\/set\/.+/)) {
        handleHardwareUpdate(topic, message, this.client as MqttClient, this.expressWs);
      } else {
        console.log(`Unhandled topic: ${topic}`);
      }
    } catch (error) {
      console.error('Error handling MQTT message:', error);
    }
  }

  public setExpressWs(expressWs: any): void {
    this.expressWs = expressWs;
  }

  public getClient(): MqttClient | null {
    return this.client as MqttClient;
  }

  public publish(topic: string, message: string, options?: { qos: number }): void {
    if (this.client) {
      const qos: QoS = (options?.qos || 1) as QoS;
      this.client.publish(topic, message, { qos });
    }
  }

  public disconnect(): void {
    if (this.client) {
      this.client.end();
      this.client = null;
    }
  }
}

// Create singleton instance
const mqttService = new MqttService();

export default mqttService; 