import pkg from 'pg'
const connectionString = process.env.DATABASE_URL;

const { Pool } = pkg;
export const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const getUser = (request, response) => {
  const spotify_id = request.params.spotify_id;
  console.log("spotify_id", spotify_id);
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

export const getEvents = (request, response) => {
  const spotify_id = request.params.spotify_id;
  console.log("spotify_id", spotify_id);
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