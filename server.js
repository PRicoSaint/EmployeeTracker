const inquirer = require('inquirer');
const express = require('express');
const cTable = require('console.table');
// Import and require mysql2
const mysql = require('mysql2');
const { response } = require('express');
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
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
  },
  console.log(`Connected to the employee_db database.`)
);

inquirer.prompt([
  {
      type: 'list',
      message: "==============================\n====== EMPLOYEE DATABASE ======\n==============================\n\n Please select one of the following options:",
      name: 'option',
      choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update employee role", "Quit"],
  }
])
.then((response) => {
  let choice = response.option;
  nextOperation(choice)

});




function nextOperation(choice){
  switch (choice){
      case "View all departments":
          console.log("You have chosen to view all departments.")
      // Show departments table
        db.query(`SELECT department.department_name AS Departments FROM department;`, (err, rows) => {
          if (err){
            console.log(err.message);
            return;
          }else{
            console.table("Departments",rows);
          }
        });
      optionsScreen();
      break;
      case "View all roles":
        console.log("You have chosen to view all roles.")
      // Show roles table
      db.query(`SELECT current_role.title AS Title, current_role.salary AS Salary, department.department_name AS Department FROM current_role JOIN department ON current_role.department_id = department.id;`, (err, rows) => {
        if (err){
          console.log(err.message);
          return;
        }else{
          console.table("Roles", rows);
        }
      });
      optionsScreen();
      break;
      case "View all employees":
        console.log("You have chosen to view all employees.")
      //  Show employee table
      db.query(`SELECT employee.first_name AS First, employee.last_name AS Last, current_role.title AS Title, current_role.salary AS Salary, department.department_name AS Department FROM employee JOIN current_role ON employee.current_role_id = current_role.id JOIN department ON current_role.department_id = department.id;`, (err, rows) => {
        if (err){
          console.log(err.message);
          return;
        }else{
          console.table("Employees", rows);
        }
      });
      optionsScreen();
      break;
      case "Add a department":
        console.log("You have chosen to add a department.")
        // Insert value into department table
        addDepartment()
      break;
      case "Add a role":
        console.log("You have chosen to add a role.")
        // Insert value into role table
        addRole()
      break;
      case "Add an employee":
        console.log("You have chosen to add an employee.")
        // Insert value into employee table
        addEmployee()
      break;
      case "Update employee role":
        console.log("You have chosen to update an employee's role.")
        // Modify value in table
      updateEmployee();
      break;
      case "Quit":
        console.log("Good-bye!")
        // quit program
      break;
  }

}


function optionsScreen(){
  inquirer.prompt([
    {
        type: 'list',
        message: "Please select one of the following options:",
        name: 'option',
        choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update employee role", "Quit"],
    }
  ])
  .then((response) => {
    let choice = response.option;
    nextOperation(choice)
  
  });

};

function addDepartment(){
  inquirer.prompt([
    {
      type:'input',
      message:"Enter department name",
      name: 'department_name',

  }
  ])
  .then((response) => {
    let newDepartment = response.department_name;
    db.query(`INSERT INTO department (department_name) VALUES ("${newDepartment}");`, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("New department has been successfully added!")
    });
  optionsScreen();
    
  });
};

function addRole(){
  inquirer.prompt([
    {
      type:'input',
      message:"Enter new role name",
      name: 'role_name',

  },
  {
    type:'input',
        message:"What will the annual salary be?",
        name: 'salary',
        validate(value) {
            const valid = !isNaN(parseFloat(value));
            return valid || 'Please enter a number';
          },
          filter: Number,

}
  ])
  .then((response) => {
    let newRole = response.role_name;
    let newSalary = response.salary;
    db.query(`INSERT INTO current_role (title, salary) VALUES ("${newRole}", ${newSalary});`, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("New role has been successfully added!")
    });
    optionsScreen();
  });
};
function addEmployee(){
  inquirer.prompt([
    {
      type:'input',
      message:"Enter Employee's first name",
      name: 'firstName',

  },
  {
    type:'input',
    message:"Enter Employee's last name",
    name: 'lastName',

  },
  {
    type:'input',
        message:"Who will the manager be?",
        name: 'manager',
        validate(value) {
            const valid = !isNaN(parseFloat(value));
            return valid || 'Please enter a number';
          },
          filter: Number,

}
  ])
  .then((response) => {
    let firstName = response.firstName;
    let lastName = response.lastName;
    let manager = response.manager;
    db.query(`INSERT INTO employee (first_name, last_name, manager_id) VALUES ("${firstName}", "${lastName}", ${manager});`, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("New role has been successfully added!")
    });
  optionsScreen();
    
  });
};

function updateEmployee(){
  var employee = [];
  var newRole=[];
  db.query(`SELECT GROUP_Concat(first_name, ' ', last_name) AS choices FROM employee ORDER BY first_name;`, (err, result)=>{
  if (err) {
    console.log(err);
    return;
  }
  let array = Object.values(JSON.parse(JSON.stringify(result)));
   let options = array[0].choices;
   const myOptions = JSON.stringify(options);
   const lastChange = myOptions.replace(/['"]+/g, '');
   const finalOptions = lastChange.split(",");

  inquirer.prompt([
    {
      type:'list',
      message:"Choose Employee to update",
      name: 'employee_name',
      choices: finalOptions,
  }

  ])
  .then((response) => {
    employee = response.employee_name;
    db.query(`SELECT GROUP_CONCAT(title) as choices FROM current_role;`, (err, result)=>{
      if (err) {
        console.log(err);
        return;
      }
      let array = Object.values(JSON.parse(JSON.stringify(result)));
       let options = array[0].choices;
       const myOptions = JSON.stringify(options);
       const lastChange = myOptions.replace(/['"]+/g, '');
       const finalOptions = lastChange.split(",");
    
      inquirer.prompt([
        {
          type:'list',
          message:"Choose role for employee to assume",
          name: 'role',
          choices: finalOptions,
      }
    
      ]).then((response) => {
        newRole = response.role;  
        console.log(newRole);
        let employeesNames = employee.split(" ");
        console.log(employeesNames);
        let firstName = employeesNames[0];
        console.log(firstName);

      db.query( // UPDATE employee
      // SET title = ${newRole}
      // WHERE first_name = ${firstName}
      // UPDATE employee SET title = "Agent" WHERE first_name = "Cyril";
      `UPDATE employee SET title = "${newRole}" WHERE first_name = "${firstName}";`, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Employee has been sucessfully updated!")
    });

      })
      
    
    
    })

  })
})
    // db.query( // UPDATE employee
    //   // SET role = "strawberry"
    //   // WHERE ----split name into first_name and last_name and match to
    //   ` `, (err, result) => {
    //   if (err) {
    //     console.log(err);
    //     return;
    //   }
    //   console.log("Employee has been sucessfully updated!")
    // });
  optionsScreen();
    
  



  



};

function list(choices){
  for (i=1; i > choices.length; i++){
    return choices[i];
  }
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });