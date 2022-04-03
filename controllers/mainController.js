const getTurnos = require("../utils/getTurnos");

const mainController = {
    main: (req, res) => {
        const turnos = getTurnos();
        res.render("index", {
            turnos: turnos,
        });
    },
    search: (req, res) => {
        const database = getTurnos();
        let keyword = req.query.busqueda;
        let results = [];

        for (let i = 0; i < database.length; i++) {
            if (
                database[i].name.toLowerCase().includes(keyword.toLowerCase())
            ) {
                results.push(database[i]);
            }
        }

        res.render("turno-search", {
            results: results,
            keyword: keyword,
        });
    },
};

module.exports = mainController;
