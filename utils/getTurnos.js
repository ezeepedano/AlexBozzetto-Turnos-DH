const fs = require("fs");
const path = require("path");

const getTurnos = (req, res) => {
    const dbJson = fs.readFileSync(
        path.resolve(__dirname, "../data/turnosDb.json"),
        { encoding: "utf-8" }
    );
    
    
    return JSON.parse(dbJson);
};

module.exports = getTurnos;
