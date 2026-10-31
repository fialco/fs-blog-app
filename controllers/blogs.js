const router = require("express").Router();

const { Op } = require("sequelize");
const { Blog, User } = require("../models");
const { tokenExtractor, verifySession } = require("../util/middleware");

router.get("/", async (req, res) => {
  const where = {};

  if (req.query.search) {
    where[Op.or] = [
      {
        title: {
          [Op.iLike]: `%${req.query.search}%`,
        },
      },
      {
        author: {
          [Op.iLike]: `%${req.query.search}%`,
        },
      },
    ];
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: ["name"],
    },
    where,
    order: [["likes", "DESC"]],
  });
  res.json(blogs);
});

router.post("/", tokenExtractor, verifySession, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);
    const body = req.body;

    const blog = await Blog.create({
      author: body.author,
      url: body.url,
      title: body.title,
      year: body.year,
      userId: user.id,
    });

    res.json(blog);
  } catch (error) {
    next(error);
  }
});

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  if (!req.blog) {
    return res.status(404).json({ error: "could not find blog with given id" });
  }
  next();
};

router.get("/:id", blogFinder, async (req, res) => {
  res.json(req.blog);
});

router.put("/:id", blogFinder, async (req, res) => {
  try {
    req.blog.likes = req.body.likes;
    await req.blog.save();
    res.json(req.blog);
  } catch (error) {
    next(error);
  }
});

router.delete(
  "/:id",
  tokenExtractor,
  verifySession,
  blogFinder,
  async (req, res, next) => {
    try {
      const user = await User.findByPk(req.decodedToken.id);

      if (req.blog.userId === user.id) {
        await req.blog.destroy();
        res.status(204).end();
      } else {
        return res.status(401).json({ error: "user id invalid" });
      }
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
