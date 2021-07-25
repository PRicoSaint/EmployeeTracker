USE employee_db;

INSERT INTO department (department_name)
VALUES ("Field Ops"),
        ("Owner"),
        ("Human Resources"),
        ("Applied Research"),
        ("Accounting"),
        ("Servant");
        
INSERT INTO current_role (title, salary)
VALUES ("Agent", 120000),
        ("Secretary", 50000),
        ("HR Director", 60000),
        ("Comptroller", 70000),
        ("Head of ISIS", 500000),
        ("Head of Applied Research", 80000),
        ("British valet", 10000);

INSERT INTO employee (first_name, last_name,manager_id)
VALUES ("Sterling", "Archer", 1),
        ("Malory", "Archer", 0),
        ("Lana", "Kane", 1),
        ("Cyril","Figgis", 1),
        ("Cheryl","Tunt", 1),
        ("Pam", "Poovey", 1),
        ("Algernop", "Krieger", 1),
        ("Raymond", "Gillete", 1),
        ("Arthur", "Woodhouse", 2);


