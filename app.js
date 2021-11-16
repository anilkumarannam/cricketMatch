//===================================================================//

const {
  getConnection,
  database,
  server,
  player,
  match,
  playerDetails,
} = require("./server.js");

let databaseConnection = null;

//===================================================================//

server.get("/players/", async (request, response) => {
  const movies = await databaseConnection.all("SELECT * FROM player_details");
  const movieArray = [];
  for (let movie of movies) {
    movieArray.push(player(movie));
  }
  response.send(movieArray);
});

//===================================================================//

server.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const query = `SELECT * FROM player_details WHERE player_id = ${playerId};`;
  const m = await databaseConnection.get(query);
  response.send(player(m));
});

//===================================================================//

server.get("/players/:playerId/matches/", async (request, response) => {
  const { playerId } = request.params;
  const query = `SELECT match_details.match_id, match_details.match, match_details.year FROM player_match_score JOIN match_details ON player_match_score.match_id = match_details.match_id WHERE player_id = ${playerId};`;
  const m = await databaseConnection.all(query);
  response.send(m.map((mtch) => match(mtch)));
});

//===================================================================//

server.get("/players/:playerId/matches/", async (request, response) => {
  const { playerId } = request.params;
  const query = `SELECT match_details.match_id, match_details.match, match_details.year FROM player_match_score JOIN match_details ON player_match_score.match_id = match_details.match_id WHERE player_id = ${playerId};`;
  const m = await databaseConnection.all(query);
  response.send(m.map((mtch) => match(mtch)));
});

//===================================================================//

server.get("/matches/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const query = `SELECT * FROM match_details WHERE match_id = ${playerId};`;
  const m = await databaseConnection.get(query);
  response.send(match(m));
});

//===================================================================//

server.get("/matches/:playerId/players/", async (request, response) => {
  const { playerId } = request.params;
  const query = `SELECT player_id, player_name FROM player_match_score NATURAL JOIN player_details WHERE match_id = ${playerId};`;
  const m = await databaseConnection.all(query);
  response.send(m.map((a) => player(a)));
});

//===================================================================//

server.get("/players/:playerId/playerScores/", async (request, response) => {
  const { playerId } = request.params;
  const query = `SELECT player_id, player_name, sum(score) AS ts, sum(fours) AS tf, sum(sixes) AS tx FROM player_match_score NATURAL JOIN player_details WHERE player_id = ${playerId};`;
  const m = await databaseConnection.get(query);
  response.send(playerDetails(m));
});

//===================================================================//

server.put("/players/:playerId/", async (request, response) => {
  const movie = request.body;
  const { playerId } = request.params;
  const { playerName } = movie;
  const query = `UPDATE player_details SET player_name = "${playerName}" WHERE player_id = ${playerId}`;
  const dbResponse = await databaseConnection.run(query);
  response.send("Player Details Updated");
});

//===================================================================//

const getDatabaseConnection = async () => {
  await getConnection("cricketMatchDetails.db");
  databaseConnection = database.prototype.connection;
};

getDatabaseConnection();

//===================================================================//

module.exports = server;

//===================================================================//
