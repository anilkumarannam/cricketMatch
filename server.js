//==================================================================//

const express = require("express");
const server = express();

server.listen(3000, () => {
  console.log("server Running at http://localhost:3000/");
});

server.use(express.json());

//==================================================================//

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

function Database() {}
Database.prototype.connection = null;
const getConnection = async (dbName) => {
  const path = require("path");
  const dbPath = path.join(__dirname, dbName);
  try {
    Database.prototype.connection = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    console.log("And database initialized...");
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

//==================================================================//

const player = (databaseObject) => {
  return {
    playerId: databaseObject.player_id,
    playerName: databaseObject.player_name,
  };
};

const match = (databaseObject) => {
  return {
    matchId: databaseObject.match_id,
    match: databaseObject.match,
    year: databaseObject.year,
  };
};

const playerDetails = (databaseObject) => {
  return {
    playerId: databaseObject.player_id,
    playerName: databaseObject.player_name,
    totalScore: databaseObject.ts,
    totalFours: databaseObject.tf,
    totalSixes: databaseObject.tx,
  };
};

//==================================================================//

exports.getConnection = getConnection;
exports.database = Database;
exports.server = server;
exports.player = player;
exports.match = match;
exports.playerDetails = playerDetails;

//==================================================================//
