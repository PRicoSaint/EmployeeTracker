USE employee_db;
-- Use join to show the corresponding value for the foreign key id
INSERT INTO department (department_name)
VALUES ("Field Ops"),
        ("Owner"),
        ("Human Resources"),
        ("Applied Research"),
        ("Accounting"),
        ("Servant");
        
INSERT INTO current_role (title, salary, department_id)
VALUES ("Agent", 120000, 1),
        ("Secretary", 50000, 3),
        ("HR Director", 60000, 3),
        ("Comptroller", 70000, 5),
        ("Head of ISIS", 500000, 2),
        ("Head of Applied Research", 80000, 4),
        ("British valet", 10000, 6);

INSERT INTO employee (first_name, last_name,current_role_id, manager_id)
VALUES ("Sterling", "Archer",1, 2),
        ("Malory", "Archer",5, 0),
        ("Lana", "Kane", 1, 2),
        ("Cyril","Figgis",4, 2),
        ("Cheryl","Tunt",2, 2),
        ("Pam", "Poovey",3, 2),
        ("Algernop", "Krieger",6, 2),
        ("Raymond", "Gillete",1, 2),
        ("Arthur", "Woodhouse",7, 1);


