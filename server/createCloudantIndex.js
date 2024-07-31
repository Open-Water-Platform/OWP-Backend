const { service } = require('./src/configs/db.config'); 

const dbName = 'owmp'; 

async function createIndex() {
  try {
    const indexDefinition = {
      fields: ['timestamp']
    };

    const result = await service.postIndex({
      db: dbName,
      index: indexDefinition,
      name: 'timestamp-index',
      type: 'json'
    });

    console.log('Index created successfully:', result);
  } catch (error) {
    console.error('Error creating index:', error);
  }
}

createIndex().catch(console.error);