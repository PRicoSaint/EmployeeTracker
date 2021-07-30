-- This file sets up the database and 3 base tables needed for db to function
DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department(
    id INT NOT NULL AUTO_INCREMENT,
   department_name VARCHAR(30),
   PRIMARY KEY(id)
);

CREATE TABLE current_role (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY (department_id)
    REFERENCES department(id)
    ON UPDATE CASCADE,
    PRIMARY KEY(id)
    
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  current_role_id INT,
  manager_id INT,
  FOREIGN KEY (current_role_id)
  REFERENCES current_role(id)
  ON UPDATE CASCADE,
  PRIMARY KEY(id)

);


