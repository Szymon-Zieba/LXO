var express = require("express");
var db = require("../db");
var router = express.Router();
var jwt = require("jsonwebtoken");
var secret = "%#$@*(%#@*)%&#@*%&_)(@*#&^)(_";
const { createConnection } = require("mysql");
const emailRegexp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const tokens = {};
const upload = multer({ dest: "public/img/tmp" });
const whitelist = ["image/png", "image/jpeg", "image/jpg"];
const tmpDir = path.join(__dirname + "/../public/img/tmp/");
const uploadDir = path.join(__dirname + "/../public/img/upload/");
const config = require("../config.json");

function auth(req, res, next) {
  const { token, refresh } = req.cookies;

  if (token) {
    jwt.verify(token, config.secret, function (err, decoded) {
      if (err) {
        // wygasnienice tokenu
        if (tokens[refresh]) {
          jwt.verify(
            refresh,
            config.refreshTokenSecret,
            function (err, decoded) {
              if (err) {
                return res.status(401).send("Unauthorized access.");
              }
              const token = jwt.sign(userData, config.secret, {
                expiresIn: config.tokenLife,
              });
              res.cookie("token", token, { httpOnly: true, secure: true });
              req.user = decoded;
            }
          );
        }
      } else {
        req.user = decoded;
      }
    });
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
  const [getTypes] = await db.getTypes();
  res.render("index", { getTypes, logged: !!req.user });
});

router.get("/about", auth, async (req, res, next) => {
  res.render("about", { logged: !!req.user });
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
    const userData = { email: user.email, role: "user", id: user.id_clients };
    const token = jwt.sign(userData, config.secret, {
      expiresIn: config.tokenLife,
    });
    res.cookie("token", token, { httpOnly: true, secure: true });
    const refreshToken = jwt.sign(userData, config.refreshTokenSecret, {
      expiresIn: config.refreshTokenLife,
    });
    tokens[refreshToken] = true;
    res.cookie("refresh", refreshToken, {
      httpOnly: true,
      secure: true,
    });
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

router.post("/logout", auth, function (req, res, next) {
  delete tokens[req.cookies.refresh];
  res.clearCookie("token");
  res.clearCookie("refresh");
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
  const [types] = await db.getTypes();
  const saving = id
    ? { ...product.find((poroduct) => poroduct.id_product == id) }
    : {};
  res.render("adminShow", { product, logged: !!req.user, types, saving });
});

// router.post(
//   "/adminShow",
//   upload.single("img_src"),
//   auth,
//   async (req, res, next) => {
//     const { id, id_types, title, description, price } = req.body;
//     const id_clients = "" + req.user.id;
//     const date_publishment = new Date().toISOString();

//     // CHECK IF FILE
//     if (!req.file) {
//       res.status(500).send("No file upload");
//     } else {
//       //  CHECK IF PHOTO FORMAT
//       if (!whitelist.includes(req.file.mimetype)) {
//         res.status(500).send("ONLY JPG, JPEG, PNG FORMAT");
//       } else {
//         const img_src =
//           req.file.filename + "." + req.file.mimetype.split("/")[1];
//         fs.copyFileSync(tmpDir + req.file.filename, uploadDir + img_src);
//         fs.unlinkSync(tmpDir + req.file.filename);
//         // CHECK IF ADD OR EDIT

//         //ADD
//         if (!id) {
//           try {
//             await db.addPost(
//               id_clients,
//               id_types,
//               title,
//               description,
//               img_src,
//               price,
//               date_publishment
//             );
//             res.redirect("/adminShow");
//           } catch (error) {
//             console.error(error);
//             res.status(500).send("error");
//           }
//           console.log("ADD CORECTLY");
//         }

//         //EDIT
//         else {
//           try {
//             await db.editPost(id_types, title, description, img_src, price);
//             res.redirect("/adminShow");
//           } catch (error) {
//             console.error(error);
//             res.status(500).send("error");
//           }
//           console.log("EDIT CORECTLY");
//         }
//       }
//     }
//   }
// );

// router.delete(
//   "/adminShow/:id",
//   auth,
//   onlyFor("admin"),
//   async (req, res, next) => {
//     const { id } = req.params;
//     try {
//       await db.removePost(id);
//       res.send("ok");
//     } catch (error) {
//       console.error(error);
//       res.status(500).send("error");
//     }
//   }
// );

router.get("/products/:id/", auth, async (req, res, next) => {
  const [products] = await db.getPosts(req.params.id);
  res.render("products", { products, logged: !!req.user });
});

router.get("/product/:id/", auth, async (req, res, next) => {
  const [products] = await db.getProductTC();
  const product = products ? products[0] : {};

  res.render("product", { product, logged: !!req.user });
});

router.get("/add", auth, async (req, res, next) => {
  const { id } = req.params;
  const id_clients = "" + req.user.id;
  const [products] = await db.getClientProducts(id_clients);
  const [types] = await db.getTypes();
  const saving = id
    ? { ...products.find((poroduct) => poroduct.id_product == id) }
    : {};
  res.render("add", { products, saving, types, logged: !!req.us });
});

router.post("/add", upload.single("img_src"), auth, async (req, res, next) => {
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
      const img_src = req.file.filename + "." + req.file.mimetype.split("/")[1];
      fs.copyFileSync(tmpDir + req.file.filename, uploadDir + img_src);
      fs.unlinkSync(tmpDir + req.file.filename);
      // CHECK IF ADD OR EDIT

      //EDIT
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
          res.redirect("/add");
        } catch (error) {
          console.error(error);
          res.status(500).send("error");
        }
        console.log("ADD CORECTLY");
      }
      //ADD
      else {
        try {
          await db.editPost(id, id_types, title, description, img_src, price);
          res.redirect("/add");
        } catch (error) {
          console.error(error);
          res.status(500).send("error");
        }
        console.log("EDIT CORECTLY");
      }
    }
  }
});

router.delete("/add/:id", auth, async (req, res, next) => {
  const { id } = req.params;
  try {
    await db.removePost(id);
    res.send("ok");
  } catch (error) {
    console.error(error);
    res.status(500).send("error");
  }
});

module.exports = router;
