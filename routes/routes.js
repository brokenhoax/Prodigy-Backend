const router = require("express").Router();
const WebControl = require("../controllers/webinarController");
const UserControl = require("../controllers/userController");
const auth = require("../middleware/auth");

router.get("/", (req, res) => {
  return res
    .status(200)
    .json({
      success: "true",
      message:
        "Welcome! To begin receiving data, please use '/webinar' or '/user' endpoints!",
    })
    .end();
});

router.post("/webinar/create", WebControl.create);
router.patch("/webinar/update/:id", WebControl.update);
router.delete("/webinar/delete/:id", WebControl.delete);
router.get("/webinar/get/id/:id", WebControl.getId);
router.get("/webinar/get/all", WebControl.getAll);
router.get("/webinar/get/createdby/:id", WebControl.getCreatedBy);

router.post("/register", UserControl.create);
router.post("/user/login", UserControl.login);
router.post("/user/isTokenValid", UserControl.validate);
router.get("/users/", auth, UserControl.getToken);
router.delete("/user/delete", auth, UserControl.delete);

router.patch("/user/update/:id", UserControl.update);
router.delete("/user/delete/:id", UserControl.delete);
router.get("/user/get/id/:id", UserControl.getId);
router.get("/user/get/verify/:email/:password", UserControl.verifyUser);
router.get("/user/get/all", UserControl.getAll);

router.get("/user/:id/webinar/favorite", UserControl.getUserFavorite);
router.get("/user/:id/webinar/registered", UserControl.getUserRegistered);
router.get("/user/:id/webinar/completed", UserControl.getUserCompleted);
router.get("/user/:id/webinar/passed", UserControl.getUserPassed);

module.exports = router;
