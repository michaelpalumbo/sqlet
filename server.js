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

let currentManagers = []
let currentDepartments = []
let currentRoles = []
let currentEmployees = []

// this data is accessed by inquirer's prompts, so need to update it prior to running each prompt
function updateDepartments(){
    return new Promise(() => db.query(`SELECT * FROM departments`, (err, rows) => {
        for(i=0;i<rows.length;i++){
            currentDepartments.push(rows[i].name)
        }
        return currentDepartments
    }))
}

function updateManagers(){
    return new Promise(() => db.query(`SELECT * FROM employees`, (err, rows) => {
        for(i=0;i<rows.length;i++){
            if(rows[i].jobtitle === 'manager' || rows[i].jobtitle === 'executive'){
                let fullName = rows[i].firstname + ' ' + rows[i].lastname
                currentManagers.push(fullName)
            }            
        }
        return currentManagers
    }))   
}

function updateRoles(){
    return new Promise(() => db.query(`SELECT * FROM roles`, (err, rows) => {
        for(i=0;i<rows.length;i++){
            if(!currentRoles.includes(rows[i].jobtitle)){               
                currentRoles.push(rows[i].jobtitle)
            }
        }
        return currentRoles

    }))   
}

function updateEmployees(){
    return new Promise(() => db.query(`SELECT * FROM employees`, (err, rows) => {
        for(i=0;i<rows.length;i++){
            let fullName = rows[i].firstname + ' ' + rows[i].lastname                
            currentEmployees.push(fullName)
        }
        return currentEmployees

    }))   
}

// found this code pattern for async functions at https://stackoverflow.com/questions/41292316/how-do-i-await-multiple-promises-in-parallel-without-fail-fast-behavior & https://stackoverflow.com/questions/43302584/why-doesnt-the-code-after-await-run-right-away-isnt-it-supposed-to-be-non-blo
async function update(){
    currentDepartments = []
    currentManagers = []
    currentRoles = []
    currentEmployees = []

    try {
        let [data1, data2, data3, data4] = await Promise.all([
            updateDepartments(),
            updateManagers(),
            updateRoles(),
            updateEmployees()
        ])
      } catch (ex) {
        return ex;
    }
}





function firstPrompt(){
    // since this function gets called after every subsequent prompt, update the arrays which the prompts read from
    update();
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
                    addEmployee()
                break
                case 'update an employee role':
                    updateEmployee()
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
  res) => {
        if (error) {console.log(error)};
            if(res){
                db.query(`SELECT * FROM departments`, (err, rows) => {
                    console.table(rows);
                    firstPrompt();
                });
            }
        });
    });
}

function addRole(){
        
    
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
                choices: currentDepartments
            },
            {
                type: 'input',
                name: 'salary',
                message: "What is the salary of this role?",
            }

        ]).then((answers) => {
            // add role to roles table in mysql2
            db.query('INSERT INTO roles (jobtitle, department, salary) VALUES (?,?,?)', [answers.jobtitle, answers.department, answers.salary],(error, 
      res) => {
            if (error) {console.log(error)};
                if(res){
                    db.query(`SELECT * FROM roles`, (err, rows) => {
                        console.table(rows);
                        firstPrompt();
                    });
                }
            });
        });
}

function addEmployee(){
    inquirer.prompt([

        {
            type: 'input',
            name: 'firstname',
            message: "What is this employee's first name?",
        },
        {
            type: 'input',
            name: 'lastname',
            message: "What is this employee's last name?",
        },
        {
            type: 'list',
            name: 'jobtitle',
            message: "What is this employee's job title?",
            choices: currentRoles
        },
        {
            type: 'list',
            name: 'department',
            message: 'Which department does this belong to?',
            choices: currentDepartments
        },
        {
            type: 'input',
            name: 'salary',
            message: "What is this employee's salary?",
        },
        {
            type: 'list',
            name: 'manager',
            message: "What is the name of this employee's manager?",
            choices: currentManagers
        },
    
    
    ]).then((answers) => {
        console.log(answers)
        // add role to roles table in mysql2
        db.query('INSERT INTO employees (firstname, lastname, jobtitle, department, salary, manager) VALUES (?,?,?,?,?,?)', [answers.firstname, answers.lastname, answers.jobtitle, answers.department, answers.salary, answers.manager],(error, 
    res) => {
        if (error) {
            console.log(error)
        };
            if(res){
                db.query(`SELECT * FROM employees`, (err, rows) => {
                    console.table(rows);
                    firstPrompt();
                });
            }
        });
    });    
}

function updateEmployee(){
    inquirer.prompt([
        {
            type: 'list',
            name: 'name',
            message: "Which employee do you want to update?",
            choices: currentEmployees
        },
        {
            type: 'list',
            name: 'jobtitle',
            message: 'Which role do you want to assign them?',
            choices: currentRoles
        }
    
    ]).then((answers) => {
        let tableIndex = currentEmployees.indexOf(answers.name)+1
        
        let firstName = answers.name.split(' ')[0]
        let lastName = answers.name.split(' ')[1]

        // add role to roles table in mysql2
            db.query(`UPDATE employees set jobtitle =? WHERE id = ?`, [answers.jobtitle, tableIndex], function(err, result) {
                console.log("Record Updated!!");
                console.log(result);
                db.query(`SELECT * FROM employees`, (err, rows) => {
                    console.table(rows);
                    firstPrompt();
                });
        })
    //     db.query('INSERT INTO employees (firstname, lastname, jobtitle, department, salary, manager) VALUES (?,?,?,?,?,?)', [answers.firstname, answers.lastname, answers.jobtitle, answers.department, answers.salary, answers.manager],(error, 
    // res) => {
    //     if (error) {
    //         console.log(error)
    //     };
    //         if(res){
    //             db.query(`SELECT * FROM employees`, (err, rows) => {
    //                 console.table(rows);
    //                 firstPrompt();
    //             });
    //         }
    //     });
    });    
}
firstPrompt();