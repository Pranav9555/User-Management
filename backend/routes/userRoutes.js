const express = require("express");
const router = express.Router();

const {
  getUsers,
  getUserStats,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

router.get("/stats", getUserStats);
router.route("/").get(getUsers).post(createUser);
router
  .route("/:id")
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;