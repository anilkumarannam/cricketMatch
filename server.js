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

const state = (databaseObject) => {
  return {
    stateId: databaseObject.state_id,
    stateName: databaseObject.state_name,
    population: databaseObject.population,
  };
};

const district = (databaseObject) => {
  return {
    districtId: databaseObject.district_id,
    districtName: databaseObject.district_name,
    stateId: databaseObject.state_id,
    cases: databaseObject.cases,
    cured: databaseObject.cured,
    active: databaseObject.active,
    deaths: databaseObject.deaths,
  };
};

const stateStats = (databaseObject) => {
  return {
    totalCases: databaseObject.totalCases,
    totalCured: databaseObject.totalCured,
    totalActive: databaseObject.totalActive,
    totalDeaths: databaseObject.totalDeaths,
  };
};

const stateName = (databaseObject) => {
  return {
    stateName: databaseObject.sn,
  };
};

//==================================================================//

exports.getConnection = getConnection;
exports.database = Database;
exports.server = server;
exports.state = state;
exports.district = district;
exports.stateStats = stateStats;
exports.stateName = stateName;

//==================================================================//
