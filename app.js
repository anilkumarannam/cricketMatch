//===================================================================//

const {
  getConnection,
  database,
  server,
  state,
  district,
  stateStats,
  stateName,
} = require("./server.js");

let databaseConnection = null;

//===================================================================//

server.get("/states/", async (request, response) => {
  const movies = await databaseConnection.all("SELECT * FROM state");
  const movieArray = [];
  for (let movie of movies) {
    console.log(movie);
    movieArray.push(state(movie));
  }
  response.send(movieArray);
});

//===================================================================//

server.get("/states/:stateId/", async (request, response) => {
  const { stateId } = request.params;
  const query = `SELECT * FROM state WHERE state_id = ${stateId};`;
  const m = await databaseConnection.get(query);
  response.send(state(m));
});

//===================================================================//

server.post("/districts/", async (request, response) => {
  const movie = request.body;
  const { districtName, stateId, cases, cured, active, deaths } = movie;
  const query = `INSERT INTO district(district_name, state_id, cases, cured, active, deaths) VALUES("${districtName}", ${stateId}, ${cases}, ${cured}, ${active}, ${deaths})`;
  const dbResponse = await databaseConnection.run(query);
  response.send("District Successfully Added");
});

//===================================================================//

server.get("/districts/:districtId/", async (request, response) => {
  const { districtId } = request.params;
  const query = `SELECT * FROM district WHERE district_id = ${districtId};`;
  const m = await databaseConnection.get(query);
  response.send(district(m));
});

//===================================================================//

server.delete("/districts/:districtId/", async (request, response) => {
  const { districtId } = request.params;
  const query = `DELETE FROM district WHERE district_id = ${districtId};`;
  const m = await databaseConnection.get(query);
  response.send("District Removed");
});

//===================================================================//

server.put("/districts/:districtId/", async (request, response) => {
  const movie = request.body;
  const { districtId } = request.params;
  const { districtName, stateId, cases, cured, active, deaths } = movie;
  const query = `UPDATE district SET district_name = "${districtName}", state_id = ${stateId}, cases = ${cases}, cured = ${cured}, active = ${active}, deaths = ${deaths} WHERE district_id = ${districtId}`;
  const dbResponse = await databaseConnection.run(query);
  response.send("District Details Updated");
});

//===================================================================//

server.get("/states/:stateId/stats/", async (request, response) => {
  const { stateId } = request.params;
  const query = `SELECT sum(cases) AS totalCases, sum(cured) AS totalCured, sum(active) AS totalActive, sum(deaths) AS totalDeaths FROM district WHERE state_id = ${stateId}`;
  const dbResponse = await databaseConnection.get(query);
  response.send(stateStats(dbResponse));
});

//===================================================================//

server.get("/districts/:districtId/details/", async (request, response) => {
  const { districtId } = request.params;
  const query = `SELECT state.state_name as sn FROM district NATURAL JOIN state WHERE district_id = ${districtId}`;
  const dbResponse = await databaseConnection.get(query);
  response.send(stateName(dbResponse));
});

//===================================================================//

const getDatabaseConnection = async () => {
  await getConnection("cricketMatchDeails.db");
  databaseConnection = database.prototype.connection;
};

getDatabaseConnection();

//===================================================================//

module.exports = server;

//===================================================================//
