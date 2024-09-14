const express = require("express");
const mysql = require("mysql2");
const amqp = require('amqplib');

const app = express();
app.use(express.json());
const port = 9000;

const RABBITMQ_URL = 'amqp://localhost';
const QUEUE_NAME = 'update_queue';

// Function to send a message to RabbitMQ
async function sendToQueue(message) {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)));
    console.log('Message sent to RabbitMQ:', message);
    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('Failed to send message to RabbitMQ:', error);
  }
}

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "random_db",
});

db.connect((err) => {
  if (err) {
    console.error("database connection", err);
    return;
  }

  console.log("database connection is success");
});

app.get("/records", (req, res) => {
  const limit = parseInt(req.query.limit) || 100;
  const offset = parseInt(req.query.offset) || 0;

  const query = "SELECT * from random_table LIMIT ? OFFSET ?";

  db.query(query, [limit, offset], (error, results) => {
    if (error) {
      console.error("Query Error", error);
      return res.status(500).json({ error: "Error Occurred" });
    }

    res.json(results);
  });
});

app.put("/update-records", async (req, res) => {
  const updateData = req.body;

  try {
    await sendToQueue(updateData);
    res.status(202).send({ status: 'Update request received and queued.' });
  } catch (error) {
    res.status(500).send({ error: 'Failed to queue update request.' });
  }

});

app.listen(port, () => {
  console.log("app is running at port " + port);
});
