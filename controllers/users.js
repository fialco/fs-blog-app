const bcrypt = require("bcrypt");
const router = require("express").Router();

const { User, Blog } = require("../models");

router.get("/", async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ["hashedPassword"] },
    include: {
      model: Blog,
      attributes: {
        exclude: ["userId"],
      },
    },
  });
  res.json(users);
});

router.post("/", async (req, res, next) => {
  try {
    const { username, name, password } = req.body;

    if (!password || password.length < 3) {
      return res
        .status(400)
        .json({ error: "Password must be at least 3 characters long" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      name,
      hashedPassword: passwordHash,
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const where = {};

    if (req.query.read) {
      where.read = req.query.read;
    }

    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["hashedPassword"] },
      include: {
        model: Blog,
        as: "readings",
        attributes: { exclude: ["userId", "createdAt", "updatedAt"] },
        through: { attributes: ["read", "id"], where },
      },
    });
    if (user) {
      res.json(user);
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    next(error);
  }
});

router.put("/:username", async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { username: req.params.username },
    });
    user.name = req.body.name;
    await user.save();
    res.json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
