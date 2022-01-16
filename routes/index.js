var express = require("express");
var db = require("../db");
var router = express.Router();
var jwt = require("jwt-simple");
var secret = "%#$@*(%#@*)%&#@*%&_)(@*#&^)(_";
const { createConnection } = require("mysql");
const emailRegexp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const upload = multer({ dest: "public/img/tmp" });
const whitelist = ["image/png", "image/jpeg", "image/jpg"];
const tmpDir = path.join(__dirname + "/../public/img/tmp/");
const uploadDir = path.join(__dirname + "/../public/img/upload/");

function auth(req, res, next) {
  if (req.cookies.token) {
    const decode = jwt.decode(req.cookies.token, secret);
    if (decode) {
      req.user = decode;
    }
  }
  next();
}

function onlyFor(role) {
  return function (req, res, next) {
    if (req.user?.role === role) {
      next();
    } else {
      res.status(401).send("Brak autoryzacji");
    }
  };
}

/* GET home page. */

router.get("/", auth, async (req, res, next) => {
  const [getType] = await db.getType();
  res.render("index", { getType, logged: !!req.user });
});

router.get("/about", auth, async (req, res, next) => {
  res.render("about", { logged: !!req.user });
});

router.get("/product", auth, async (req, res, next) => {
  const [product] = await db.getProduct();
  res.render("product", { product, logged: !!req.user });
});

router.get("/register", auth, function (req, res, next) {
  res.render("register", { error: "" });
});

router.get("/login", auth, function (req, res, next) {
  res.render("login", {});
});

router.post("/login", auth, async (req, res, next) => {
  const { email, password } = req.body;
  if (!emailRegexp.test(email)) {
    res.status(400).send("Niewłaściwy format email");
    return;
  }
  const [result] = await db.loginClient(email, password);
  if (result.length) {
    const user = result[0];
    const token = jwt.encode(
      { email: user.email, role: "user", id: user.id_clients },
      secret
    );
    res.cookie("token", token, { httpOnly: true, secure: true });
    res.redirect("/");
  } else {
    res.render("login", { error: "Zły login lub hasło" });
  }
});

router.post("/register", async (req, res, next) => {
  const { name, lastName, email, password, phone_number, adress } = req.body;

  //        ZROBIC HASHOWANIE HASLA

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
    await db.registerClients(
      name,
      lastName,
      email,
      password,
      phone_number,
      adress
    );
  } catch (error) {
    if ((error.code = "ER_DUP_ENTRY")) {
      res.render("register", { error: "Ten Email jest zajęty!" });
    } else {
      res.render("register", { error: "Błąd serwera!" });
    }
    return;
  }
  res.redirect("/login");
});

router.get("/add", auth, function (req, res, next) {
  res.render("add", { logged: !!req.user });
});

router.post("/logout", auth, function (req, res, next) {
  res.clearCookie("token");
  res.send({});
});

router.get("/admin", auth, function (req, res, next) {
  res.render("admin", { error: "", logged: !!req.user });
});

router.post("/admin", auth, async (req, res, next) => {
  const { email, password } = req.body;
  const [result] = await db.loginAdmin(email, password);
  if (result.length) {
    const user = result[0];
    const token = jwt.encode(
      { email: user.email, role: "admin", id: user.id_workers },
      secret
    );
    res.cookie("token", token, { httpOnly: true, secure: true });
    res.redirect("/adminShow");
  } else {
    res.render("admin", { error: "Zły login lub hasło" });
  }
});

router.get("/adminShow", auth, onlyFor("admin"), async (req, res, next) => {
  const { id } = req.params;
  const [product] = await db.getPosts(id);
  const [types] = await db.getType();
  const saving = id
    ? { ...product.find((poroduct) => poroduct.id_product == id) }
    : {};
  res.render("adminShow", { product, logged: !!req.user, types, saving });
});

router.post(
  "/adminShow",
  upload.single("img_src"),
  auth,
  async (req, res, next) => {
    const { id, id_types, title, description, price } = req.body;
    const id_clients = "" + req.user.id;
    const date_publishment = new Date().toISOString();

    // CHECK IF FILE
    if (!req.file) {
      res.status(500).send("No file upload");
    } else {
      //  CHECK IF PHOTO FORMAT
      if (!whitelist.includes(req.file.mimetype)) {
        res.status(500).send("ONLY JPG, JPEG, PNG FORMAT");
      } else {
        const img_src =
          req.file.filename + "." + req.file.mimetype.split("/")[1];
        fs.copyFileSync(tmpDir + req.file.filename, uploadDir + img_src);
        fs.unlinkSync(tmpDir + req.file.filename);
        // CHECK IF ADD OR EDIT

        //ADD
        if (!id) {
          try {
            await db.addPost(
              id_clients,
              id_types,
              title,
              description,
              img_src,
              price,
              date_publishment
            );
            res.redirect("/adminShow");
          } catch (error) {
            console.error(error);
            res.status(500).send("error");
          }
          console.log("ADD CORECTLY");
        }

        //EDIT
        else {
          try {
            await db.editPost(id_types, title, description, img_src, price);
            res.redirect("/adminShow");
          } catch (error) {
            console.error(error);
            res.status(500).send("error");
          }
          console.log("EDIT CORECTLY");
        }
      }
    }
  }
);

router.delete(
  "/adminShow/:id",
  auth,
  onlyFor("admin"),
  async (req, res, next) => {
    const { id } = req.params;
    try {
      await db.removePost(id);
      res.send("ok");
    } catch (error) {
      console.error(error);
      res.status(500).send("error");
    }
  }
);

router.put("/adminShow/:id", auth, onlyFor("admin"), async (req, res, next) => {
  const { id_types, title, description, img_src, price } = req.body;
  const id = req.params.id;
  try {
    await db.editPost(id, id_types, title, description, img_src, price);
    res.send("ok");
  } catch (error) {
    console.error(error);
    res.status(500).send("das");
  }
});

router.get("/products", auth, async (req, res, next) => {
  const [products] = await db.getPosts();
  res.render("products", { products, logged: !!req.user });
});

router.get("/gra/:id", auth, async (req, res, next) => {
  const { id } = req.params;
  const [products] = await db.getGame(id);
  const product = products ? products[0] : {};
  res.render("object", { product, logged: !!req.user });
});

module.exports = router;
