const inquirer = require('inquirer');
// Import and require mysql2
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    //  Add MySQL password here
    password: 'password123',
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });