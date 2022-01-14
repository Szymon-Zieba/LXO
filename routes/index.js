var express = require('express');
var db = require('../db');
var router = express.Router();
var jwt = require('jwt-simple');
var secret = '%#$@*(%#@*)%&#@*%&_)(@*#&^)(_';
const { createConnection } = require('mysql');
const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const bcrypt = require('bcrypt');


function auth(req, res, next) {
  if(req.cookies.token){
    const decode = jwt.decode(req.cookies.token, secret);
    if(decode){
      req.user = decode;
    }
  }
  next();
}



function onlyFor(role){
  return function(req, res, next){
    if(req.user?.role === role){
      next();
    }
    else{
      res.status(401).send("Brak autoryzacji");
    }
  }
};

/* GET home page. */

router.get('/', auth, async (req, res, next) => {
  const [getType] = await db.getType();
    res.render('index', {getType, logged:!!req.user});
  });

  router.get('/about', auth, async (req, res, next) => {
    res.render('about', {logged:!!req.user});
  });

  
router.get('/product', auth, async (req, res, next) => {
    const [product] = await db.getProduct();
     res.render('product', {product, logged:!!req.user});
  });

  router.get('/register', auth, function(req, res, next) {
    res.render('register', {error:""});
});

router.get('/login', auth, function(req, res, next) {
  res.render('login', {});
});

router.post('/login', auth, async (req, res, next) => {
  
  const {email,password} = req.body;
  if(!emailRegexp.test(email)){
    
    res.status(400).send("Niewłaściwy format email");
    return;
  }
  const [result] = await db.loginClient(email, password);
  if(result.length){
    const user = result[0];
    const token = jwt.encode({email:user.email, role:'user', id: user.id_clients}, secret);
    res.cookie('token', token, {httpOnly:true, secure:true});
    res.redirect('/');
  }
  else{
    res.render('login', {error:"Zły login lub hasło"});
  }
  
});

router.post('/register', async(req, res, next)  =>{
  const {name, lastName, email, password, phone_number, adress} = req.body;

  //        ZROBIC HASHOWANIE HASLA

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  try{
    await db.registerClients(name, lastName, email, password, phone_number, adress);
  }
  catch(error){
   if(error.code = 'ER_DUP_ENTRY'){
     res.render('register', {error: "Ten Email jest zajęty!"})
   }
   else{
    res.render('register', {error: "Błąd serwera!"})
   }
   return;
  }
  res.redirect('/login');
});

router.get('/add', auth, function(req, res, next) {
  res.render('add', {logged:!!req.user});
});


router.post('/logout', auth, function(req, res, next){
  res.clearCookie("token");
  res.send({});
});


router.get('/admin', auth, function(req, res, next) {
  res.render('admin', {error:"", logged:!!req.user});
});

router.post('/admin', auth, async (req, res, next) => {
  const {email,password} = req.body;
  const [result] = await db.loginAdmin(email,password);
  if(result.length){
    const user = result[0];
    const token = jwt.encode({email:user.email, role:'admin', id: user.id_workers}, secret);
    res.cookie('token', token, {httpOnly:true, secure:true});
    res.redirect('/adminShow');
  }
  else{
    res.render('admin', {error:"Zły login lub hasło"});
  }
});




router.get('/adminShow', auth, onlyFor('admin'), async (req, res, next) => {
  const {id} = req.params;
  const [product] = await db.getPosts(id);
  const [types] = await db.getType();
  const saving = id ? {...product.find(poroduct=>poroduct.id_product == id)} : {}; 
  res.render('adminShow', {product, logged:!!req.user, types, saving});
});

router.post('/adminShow', auth, async (req, res, next) => {
  const {id_types, title, description, price} = req.body;
  const id_clients = '' + req.user.id;
  const date_publishment = new Date().toISOString();

  // ZROBIC DODAWANIE ZDJECIA

  if (!req.file) {
    console.log("No file upload");
  } 
  else {
    console.log(req.file.filename)
    var imgsrc = 'http://127.0.0.1:3000/images/' + req.file.filename
    db.query(insertData, [imgsrc], (err, result) => {
        if (err) throw err
          console.log("file uploaded")
      })
  }

  // OTHER

  try {
      await db.addPost(id_clients, id_types, title, description, img_src, price, date_publishment);
      res.redirect('/adminShow')
    }
  catch(error) {
      console.error(error)
      res.status(500).send('error');
    }
     
});

router.delete('/adminShow/:id', auth, onlyFor('admin'), async (req, res, next) => {
  const {id} = req.params;
  try {
    await db.removePost(id);
    res.send('ok');
  }
  catch(error) {
    console.error(error)
    res.status(500).send('error');
  }
});

router.put('/adminShow/:id', auth, onlyFor('admin'), async (req, res, next) => {
  const {id_types, title, description, img_src, price} = req.body;
  const id = req.params.id;
    try {
      await db.editPost(id, id_types, title, description, img_src, price);
      res.send('ok');
    }
    catch(error) {
      console.error(error)
      res.status(500).send('das');
    }
  
});

module.exports = router;
