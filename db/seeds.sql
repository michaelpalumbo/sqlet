INSERT INTO departments (name)

VALUES
    ('executive'),
    ('accounting'),
    ('shipping'),
    ('sales');


INSERT INTO roles (jobtitle, department, salary)

VALUES
    ('owner', 'executive', '$120,000'),
    ('manager', 'accounting', '$90,000'),
    ('manager', 'shipping', '$80,000'),
    ('manager', 'sales', '$110,000'),
    ('accountant', 'accounting', '$75,000'),
    ('clerk', 'shipping', '$65,000'),
    ('associate', 'sales', '$80,000');

INSERT INTO employees (firstname, lastname, jobtitle, department, salary, manager)

VALUES
    ('homer', 'simpson', 'owner', 'executive', '$120,000', 'n/a'),
    ('bart', 'simpson', 'manager', 'shipping', '$80,000', 'homer simpson'),
    ('lisa', 'simpson', 'manager', 'accounting', '$90,000', 'homer simpson'),
    ('marge', 'simpson', 'manager', 'sales', '$110,000', 'homer simpson'),
    ('barney', 'gumbal', 'clerk', 'shipping', '$65,000', 'bart simpson'),
    ('moe', 'szyzlak', 'accountant', 'accounting', '$75,000', 'lisa simpson'),
    ('seymour', 'skinner', 'associate', 'sales', '$80,000', 'marge simpson');
