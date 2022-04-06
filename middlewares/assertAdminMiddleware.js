function assertAdminMiddleware(req, res, next) {

    console.log(req.session);

    if (!req.session.loggedUserId) {
        res.redirect("/admin/login");
    } else {
        next();
    }
}

module.exports = assertAdminMiddleware;
