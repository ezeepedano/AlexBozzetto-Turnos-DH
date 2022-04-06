const fs = require("fs");
const { format } = require("path");
const { runInNewContext } = require("vm");
const getTurnos = require("../utils/getTurnos");
const toThousand = require("../utils/toThousand");

const getTurnoSectorName = (sector) => {
    switch (sector) {
        case "1":
            return `Extracciones`;
            break;

        case "2":
            return `Depositos`;
            break;

        case "3":
            return `Moneda Extrnajera`;
            break;

        case "4":
            return `Atencion al cliente`;
            break;

        case "5":
            return `Tarjetas`;
            break;

        case "6":
            return `Inversiones`;
            break;

        default:
            break;
    }
};

const turnosController = {
    index: (req, res) => {
        const database = getTurnos();
        res.render("turnos-list", { turnos: database });
    },
    detail: (req, res) => {
        const loggedUser = res.locals.user;
        const database = getTurnos();
        const selectedTurno = database.find((turno) => {
            return req.params.id == turno.id;
        });
        console.log(loggedUser);

        selectedTurno.sector = getTurnoSectorName(selectedTurno.sector);

        res.render("turno-detail", {
            turno: selectedTurno,
            loggedUser: loggedUser,
            toThousand: toThousand,
        });
    },
    showCreate: (req, res) => {
        res.render("turno-create");
    },
    create: (req, res) => {
        //1. Lee lo que ya hay en la db y lo descomprime en un array
        const database = getTurnos();

        //2. Itera el JSON para agregar un nuevo ID a cada turno. Agrega los datos que recibe del formulario a newturno.

        const createId = () => {
            let id;

            const formatId = () => {
                const baseId = (database.length + 1)
                    .toString()
                    .padStart(2, "0");
                return baseId;
            };

            //console.log(formatId());

            switch (req.body.sector) {
                case "1":
                    id = `E${formatId()}`;
                    break;

                case "2":
                    id = `D${formatId()}`;
                    break;

                case "3":
                    id = `M${formatId()}`;
                    break;

                case "4":
                    id = `A${formatId()}`;
                    break;

                case "5":
                    id = `T${formatId()}`;
                    break;

                case "6":
                    id = `I${formatId()}`;
                    break;

                default:
                    break;
            }

            return id;
        };

        const newTurno = {
            id: createId(),
            name: req.body.name,
            dni: req.body.dni,
            email: req.body.email,
            sector: req.body.sector,
        };

        console.log(newTurno);

        //3. Agrega newturno al final del array database
        database.push(newTurno);

        //4. Vuelve a pasar a string la base de datos para escribir el contenido nuevo.
        const databaseJSON = JSON.stringify(database, null, 4);

        //5. Escribe el nuevo contenido en la base de datos sobrescribiendo lo anterior
        fs.writeFileSync(__dirname + "/../data/turnosDb.json", databaseJSON);

        res.redirect("/turnos/detail/" + newTurno.id);
    },
    store: (req, res) => {
        // Ruta de almacenamiento de turnoos
    },
    showEdit: (req, res) => {
        const database = getTurnos();
        const selectedturno = database.find((turno) => {
            return turno.id == req.params.id;
        });

        if (selectedturno == null) {
            return res.send("Error 404 - turno no encontrado");
        }

        console.log(selectedturno);

        res.render("turno-edit", {
            turno: selectedturno,
            toThousand: toThousand,
        });
    },
    update: (req, res) => {
        //1. Lee lo que ya hay en la db y lo descomprime en un array
        const database = getTurnos();

        //2. Guarda el turnoo requerido por ID en una variable
        const selectedTurno = database.find((turno) => {
            return turno.id == req.params.id;
        });

        //3. Crea un turno editado con las modificaciones realizadas conservando el ID original
        const editedTurno = {
            id: selectedTurno.id,
            name: req.body.name,
            description: req.body.description,
            price: Number(req.body.price),
            discount: Number(req.body.discount),
            image: selectedTurno.image,
            category: selectedTurno.category,
        };

        //4. Inserta el turnoo editado en el indice donde se encontraba el turnoo requerido
        database.splice(database.indexOf(selectedTurno), 1, editedTurno);

        //5. Vuelve a pasar a string la base de datos para escribir el contenido nuevo.
        const databaseJSON = JSON.stringify(database, null, 4);

        //6. Escribe el nuevo contenido en la base de datos sobrescribiendo lo anterior
        fs.writeFileSync(__dirname + "/../data/turnosDb.json", databaseJSON);

        res.redirect("/turnos/detail/" + editedTurno.id);
    },
    showDelete: (req, res) => {
        const database = getTurnos();
        const selectedTurno = database.find((turno) => {
            return turno.id == req.params.id;
        });

        if (selectedTurno == null) {
            return res.send("Error 404 - turno no encontrado");
        }

        res.render("turno-delete", {
            turno: selectedTurno,
        });
    },
    delete: (req, res) => {
        const database = getTurnos();

        const selectedTurno = database.find((turno) => {
            return turno.id.toString().split(" ").join("") == req.params.id.toString().split(" ").join("")
        });

        database.splice(database.indexOf(selectedTurno), 1);

        const databaseJSON = JSON.stringify(database, null, 4);

        fs.writeFileSync(__dirname + "/../data/turnosDB.json", databaseJSON);

        res.redirect("/");
    },
};

module.exports = turnosController;
