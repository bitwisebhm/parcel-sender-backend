const express = require("express");
const dotenv = require("dotenv");
const routes = require("./routes");
// const bodyParser = require("body-parser");
const { Client } = require("pg");
const cors = require("cors");

const PORT = process.env.PORT || 5000;

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// app.use(bodyParser.json());

// app.use(bodyParser.urlencoded({ extended: true }));

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

global.client = client;

client
  .connect()
  .then(() => {
    console.log("database connected!");

    client.query(
      `CREATE TABLE IF NOT EXISTS users(
        id serial PRIMARY KEY,
        first_name VARCHAR NOT NULL,
        last_name VARCHAR NOT NULL,
        email VARCHAR NOT NULL,
        phone_no VARCHAR NOT NULL,
        password VARCHAR NOT NULL,
        role VARCHAR DEFAULT 'member'
        )`,
      (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log("users table created");

          client.query(
            `CREATE TABLE IF NOT EXISTS parcels(
                id serial PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                pickup_location VARCHAR NOT NULL,
                destination VARCHAR NOT NULL,
                recipient_name VARCHAR NOT NULL,
                recipient_phone_no VARCHAR NOT NULL,
                status VARCHAR DEFAULT 'in transit'
                )`,
            (err, res) => {
              if (err) {
                console.log(err);
              } else {
                console.log("Parcels table created successfully");
              }
            }
          );
        }
      }
    );
  })
  .catch((err) => {
    console.log("error connecting to Database", err);
  });

app.use("/api/v1", routes);

app.all("*", (req, res) => {
  res.send("endpoint does not exist!");
});

//running process on the available port
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});

//for unit testing
module.exports = app;
