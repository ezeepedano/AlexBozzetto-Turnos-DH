const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer({ dest: "public/images/profile_pics/" });

const authController = require("../controllers/authController");
const turnoController = require("../controllers/turnoController");

const assertAdminMiddleware = require('../middlewares/assertAdminMiddleware');


router.get("/login", authController.showLogin);
router.post("/login", authController.login);

router.get("/register", authController.showRegister);
router.post("/register", upload.single("avatar"), authController.register);

router.get("/turnos", assertAdminMiddleware, turnoController.showCreate);

router.get("/logout", authController.logout)

module.exports = router;
