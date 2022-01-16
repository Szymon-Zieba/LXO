var multer = require("multer");
var imageModel = require("./public/img/upload");

module.exports = {
  displayImage: function (req, res) {
    imageModel.displayImage(function (data) {
      res.render("display-image", { imagePath: data });
    });
  },
};
