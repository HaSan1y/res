const express = require("express");
const multer = require('multer');
const cors = require('cors');

var app = express();
app.use(cors()); // Allows incoming requests from any IP

// Start by creating some disk storage options:
const storage = multer.diskStorage({
   destination: function (req, file, callback) {
      callback(null, __dirname + '/uploads');
   },
   // Sets file(s) to be saved in uploads folder in same directory
   filename: function (req, file, callback) {
      callback(null, file.originalname);
   }
   // Sets saved filename(s) to be original filename(s)
})

// Set saved storage options:
const upload = multer({ storage: storage })

app.post("/api", upload.array("files"), (req, res) => {
   try { 
   for (let i = 0; i < req.files.length; i++) {
      if (req.files[i].mimetype !== "image/png") {
         return res.status(400).json({ error: "only png allowed" });
      }
   }
   console.log(req.body); // Logs form body values
   console.log(req.files); // Logs any files
   res.status(200).json({ message: "File(s) uploaded successfully" });
}
catch (error) {
   console.error(error);
   res.status(500).json({ error: "Internal server error" });
 }
});

app.listen(5000, function () {
   console.log("Server running on port 5000");
});
