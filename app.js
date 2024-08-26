const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "moviesData.db");
let db = null;

const initializeDbToServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("server running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`Db Error :${e.message}`);
    process.exit(1);
  }
};
initializeDbToServer();

app.get("/movies/", async (request, response) => {
  const getDbDetails = `
    SELECT
    *
    FROM
    movie;`;
  const dbResponse = await db.all(getDbDetails);
  response.send(dbResponse);
});

//post

app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;

  const getDbQuery = `
    INSERT INTO 
    movie 
    (
        directorId,
        movieName,
        leadActor
    )
    VALUES 
    (
        ${directorId},
        '${movieName}',
        '${leadActor}'
    );`;

  const dbResponse = await db.run(getDbQuery);
  const movieId = dbResponse.lastID;
  response.send({ movie_id: movieId });
});
