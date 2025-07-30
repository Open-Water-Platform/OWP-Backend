import { Request, Response } from 'express';

// Device related types
export interface Device {
  docId: string;
  device_enabled?: boolean;
  type?: string;
  userId?: string[];
  [key: string]: any;
}

export interface DeviceData {
  deviceId: string;
  timestamp: number;
  tds: number;
  summary: {
    Purification: any[];
  };
  salinity: number;
  ec: number;
  resistivity: number;
  date: string;
  time: string;
  history: DeviceData[];
  [key: string]: any;
}

// Simplified MQTT and Hardware Controller types
export interface Data {
  deviceId?: string;
  deviceid?: string | number;
  timestamp?: number;
  chlorine?: number;
  tds?: number;
  tss?: number;
  conductivity?: number;
  temperature?: number;
  [key: string]: string | number | undefined;
}

export interface ProcessedData {
  deviceid: number;
  timestamp: number;
  chlorine: number;
  tds: number;
  tss: number;
  temperature: number;
}

export interface GeneralData {
  deviceid: number;
  timestamp: number;
  chlorine: number;
  tds: number;
  tss: number;
  temperature: number;
  conductivity?: number;
}

// Request types
export interface AuthenticatedRequest extends Request {
  userRecord?: {
    uid: string;
    customClaims?: {
      admin?: boolean;
    };
  };
}

// Response types
export interface ApiResponse<T = any> {
  message?: string;
  data?: T;
  error?: any;
}

// Database types
export interface CloudantResponse {
  result: {
    docs: any[];
  };
}

// Firebase types
export interface FirebaseUser {
  uid: string;
  customClaims?: {
    admin?: boolean;
  };
}

// MQTT Client type
export interface MqttClient {
  publish: (topic: string, message: string, options?: { qos: number }) => void;
  subscribe: (topic: string, options?: { qos: number }) => void;
  on: (event: string, callback: (topic: string, message: Buffer) => void) => void;
} 