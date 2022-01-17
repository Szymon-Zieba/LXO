var mysql = require("mysql");

function connectDB() {
  var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "mysql",
  });
  return new Promise((resolve, reject) => {
    connection.connect(function (err) {
      if (err) {
        console.error("error connecting: " + err.stack);
        reject(err);
      }
      resolve(connection);
    });
  });
}

// dodanie params

function execute(query, params) {
  return connectDB().then((connection) => {
    return new Promise((resolve, reject) => {
      connection.query(query, params, function (error, results, fields) {
        if (error) reject(error);
        resolve(results, fields);
      });
    });
  });
}

function getTypes() {
  return execute(`CALL getTypes()`);
}

function getType(id) {
  return execute(`CALL getType(?)`, [id]);
}

function registerClients(
  login,
  lastName,
  email,
  password,
  phone_number,
  adress
) {
  return execute(`CALL registerClients(?, ?, ?, ?, ?, ?)`, [
    login,
    lastName,
    email,
    password,
    phone_number,
    adress,
  ]);
}

function loginClient(login, password) {
  return execute(`CALL loginClient(?, ?)`, [login, password]);
}

/* function loginClientInjection(login, password){
    return execute(`CALL loginClient('${login}', '${password}')`)
} */

function loginAdmin(login, password) {
  return execute(`CALL loginAdmin(?, ?)`, [login, password]);
}

function getPost(id) {
  return execute(`CALL getPost(?)`, [id]);
}

function getPosts(id) {
  return execute(`CALL getPosts(?)`, [id]);
}

function addPost(
  id_clients,
  id_types,
  title,
  description,
  img_src,
  price,
  date_publishment
) {
  return execute(`CALL addPost(?, ? , ? , ?, ? , ? , ?)`, [
    id_clients,
    id_types,
    title,
    description,
    img_src,
    price,
    date_publishment,
  ]);
}

function removePost(id) {
  return execute(`CALL removePost(?)`, [id]);
}

function editPost(id, id_types, title, description, img_src, price) {
  return execute(`CALL editPost(?, ? , ? , ?, ? , ? )`, [
    id,
    id_types,
    title,
    description,
    img_src,
    price,
  ]);
}

function getClient(id) {
  return execute(`CALL getClient(?)`, [id]);
}

module.exports = {
  getTypes,
  getType,
  loginClient,
  loginAdmin,
  registerClients,
  getPost,
  getPosts,
  addPost,
  removePost,
  editPost,
  getClient,
};
