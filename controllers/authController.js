const getUsers = require("../utils/getUsers");
const saveUsers = require("../utils/saveUsers");
const bcrypt = require("bcrypt");

module.exports = {
    login: (req, res) => {
        const users = getUsers();
        const user = users.find((user) => {
            return (
                user.user == req.body.user &&
                bcrypt.compareSync(req.body.pass, user.pass)
            );
        });

        if (!user) return res.redirect("/admin/login");

        req.session.loggedUserId = user.id;

        return res.redirect("/admin/turnos");
    },
    register: (req, res) => {
        const users = getUsers();

        const lastUserIndex = users.length - 1;
        const lastUser = users[lastUserIndex];
        const newId = lastUser ? lastUser.id + 1 : 1;

        if (req.body.pass_confirm) {
            delete req.body.pass_confirm;
        }

        const newUser = {
            id: newId,
            ...req.body,
            pass: bcrypt.hashSync(req.body.pass, 12),
        };

        users.push(newUser);
        saveUsers(users);

        res.redirect("/admin/login");
    },
    showLogin: (req, res) => {
        res.render("login");
    },
    showRegister: (req, res) => {
        res.render("register");
    },
    logout: (req, res) => {
        req.session.loggedUserId = null;
        res.redirect("/")
    }
};
