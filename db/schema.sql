CREATE TABLE departments (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,                            
    name VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,                            
    jobtitle VARCHAR(30) NOT NULL,
    department VARCHAR(30) NOT NULL,
    salary VARCHAR(30) NOT NULL
);

CREATE TABLE employees (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(30) NOT NULL,
    lastname VARCHAR(30) NOT NULL,
    jobtitle VARCHAR(30) NOT NULL,
    department VARCHAR(30) NOT NULL,
    salary VARCHAR(30) NOT NULL,
    manager VARCHAR(30) NOT NULL
);