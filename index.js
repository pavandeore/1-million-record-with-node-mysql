const express = require("express");
const mysql = require("mysql2");

const app = express();
const port = 9000;

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

app.listen(port, () => {
  console.log("app is running at port " + port);
});
