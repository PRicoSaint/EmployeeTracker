
-- Show employee joined with role
SELECT
employee.first_name, employee.last_name,
current_role.title, current_role.salary
FROM employee JOIN
current_role ON employee.current_role_id = current_role.id;


-- Show all tables joined together
SELECT employee.first_name AS First, employee.last_name AS Last, current_role.title AS Title, current_role.salary AS Salary, department.department_name AS Department FROM employee JOIN current_role ON employee.current_role_id = current_role.id JOIN department ON current_role.department_id = department.id;

-- Show role joined with department
SELECT current_role.title, current_role.salary, department.department_name FROM current_role JOIN department ON current_role.department_id = department.id;

-- Update employee with new role
UPDATE employee
        INNER JOIN
    current_role ON employee.current_role_id = current_role.id 
SET 
    title = "Agent"
WHERE first_name = "Cyril";     

-- Obtain ID from role to use to update one in employee TABLE
SELECT id FROM current_role WHERE title = "Comptroller";