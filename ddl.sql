CREATE TABLE Employees (
    employeeId int PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    phone CHAR(10) NOT NULL,
    email VARCHAR(255) NOT NULL
);

CREATE TABLE Services (
    serviceId int PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

CREATE TABLE Customers (
    customerId int PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    phone CHAR(10) NOT NULL,
    email VARCHAR(255) NOT NULL,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    zipCode int NOT NULL,
    currentCustomer BOOLEAN NOT NULL
);

CREATE TABLE Appointments (
    appointmentId int PRIMARY KEY AUTO_INCREMENT,
    employeeId int NOT NULL,
    customerId int NOT NULL,
    appointmentDate DATE NOT NULL,
    status VARCHAR(255) NOT NULL,
    notes TEXT NULL,

    FOREIGN KEY (customerId) REFERENCES Customers(customerId),
    FOREIGN KEY (employeeId) REFERENCES Employees(employeeId)
);

CREATE TABLE AppointmentServices (
    serviceId int NOT NULL,
    appointmentId int NOT NULL,

    PRIMARY KEY (serviceId, appointmentId),
    FOREIGN KEY (appointmentId) REFERENCES Appointments(appointmentId),
    FOREIGN KEY (serviceId) REFERENCES Services(serviceId)
);

CREATE TABLE Invoices (
    invoiceId int PRIMARY KEY,
    date DATE NOT NULL,
    totalCost DECIMAL(10, 2) NOT NULL,
    elapsedTime TIME NOT NULL,

    FOREIGN KEY (invoiceId) REFERENCES Appointments(appointmentId)
);


-------------------------------------- Sample Data --------------------------------------

INSERT INTO Employees (
    name, phone, email
)
VALUES 
("Jack Johnson", "1111111111", "jack.johnson@fake.com"),
("Emilio Riveras", "2222222222", "emilio.riveras@fake.com"),
("Patrick Fisher", "3333333333", "patrick.fisher@fake.com"),
("Juan Alvarez", "4444444444", "juan.alvarez@fake.com"),
("Jacob Holden", "5555555555", "jacob.holden@fake.com");

INSERT INTO Customers (
    name, phone, email, street, city, state, zipCode, currentCustomer
)
VALUES 
("Julie Morales", "6666666666", "julie.morales@fake.com", "1111 first street", "Mckinney", "Texas", 11111, 1),
("Jose Vasquez", "7777777777", "jose.vasquez@fake.com", "2222 second street", "Allen", "Texas", 22222, 0),
("Karen Blair", "8888888888", "karen.blair@fake.com", "3333 third street", "Plano", "Texas", 33333, 1),
("Maria Gomez", "9999999999", "maria.gomez@fake.com", "4444 fourth street", "Mckinney", "Texas", 44444, 0),
("John Baker", "1234567890", "john.baker@fake.com", "5555 fifth street", "Mckinney", "Texas", 55555, 1);

INSERT INTO Services (
    name, description, price
)
VALUES 
("Lawn Mowing", "Mowing front and back yard", "50"),
("Tree Pruning", "Shaping trees with careful pruning", "55"),
("Weed Control", "Applying herbicides lawns to keep weeds at bay", "45"),
("Lawn Fertilizing", "Applying fertilizer to lawns to promote growth", "40"),
("Garden Bed Clean Up", "Removing dead plants, leaves and weeds and applying a new layer of mulch", "30");

INSERT INTO Appointments (
    employeeId, customerId, appointmentDate, status, notes
)
VALUES 
(1, 2, "2025-01-25", "Completed", "Customer was very happy"),
(2, 3, "2025-02-11", "Completed", "Customer was dissatisfied"),
(4, 5, "2025-03-13", "Completed", NULL),
(3, 4, "2025-05-30", "Scheduled", NULL),
(2, 1, "2025-03-23", "Canceled", "Customer went on vacation");

INSERT INTO AppointmentServices (
    appointmentId, serviceId
)
VALUES 
(1, 1),
(1, 4),
(2, 2),
(3, 5),
(4, 3);


INSERT INTO Invoices (
    invoiceId, date, totalCost, elapsedTime
)
VALUES 
(1, "2025-01-25", "90", "01:30:00"),
(2, "2025-02-11", "55", "00:45:00"),
(3, "2025-03-13", "30", "00:33:00");
