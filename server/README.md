<h1 align="center">Saafwater Backend</h1>

## Installation

**Install :**
```bash
npm install 
```

**Start server :**

```bash
npm start
```
**Using Docker**

Build container: 

```bash
sudo docker build . -t saafwater/backend
```
Run container:
```bash
sudo docker run --name saafwater-backend --restart always -p 8080:4000 -p 80:4000 -d saafwater/backend
```


### Environment Variables

The following environment variables can be used to configure the application:

 - `PORT` - port number for sever
 - `CLOUDANT_APIKEY` - cloudant api key
 - `CLOUDANT_URL` - cloudant database URL
 - `MQTT_HOST` - MQTT Broker server IP/URL
 - `MQTT_PORT` - MQTT Broker server PORT number
 - `MQTT_PROTOCOL` - MQTT Protocol type
 - `MQTT_USERNAME` - MQTT Server username
 - `MQTT_PASSWORD` - MQTT Server passowrd
