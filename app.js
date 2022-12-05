const express = require('express');
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const  mysql  = require("mysql");

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//parsing middleeare
app.use(bodyParser.urlencoded({ extended: false }));

//parse application/json
app.use(bodyParser.json());

app.use(express.static("public"));

//Temlating Engine
const handlebars = exphbs.create({ extname: '.hbs', });
app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');



// collection pool
const pool = mysql.createPool({
  connectionLimit : 100,
  host  : process.env.DB_HOST,
  user  : process.env.DB_USER,
  password  : process.env.DB_PASSWORD,
  database  : process.env.DB_NAME

});

//connect to DB
pool.getConnection((err, connection) => 
{
  if(err) throw err; 
  console.log("Connected as ID "  + connection.threadId);
}
);

const routes = require('./server/routes/user');
app.use('/', routes);

app.listen(port, () => console.log(`Listening on port ${port}`));