const { service } = require('./src/configs/db.config'); // Adjust the path as needed

const dbName = 'owmp'; // Replace with your actual database name
const deviceId = '10001'; // Sample device ID
const numberOfDocuments = 10; // Number of documents to create

// Function to generate a random number within a range
function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

// Function to create a sample document
function createSampleDocument(timestamp) {
  return {
    deviceId: deviceId,
    timestamp: timestamp,
    tds: getRandomNumber(100, 500),
    temperature: getRandomNumber(20, 30),
    turbidity: getRandomNumber(50, 100),
    ph: getRandomNumber(1, 14),
    do: getRandomNumber(10, 140),
    orp: getRandomNumber(200, 1000),
    summary: {
      Purification: [
        {
          inputWaterQuality: getRandomNumber(200, 400),
          outputWaterQuality: getRandomNumber(50, 200),
          efficiency: getRandomNumber(70, 95)
        }
      ]
    }
  };
}

// Function to add a single document to the database
async function addDocument(doc) {
  try {
    const response = await service.postDocument({
      db: dbName,
      document: doc
    });
    console.log(`Document added with ID: ${response.result.id}`);
  } catch (error) {
    console.error('Error adding document:', error);
  }
}

// Main function to populate the database
async function populateDatabase() {
  console.log(`Starting to populate database: ${dbName}`);

  const currentTime = Date.now();
  const oneHourInMs = 3600000; // 1 hour in milliseconds

  for (let i = 0; i < numberOfDocuments; i++) {
    const timestamp = currentTime - (i * oneHourInMs); // Create documents with timestamps 1 hour apart
    const doc = createSampleDocument(timestamp);
    await addDocument(doc);
  }

  console.log('Database population complete.');
}

// Run the population script
populateDatabase().catch(console.error);