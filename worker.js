const mysql = require('mysql2');
const amqp = require('amqplib');

// MySQL connection setup
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "random_db"
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// RabbitMQ setup
const RABBITMQ_URL = 'amqp://localhost';
const QUEUE_NAME = 'update_queue';

async function processMessages() {
    try {
      const connection = await amqp.connect(RABBITMQ_URL);
      const channel = await connection.createChannel();
      await channel.assertQueue(QUEUE_NAME, { durable: true });
  
      console.log('Waiting for messages in %s', QUEUE_NAME);
      channel.consume(QUEUE_NAME, (msg) => {
        if (msg !== null) {
          const message = JSON.parse(msg.content.toString());
          const { id, name } = message;
  
          console.log('Processing update:', message);
  
          // Construct the SQL query string
          const query = 'UPDATE random_table SET name = ? WHERE id = ?';
          db.query(query, [name, id], (err, results) => {
            if (err) {
              console.error('Failed to update database:', err);
            } else {
              console.log('Update successful:', results);
            }
          });
  
          // Acknowledge the message
          channel.ack(msg);
        }
      });
    } catch (error) {
      console.error('Error connecting to RabbitMQ:', error);
    }
  }
  

processMessages();
