const inquirer = require('inquirer');
// Import and require mysql2
const mysql = require('mysql2');
require('dotenv').config()

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
  },
  console.log(`Connected to the employee_db database.`)
);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });