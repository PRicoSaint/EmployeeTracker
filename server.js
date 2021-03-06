// Sets up requireds modules to be loaded
const inquirer = require("inquirer");
const express = require("express");
const cTable = require("console.table");
// Import and require mysql2
const mysql = require("mysql2");
const { response } = require("express");
require("dotenv").config();

// Sets up port for server to listen to.
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  { //CREATE .env FILE AND MAKE SURE IT IS FILLED WITH VALUES FOR DB_HOST='' ETC
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
  },
  console.log(`Connected to the employee_db database.`)
);
// Initial prompt shows the user the employee database splash and scrolling list of options to choose from
inquirer
  .prompt([
    {
      type: "list",
      message:
        "==============================\n====== EMPLOYEE DATABASE ======\n==============================\n\n Please select one of the following options:",
      name: "option",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update employee role",
        "Quit",
      ],
    },
  ])
  .then((response) => {
    let choice = response.option;
    nextOperation(choice);
  });
// This functions contains a switch case that matches each of the choice options.
function nextOperation(choice) {
  switch (choice) {
    case "View all departments":
      console.log("You have chosen to view all departments.");
      // Show departments table
      db.query(
        `SELECT department.department_name AS Departments FROM department;`,
        (err, rows) => {
          if (err) {
            console.log(err.message);
            return;
          } else {
            // This will output the mysql2 data query as a nice looking table
            console.table("Departments", rows);
          }
        }
      );
      // returns the initial options screen without splash section
      optionsScreen();
      break;
    case "View all roles":
      console.log("You have chosen to view all roles.");
      // Show roles table joined with departments to match department_id
      db.query(
        `SELECT current_role.title AS Title, current_role.salary AS Salary, department.department_name AS Department FROM current_role JOIN department ON current_role.department_id = department.id;`,
        (err, rows) => {
          if (err) {
            console.log(err.message);
            return;
          } else {
            console.table("Roles", rows);
          }
        }
      );
      optionsScreen();
      break;
    case "View all employees":
      console.log("You have chosen to view all employees.");
      //  Show employee table, joined with current_role table, department table and manager side of the employee table
      db.query(
        `SELECT employee.first_name AS First, employee.last_name AS Last, current_role.title AS Title, current_role.salary AS Salary, department.department_name AS Department, CONCAT(manager.first_name, " ", manager.last_name) AS Manager FROM employee JOIN current_role ON employee.current_role_id = current_role.id JOIN department ON current_role.department_id = department.id LEFT JOIN employee Manager ON manager.id = employee.manager_id;`,
        (err, rows) => {
          if (err) {
            console.log(err.message);
            return;
          } else {
            console.table("Employees", rows);
          }
        }
      );
      optionsScreen();
      break;
    case "Add a department":
      console.log("You have chosen to add a department.");
      // Insert value into department table
      addDepartment();
      break;
    case "Add a role":
      console.log("You have chosen to add a role.");
      // Insert value into role table
      addRole();
      break;
    case "Add an employee":
      console.log("You have chosen to add an employee.");
      // Insert value into employee table
      addEmployee();
      break;
    case "Update employee role":
      console.log("You have chosen to update an employee's role.");
      // Modify existing employee's current role
      updateEmployee();
      break;
    case "Quit":
      console.log("Good-bye!");
      // quit program
      break;
  }
}
// Open to see functions
function optionsScreen() {
  // Runs database command line interface options without splash.
  inquirer
    .prompt([
      {
        type: "list",
        message: "Please select one of the following options:",
        name: "option",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update employee role",
          "Quit",
        ],
      },
    ])
    .then((response) => {
      let choice = response.option;
      nextOperation(choice);
    });
}

function addDepartment() {
  // Asks user for department name and inserts it into department table
  inquirer
    .prompt([
      {
        type: "input",
        message: "Enter department name",
        name: "department_name",
      },
    ])
    .then((response) => {
      let newDepartment = response.department_name;
      db.query(
        `INSERT INTO department (department_name) VALUES ("${newDepartment}");`,
        (err, result) => {
          if (err) {
            console.log(err);
            return;
          }
          console.log("New department has been successfully added!");
        }
      );
      optionsScreen();
    });
}

