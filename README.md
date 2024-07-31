<h1 align="center">OWMP Backend</h1>

## Description
...

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Contributing](#contributing)
- [License](#license)

### Prerequisites

- Node.js: Make sure you have Node.js installed on your machine. You can download it from [https://nodejs.org/](https://nodejs.org/).

- **Docker:** Ensure that you have Docker installed on your machine. You can download and install Docker from [https://www.docker.com/get-started](https://www.docker.com/get-started).


### Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-project.git
    ```

2. **Navigate to the project directory:**
    ```bash
    cd your-project
    ```

3. **Create a `.env` file:**
    - Update Following env vars in docker-compose.yml in root folder:
      ```dotenv
        PORT=4000
        MQTT_HOST=
        MQTT_PORT=
        MQTT_PROTOCOL=
        MQTT_USERNAME=
        MQTT_PASSWORD=
        API_KEY_SECRET=
        DYNAMODB_TABLE_REGULAR =
        DYNAMODB_TABLE_FAULTY_DEVICES=
        AWS_ACCESS_KEY=
        AWS_SECRET_KEY=
      ```


4. **Setup docker :**
    ```bash
    docker-compose up -d
    docker exec -it owmp-mqtt-broker mosquitto_passwd -b /mosquitto/config/mosquitto.passwd <username> <password>
    docker-compose restart
    ```

### Contributing

We actively welcome pull requests. Learn how to [contribute](./Workflow/CONTRIBUTING.md) and please abide by the [Code of Conduct](./Workflow/CODE_OF_CONDUCT.md).

### License

OWMP is [Apache License 2.0](./LICENSE).
