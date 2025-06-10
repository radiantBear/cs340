-- CS340 Portfolio Project - Data Definition Queries
-- This sql file contains the Data Definition queries in the form of a stored procedure that is also used to reset the database.
-- Creates the Employees, Services, Customers, Appointments, AppointmentServices, and Invoice tables and populates them with sample data.

-- # Citation for the following stored procedure:
-- # Date: 05/20/2025
-- # Adapted from Exploration - Implementing CUD operations in your app
-- # Source URL: https://oregonstate.instructure.com/courses/1999601/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25352968

DROP PROCEDURE IF EXISTS sp_LoadGreenscapesDb;
DELIMITER //
CREATE PROCEDURE sp_LoadGreenscapesDb()
BEGIN
	SET FOREIGN_KEY_CHECKS=0;
    
-- #############################
-- CREATE TABLES
-- #############################

	DROP TABLE IF EXISTS Employees;
	CREATE TABLE Employees (
		employeeId int PRIMARY KEY AUTO_INCREMENT,
		name VARCHAR(255) NOT NULL,
		phone CHAR(10) NOT NULL,
		email VARCHAR(255) NOT NULL
	);
	
	DROP TABLE IF EXISTS Services;
	CREATE TABLE Services (
		serviceId int PRIMARY KEY AUTO_INCREMENT,
		name VARCHAR(255) NOT NULL,
		description VARCHAR(255) NOT NULL,
		price DECIMAL(10, 2) NOT NULL
	);
	
	DROP TABLE IF EXISTS Customers;
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
	
	DROP TABLE IF EXISTS Appointments;
	CREATE TABLE Appointments (
		appointmentId int PRIMARY KEY AUTO_INCREMENT,
		employeeId int NOT NULL,
		customerId int NOT NULL,
		appointmentDate DATE NOT NULL,
		status VARCHAR(255) NOT NULL,
		notes TEXT NULL,
		CONSTRAINT `fk-customerId`
			FOREIGN KEY (customerId)
            REFERENCES Customers(customerId)
            ON DELETE CASCADE,
		CONSTRAINT `fk-employeeId`
			FOREIGN KEY (employeeId)
            REFERENCES Employees(employeeId)
            ON DELETE CASCADE
	);
	
	DROP TABLE IF EXISTS AppointmentServices;
	CREATE TABLE AppointmentServices (
		serviceId int NOT NULL,
		appointmentId int NOT NULL,
	
		PRIMARY KEY (serviceId, appointmentId),
        CONSTRAINT `fk-appointmentId`
			FOREIGN KEY (appointmentId)
            REFERENCES Appointments(appointmentId)
            ON DELETE CASCADE,
		CONSTRAINT `fk-serviceId`
			FOREIGN KEY (serviceId)
            REFERENCES Services(serviceId)
            ON DELETE CASCADE
	);
	
	DROP TABLE IF EXISTS Invoices;
	CREATE TABLE Invoices (
		invoiceId int PRIMARY KEY,
		date DATE NOT NULL,
		totalCost DECIMAL(10, 2) NOT NULL,
		elapsedTime TIME NOT NULL,
        
		CONSTRAINT `fk-invoiceId`
			FOREIGN KEY (invoiceId)
			REFERENCES Appointments(appointmentId)
			ON DELETE CASCADE
	);
	
-- #############################
-- SAMPLE DATA
-- #############################
    
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
	("Maria Gomez", "9999999999", "maria.gomez@fake.com", "4444 fourth street", "Dallas", "Texas", 44444, 0),
	("John Baker", "1234567890", "john.baker@fake.com", "5555 fifth street", "Mckinney", "Texas", 11111, 1);
	
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
	(
		(SELECT employeeId FROM Employees WHERE name = 'Jack Johnson'),
		(SELECT customerId FROM Customers WHERE name = 'Jose Vasquez'),
		'2025-01-25', 'Completed', 'Customer was very happy'
	),
	(
		(SELECT employeeId FROM Employees WHERE name = 'Emilio Riveras'),
		(SELECT customerId FROM Customers WHERE name = 'Karen Blair'),
		'2025-02-11', 'Completed', 'Customer was dissatisfied'
	),
	(
		(SELECT employeeId FROM Employees WHERE name = 'Juan Alvarez'),
		(SELECT customerId FROM Customers WHERE name = 'John Baker'),
		'2025-03-13', 'Completed', NULL
	),
	(
		(SELECT employeeId FROM Employees WHERE name = 'Patrick Fisher'),
		(SELECT customerId FROM Customers WHERE name = 'Maria Gomez'),
		'2025-05-30', 'Scheduled', NULL
	),
	(
		(SELECT employeeId FROM Employees WHERE name = 'Emilio Riveras'),
		(SELECT customerId FROM Customers WHERE name = 'Julie Morales'),
		'2025-03-23', 'Canceled', 'Customer went on vacation'
	);
	
	INSERT INTO AppointmentServices (
		appointmentId, serviceId
	)
	VALUES 
	(
		(SELECT A.appointmentId
		FROM Appointments A
		JOIN Customers C ON A.customerId = C.customerId
		WHERE C.name = 'Jose Vasquez' AND A.appointmentDate = '2025-01-25'),
		(SELECT serviceId FROM Services WHERE name = 'Lawn Mowing')
	),
	(
		(SELECT A.appointmentId
		FROM Appointments A
		JOIN Customers C ON A.customerId = C.customerId
		WHERE C.name = 'Jose Vasquez' AND A.appointmentDate = '2025-01-25'),
		(SELECT serviceId FROM Services WHERE name = 'Lawn Fertilizing')
	),
	(
		(SELECT A.appointmentId
		FROM Appointments A
		JOIN Customers C ON A.customerId = C.customerId
		WHERE C.name = 'Karen Blair' AND A.appointmentDate = '2025-02-11'),
		(SELECT serviceId FROM Services WHERE name = 'Tree Pruning')
	),
	(
		(SELECT A.appointmentId
		FROM Appointments A
		JOIN Customers C ON A.customerId = C.customerId
		WHERE C.name = 'John Baker' AND A.appointmentDate = '2025-03-13'),
		(SELECT serviceId FROM Services WHERE name = 'Garden Bed Clean Up')
	),
	(
		(SELECT A.appointmentId
		FROM Appointments A
		JOIN Customers C ON A.customerId = C.customerId
		WHERE C.name = 'Maria Gomez' AND A.appointmentDate = '2025-05-30'),
		(SELECT serviceId FROM Services WHERE name = 'Weed Control')
	);
	
	
	INSERT INTO Invoices (
		invoiceId, date, totalCost, elapsedTime
	)
	VALUES 
	(1, "2025-01-25", "90", "01:30:00"),
	(2, "2025-02-11", "55", "00:45:00"),
	(3, "2025-03-13", "30", "00:33:00");
	
    SET FOREIGN_KEY_CHECKS=1;
END //

DELIMITER ;

CALL sp_LoadGreenscapesDb;