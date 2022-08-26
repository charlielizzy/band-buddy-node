import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();
const connectionString = process.env.DATABASE_URL;

const { Pool } = pkg;

export const pool = new Pool({
  connectionString,
  // "postgres://foewnliapmxibs:832c3b2ba599c3031b9a248bf4ef0a878023ff9c93b8404702d3efc95f92e4d3@ec2-52-30-75-37.eu-west-1.compute.amazonaws.com:5432/d1p48ftpcjaetq",
  ssl: {
    rejectUnauthorized: false,
  },
});

export const getUser = (request, response) => {
  const spotify_id = request.params.id;
  pool.query(
    "SELECT * FROM users WHERE spotify_id = $1",
    [spotify_id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

export const addUser = async (request, response) => {
  const name = request.body.name;
  const email = request.body.email;
  const spotify_id = request.params.id;
  const results = await pool.query(
    "SELECT * FROM users WHERE spotify_id = $1",
    [spotify_id]
  );
  if (results.rows.length === 0) {
    pool.query(
      "INSERT INTO users (name, email, spotify_id) VALUES ($1, $2, $3)",
      [name, email, spotify_id],
      (error, results) => {
        if (error) {
          throw error;
        }
        response.status(200).json(results.rows);
      }
    );
  } else {
    response.status(200).json(results.rows);
  }
};

export const getEvents = (request, response) => {
  const spotify_id = request.params.id;
  pool.query(
    "SELECT * FROM events WHERE spotify_id = $1",
    [spotify_id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

export const addEvent = (request, response) => {
  const event_name = request.body.event_name;
  const date = request.body.date;
  const city = request.body.city;
  const url = request.body.url;
  const spotify_id = request.params.id;
  pool.query(
    "INSERT INTO events (event_name, date, city, url, spotify_id) VALUES ($1, $2, $3, $4, $5)",
    [event_name, date, city, url, spotify_id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

export const removeEvent = (request, response) => {
  const id = request.body.id;

  pool.query("DELETE FROM events WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};
