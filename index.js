const express = require("express");
const mysql = require("mysql2");

const app = express();
app.use(express.json());
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

app.put("/update-records", (req, res) => {
  const newName = req.body.name; // assumptions optverified = false - (the field that we want to set false for all users)
  db.beginTransaction((err) => {
    if (err) {
      console.error("transaction error");
      return res.status(500).json({ error: "transaction error" });
    }

    const query = "UPDATE random_table SET name = ?";
    db.query(query, [newName], (error, results) => {
      if (error) {
        return db.rollback(() => {
          console.error("query error");
          res.status(500).json({ error: "query error" });
        });
      }

      db.commit((err) => {
        if (err) {
          return db.rollback(() => {
            console.error("commit error", err);
            res.status(500).json({ error: "commit error" });
          });
        }

        res.json({ success: true, results });
      });
    });
  });
});

app.listen(port, () => {
  console.log("app is running at port " + port);
});