function addRole() {
  // Asks user for role name, salary for this role, and department where this role will belong to. The department list is taken from existing values in the department table.
  // Sets up some global variables to be referenced and used later in the function.
  var newRole = [];
  var newSalary = [];
  var end = [];
  inquirer
    .prompt([
      {
        type: "input",
        message: "Enter new role name",
        name: "role_name",
      },
      {
        type: "input",
        message: "What will the annual salary be?",
        name: "salary",
        validate(value) {
          const valid = !isNaN(parseFloat(value));
          return valid || "Please enter a number";
        },
        filter: Number,
      },
    ])
    .then((response) => {
      newRole = response.role_name;
      newSalary = response.salary;
      // loads department options
      db.query(
        `SELECT GROUP_CONCAT(department_name) as choices FROM department;`,
        (err, result) => {
          if (err) {
            console.log(err);
            return;
          }
          // Takes result from db query and converts it over to usable array for inquirer to display as options
          let array = Object.values(JSON.parse(JSON.stringify(result)));
          let options = array[0].choices;
          const myOptions = JSON.stringify(options);
          const lastChange = myOptions.replace(/['"]+/g, "");
          const finalOptions = lastChange.split(",");

          inquirer
            .prompt([
              {
                type: "list",
                message: "Choose department to which new role will report to",
                name: "department",
                choices: finalOptions,
              },
            ])
            .then((response) => {
              let dept = response.department;
              db.query(
                // Takes user inut and matches it to value in database.
                `SELECT id FROM department WHERE department_name = "${dept}";`,
                (err, result) => {
                  if (err) {
                    console.log(err);
                    return;
                  }
                  let array = Object.values(JSON.parse(JSON.stringify(result)));
                  end = array[0].id;
                  db.query(
                    // creates new role with needed values
                    `INSERT INTO current_role (title, salary, department_id) VALUES ("${newRole}", ${newSalary}, ${end});`,
                    (err, result) => {
                      if (err) {
                        console.log(err);
                        return;
                      }
                      console.log("New role has been successfully added!");
                    }
                  );
                  optionsScreen();
                }
              );
            });
        }
      );
    });
}

function addEmployee() {
  // This function adds a new employee. It asks the user for employee first name, last name, role and manager.
  // Role and manager are existing values loaded from current_role and employee tables, respectively.
  // Setting up of global values to be referenced and used later in function.
  var firstN = [];
  var lastN = [];
  var finish = [];
  var newRole = [];
  inquirer
    .prompt([
      {
        type: "input",
        message: "Enter Employee's first name",
        name: "firstName",
      },
      {
        type: "input",
        message: "Enter Employee's last name",
        name: "lastName",
      },
    ])
    .then((response) => {
      firstN = response.firstName;
      lastN = response.lastName;
      // prompt for manager
      db.query(
        `SELECT GROUP_CONCAT(first_name, " ", last_name) as choices FROM employee;`,
        (err, result) => {
          if (err) {
            console.log(err);
            return;
          }
          let array = Object.values(JSON.parse(JSON.stringify(result)));
          let options = array[0].choices;
          const myOptions = JSON.stringify(options);
          const lastChange = myOptions.replace(/['"]+/g, "");
          let finalOptions = lastChange.split(",");
          finalOptions.push("NULL");
          let end = [];

          inquirer
            .prompt([
              {
                type: "list",
                message: "Choose manager to which new employee will report to",
                name: "manager",
                choices: finalOptions,
              },
            ])
            .then((response) => {
              // Manager name is composed of first name and last name. It needs to be seperated to be able to matched to id and used to assign manager_id
              let employeesNames = response.manager.split(" ");
              let firstName = employeesNames[0];
              db.query(
                `SELECT id FROM employee WHERE first_name = "${firstName}";`,
                (err, result) => {
                  if (err) {
                    console.log(err);
                    return;
                  }
                  let array = Object.values(JSON.parse(JSON.stringify(result)));
                  end = array[0].id;
                  // Populate role values for inquirer options
                  db.query(
                    `SELECT GROUP_CONCAT(title) as choices FROM current_role;`,
                    (err, result) => {
                      if (err) {
                        console.log(err);
                        return;
                      }
                      let array = Object.values(
                        JSON.parse(JSON.stringify(result))
                      );
                      let options = array[0].choices;
                      const myOptions = JSON.stringify(options);
                      const lastChange = myOptions.replace(/['"]+/g, "");
                      const finalOptions = lastChange.split(",");

                      inquirer
                        .prompt([
                          {
                            type: "list",
                            message: "Choose role for new employee to assume",
                            name: "role",
                            choices: finalOptions,
                          },
                        ])
                        .then((response) => {
                          newRole = response.role;
                          // Takes id from matching role value
                          db.query(
                            `SELECT id FROM current_role WHERE title = "${newRole}";`,
                            (err, result) => {
                              if (err) {
                                console.log(err);
                                return;
                              }
                              let array = Object.values(
                                JSON.parse(JSON.stringify(result))
                              );
                              let finish = array[0].id;
                              db.query(
                                // Final set up of the employee taking all values from previous request in function. Sets up the new employee.
                                `INSERT INTO employee (first_name, last_name,current_role_id, manager_id) VALUES ("${firstN}", "${lastN}",${finish}, ${end});`,
                                (err, result) => {
                                  if (err) {
                                    console.log(err);
                                    return;
                                  }
                                  console.log(
                                    "New employee has been successfully added!"
                                  );
                                }
                              );
                              optionsScreen();
                            }
                          );
                        });
                    }
                  );
                }
              );
            });
        }
      );
    });
}

function updateEmployee() {
  // This function takes existing employee and modifies role value. List of employees is taken from existing values found in employee table
  // Set up of global values to be used later in function
  var employee = [];
  var newRole = [];
  var finish = 0;
  db.query(
    // db query to obtain list of employees currently in employee table, joining their first and last names.
    `SELECT GROUP_Concat(first_name, ' ', last_name) AS choices FROM employee ORDER BY first_name;`,
    (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      // Converts output from mysql2 to array usable by inquirer
      let array = Object.values(JSON.parse(JSON.stringify(result)));
      let options = array[0].choices;
      const myOptions = JSON.stringify(options);
      const lastChange = myOptions.replace(/['"]+/g, "");
      const finalOptions = lastChange.split(",");

      inquirer
        .prompt([
          {
            type: "list",
            message: "Choose Employee to update",
            name: "employee_name",
            choices: finalOptions,
          },
        ])
        .then((response) => {
          employee = response.employee_name;
          db.query(
            // db query to pull values in current_role table to be displayed as options in inquirer 
            `SELECT GROUP_CONCAT(title) as choices FROM current_role;`,
            (err, result) => {
              if (err) {
                console.log(err);
                return;
              }
              // Converts result of db query into array usable by inquirer
              let array = Object.values(JSON.parse(JSON.stringify(result)));
              let options = array[0].choices;
              const myOptions = JSON.stringify(options);
              const lastChange = myOptions.replace(/['"]+/g, "");
              const finalOptions = lastChange.split(",");

              inquirer
                .prompt([
                  {
                    type: "list",
                    message: "Choose role for employee to assume",
                    name: "role",
                    choices: finalOptions,
                  },
                ])
                .then((response) => {
                  newRole = response.role;
                  let employeesNames = employee.split(" ");
                  let firstName = employeesNames[0];

                  // Takes id from matching role value
                  db.query(
                    `SELECT id FROM current_role WHERE title = "${newRole}";`,
                    (err, result) => {
                      if (err) {
                        console.log(err);
                        return;
                      }
                      let array = Object.values(
                        JSON.parse(JSON.stringify(result))
                      );
                      finish = array[0].id;
                      db.query(
                        // Updates table using values obtained from user input
                        `UPDATE employee SET current_role_id = "${finish}" WHERE first_name = "${firstName}";`,
                        (err, result) => {
                          if (err) {
                            console.log(err);
                            return;
                          }
                          console.log(
                            employee + " has been sucessfully updated!"
                          );
                          optionsScreen();
                        }
                      );
                    }
                  );
                });
            }
          );
        });
    }
  );
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


