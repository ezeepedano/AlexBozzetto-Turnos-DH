const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const turnoController = require("../controllers/turnoController");
const assertLoggedMiddleware = require("../middlewares/assertLoggedMiddleware")
const assertAdminMiddleware = require('../middlewares/assertAdminMiddleware');
const logDBMiddleware = require("../middlewares/logDBMiddleware");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + "/../public/images/turnos");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});

const upload = multer({ storage: storage });

router.get("/", turnoController.index);



router.get("/delete/:id", assertAdminMiddleware, turnoController.showDelete);

router.get("/detail/:id/:category?", turnoController.detail);

router.post("/", [upload.any(), logCreateMiddleware], turnoController.create);

router.post("/", turnoController.store);

router.put("/:id", logEditMiddleware, turnoController.update);

router.delete("/:id", logDeleteMiddleware, turnoController.delete);

module.exports = router;
