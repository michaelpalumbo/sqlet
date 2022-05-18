const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');


// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // Your MySQL username,
      user: 'root',
      // Your MySQL password
      password: '',
      database: 'mybusiness'
    },
    console.log('Connected to the mybusiness database.')
  );

function firstPrompt(){
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'userAction',
                message: 'What do you want to do next?',
                choices: [
                    'view all departments', 'view all roles', 'view all employees', new inquirer.Separator(), 'add a department', 'add a role', 'add an employee', 'update an employee role'
                ],
            }
        ])
        
        .then((answers) => {
            console.log(answers.userAction)
            switch(answers.userAction){
                case 'view all departments':
                    db.query(`SELECT * FROM departments`, (err, rows) => {
                        console.table(rows);
                        firstPrompt();
                    });
                    
                break
                case 'view all roles':
                    db.query(`SELECT * FROM roles`, (err, rows) => {
                        console.table(rows);
                        firstPrompt();
                    });
                break
                case 'view all employees':
                    db.query(`SELECT * FROM employees`, (err, rows) => {
                        console.table(rows);
                        firstPrompt();
                    });
                break
                case 'add a department':
                    addDepartment();
                break
                case 'add a role':
                    addRole();
                break
                case 'add an employee':
        
                break
                case 'update an employee role':
        
                break

            }
        })
        .catch((error) => {
            if (error.isTtyError) {
            // Prompt couldn't be rendered in the current environment
            } else {
            // Something else went wrong
            }
    });
}

function addRole(){
    let currentRoles = []
    db.query(`SELECT * FROM departments`, (err, rows) => {
        for(i=0;i<rows.length;i++){
            currentRoles.push(rows[i].name)
        }
        
    
        inquirer.prompt([
 
            {
                type: 'input',
                name: 'jobtitle',
                message: "What is the name of this new role?",
            },
            {
                type: 'list',
                name: 'department',
                message: 'Which department does this belong to?',
                choices: currentRoles
            },
            {
                type: 'input',
                name: 'salary',
                message: "What is the salary of this role?",
            }

        ]).then((answers) => {
            // add role to roles table in mysql2
            db.query('INSERT INTO roles (jobtitle, department, salary) VALUES (?,?,?)', [answers.jobtitle, answers.department, answers.salary],(error, 
      results) => {
            if (error) return res.json({ error: error });
                if(results){
                    db.query(`SELECT * FROM roles`, (err, rows) => {
                        console.table(rows);
                        firstPrompt();
                    });
                }
            });
        });
    });
}

function addDepartment(){

    inquirer.prompt([
        {
            type: 'input',
            name: 'departmentName',
            message: "What is the name of the department?",
        }
    ]).then((answers) => {
        // need to add department to departments table in mysql2
        db.query('INSERT INTO departments (name) VALUES (?)', [answers.departmentName],(error, 
  results) => {
        if (error) return res.json({ error: error });
            if(results){
                db.query(`SELECT * FROM departments`, (err, rows) => {
                    console.table(rows);
                    firstPrompt();
                });
            }
        });
    });
}

firstPrompt();