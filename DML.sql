-- Data Manipulation Queries
-- Using the @ symbol to denote variables that will have data from the backend

-- get all data for every employee for the Employees page
SELECT * FROM employees;

-- get all data for every customer for the Customers page
SELECT * FROM customers;

-- get all data for every invoice for the Invoices page
SELECT * FROM invoices;

-- get all data for every service for the Services page
SELECT * FROM services;

-- get all services id and name for the dynamic drop down
SELECT serviceId, name FROM services;

-- get all data for every appointment
SELECT employees.name AS Employee, customers.name AS Customer, appointments.appointmentDate, appointments.status, appointments.notes 
	FROM appointments
		INNER JOIN customers ON customers.customerId = appointments.customerId
		INNER JOIN employees ON employees.employeeId = appointments.employeeId;
        
-- get all services requested for a specific appointment
SELECT services.serviceId, services.name AS service, services.description, services.price
	FROM appointmentservices
		INNER JOIN services ON services.serviceId = appointmentservices.serviceId
        WHERE appointmentservices.appointmentId = @appointmentId_passed_from_appointment_form;
        
-- get data for all appointments including services requested for Appointments page
SELECT 
	a.appointmentId,
	e.name AS employeeName,
	c.name AS customerName,
	a.appointmentDate,
	a.status,
	a.notes,
	GROUP_CONCAT(s.name ORDER BY s.name SEPARATOR ', ') AS servicesRequested
	FROM Appointments a
        JOIN Employees e ON a.employeeId = e.employeeId
        JOIN Customers c ON a.customerId = c.customerId
        LEFT JOIN AppointmentServices aps ON a.appointmentId = aps.appointmentId
        LEFT JOIN Services s ON aps.serviceId = s.serviceId
	GROUP BY a.appointmentId, e.name, c.name, a.appointmentDate, a.status, a.notes
	ORDER BY a.appointmentDate ASC;

-- insert a new service being requested for an appointment
INSERT INTO appointmentServices ( serviceId, appointmentId ) 
	VALUES (@serviceId_from_dropdown_input, @appointmentId_passed_from_appointment_form);
    
-- update a service being requested for an appointment
UPDATE appointmentServices 
	SET serviceId = @new_serviceId_from_dropdown_input  
    WHERE appointmentId = @appointmentId_passed_from_appointment_form
		AND serviceId = @old_serviceId_passed_from_appointment_form;

-- delete a service from a specific appointment
DELETE FROM appointmentservices
	WHERE appointmentId = @appointmentId_passed_from_appointment_form
		AND serviceId = @serviceId_passed_from_appointment_form