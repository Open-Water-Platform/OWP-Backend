# Saaf Water Backend

A TypeScript-based Node.js backend for the Saaf Water project with MQTT integration for real-time device communication.

## Overview

This backend provides APIs for device management, data retrieval, and real-time communication with water purification devices through MQTT protocol.

## Features

- Device data management
- Firebase authentication integration
- Cloudant database integration
- TypeScript support with full type safety
- **MQTT integration for real-time device communication**
- **Hardware controller for device data processing**
- **Sensor calibration and data validation**
- **WebSocket support for real-time updates**

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MQTT Broker (Mosquitto recommended)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```
# Server Configuration
PORT=8000

# Database Configuration
CLOUDANT_APIKEY=your_cloudant_api_key
CLOUDANT_URL=your_cloudant_url

# Firebase Configuration
TYPE=your_firebase_type
PROJECT_ID=your_firebase_project_id
PRIVATE_KEY_ID=your_firebase_private_key_id
PRIVATE_KEY=your_firebase_private_key
CLIENT_EMAIL=your_firebase_client_email
CLIENT_ID=your_firebase_client_id
AUTH_URI=your_firebase_auth_uri
TOKEN_URI=your_firebase_token_uri
AUTH_PROVIDER_X509_CERT_URL=your_firebase_auth_provider_cert_url
CLIENT_X509_CERT_URL=your_firebase_client_cert_url

# MQTT Configuration
MQTT_HOST=localhost
MQTT_PORT=1883
MQTT_PROTOCOL=mqtt
MQTT_USERNAME=your_mqtt_username
MQTT_PASSWORD=your_mqtt_password

# Database Table
OWP_DB=owmp
```

## Development

For development with hot reload:
```bash
npm run dev
```

## Building

To compile TypeScript to JavaScript:
```bash
npm run build
```

## Running

To start the production server:
```bash
npm start
```

## API Endpoints

### REST API
- `GET /` - Health check
- `GET /api/v1/device/all/` - Get all devices
- `GET /api/v1/device/` - Get user devices
- `GET /api/v1/device/all/:id` - Get device data by ID

### WebSocket
- `WS /ws` - WebSocket endpoint for real-time communication

## MQTT Integration

### MQTT Topics

The backend subscribes to the following MQTT topics:

#### Device Data Topics
- `devices/data/+/+` - Regular device data

#### Device Meta Topics
- `devices/meta/+` - Regular device meta information

### MQTT Response Topics

The backend publishes responses to:

#### Device Control Topics
- `devices/get/{deviceId}` - Regular device control

#### Device Meta Response Topics
- `devices/meta/response/{deviceId}` - Regular device meta response

## Hardware Controller

The hardware controller processes device data with the following parameters:

### Data Parameters

1. **Chlorine** - Chlorine concentration monitoring
2. **TDS** - Total Dissolved Solids (calculated from conductivity if available)
3. **TSS** - Total Suspended Solids
4. **pH** - pH level with sensor calibration
5. **Turbidity** - Turbidity with sensor calibration
6. **Temperature** - Temperature monitoring

### Data Processing Features

- **Sensor Calibration**: Automatic pH and turbidity sensor calibration
- **Data Validation**: Ensures data quality before storage
- **Real-time Response**: Immediate device control based on readings
- **TDS Calculation**: Converts conductivity to TDS when available

### Calibration System

The system supports device-specific calibration parameters:
- pH sensor calibration (acidic/neutral voltage points)
- Turbidity sensor calibration (slope and offset)
- Device-specific intervals and modes

## Project Structure

```
server/
├── src/
│   ├── configs/          # Configuration files
│   │   ├── db.config.ts  # Cloudant database config
│   │   ├── firebase.config.ts # Firebase config
│   │   └── service-account.ts # Service account config
│   ├── controllers/      # Route controllers
│   │   ├── device.controller.ts # Device API controller
│   │   └── hardware.controller.ts # MQTT hardware controller
│   ├── models/          # Data models
│   │   └── data.model.ts # Database operations
│   ├── routes/          # API routes
│   │   └── device.route.ts # Device API routes
│   ├── services/        # Business logic services
│   │   └── mqtt.service.ts # MQTT service
│   ├── types/           # TypeScript type definitions
│   │   ├── index.ts     # Main type definitions
│   │   └── express-ws.d.ts # Express-WS types
│   └── utils/           # Utility functions
│       ├── utils.ts     # General utilities
│       └── calibrations.ts # Sensor calibration
├── dist/                # Compiled JavaScript (generated)
├── views/               # EJS templates
├── index.ts            # Main application entry point
├── tsconfig.json       # TypeScript configuration
└── package.json        # Dependencies and scripts
```

## TypeScript Features

- Full type safety for all API endpoints
- Interface definitions for data models
- Type-safe database operations
- Proper error handling with typed responses
- **MQTT message type safety**
- **Hardware controller type definitions**

## MQTT Message Flow

1. **Device sends data** → MQTT topic (e.g., `devices/data/10001/reading`)
2. **Backend receives** → Hardware controller processes data
3. **Data validation** → Sensor calibration and quality checks
4. **Database storage** → Store processed data in single OWP database
5. **Device response** → Send control commands back to device

## Error Handling

- MQTT connection retry logic
- Graceful shutdown handling
- Data validation and error logging
- Device-specific error responses

## Monitoring and Logging

- Real-time device data logging
- MQTT connection status monitoring
- Error tracking and reporting
- Performance metrics

## Security

- MQTT authentication
- Firebase security rules
- Environment variable protection
- Input validation and sanitization
