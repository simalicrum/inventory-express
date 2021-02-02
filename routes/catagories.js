var express = require("express");
var router = express.Router();

var catagory_controller = require("../controllers/catagoryController");

router.get("/create", catagory_controller.catagory_create_get);

router.post("/create", catagory_controller.catagory_create_post);

router.get("/", catagory_controller.catagories);

router.get("/:id", catagory_controller.catagory_detail);

router.get("/:id/delete", catagory_controller.catagory_delete_get);

router.post("/:id/delete", catagory_controller.catagory_delete_post);

router.get("/:id/update", catagory_controller.catagory_update_get);

router.post("/:id/update", catagory_controller.catagory_update_post);

module.exports = router;
