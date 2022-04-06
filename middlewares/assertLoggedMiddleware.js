function assertLoggedMiddleware(req, res, next) {

    if (!req.session.loggedUserId) {
        res.redirect("/admin/login");
    } else {
        next();
    }
}

module.exports = assertLoggedMiddleware;
