// Javascript file that handles communication between the database

// Citation for the following functions:
// Date: 05/20/2025
// Adapted from Exploration - Web Application Technology and Exploration - Implementing CUD operations in your app
// Source URL: https://oregonstate.instructure.com/courses/1999601/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25352968
// Source URL: https://oregonstate.instructure.com/courses/1999601/pages/exploration-web-application-technology-2


const db = require('./database/db-connector');


function getRootHTML(_, res) {
    res.status(200).render('index');
}

async function getEmployeesHTML(_, res) {
    const [employees] = await db.execute('SELECT * FROM Employees;');
    res.status(200).render('employees', { employees });
}

async function getServicesHTML(_, res) {
    const [services] = await db.execute('SELECT * FROM Services;');
    res.status(200).render('services', { services });
}

async function getCustomersHTML(_, res) {
    const [customers] = await db.execute('SELECT * FROM Customers;');
    res.status(200).render('customers', { customers });
}

async function getInvoicesHTML(_, res) {
    const [invoices] = await db.execute('SELECT * FROM Invoices;');
    res.status(200).render('invoices', { invoices });
}

async function getAppointmentsHTML(_, res) {
    const [appointments] = await db.execute(`
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
    `);

    res.status(200).render('appointments', { appointments });
}

async function getNewAppointmentHTML(_, res) {
    const [employees] = await db.execute('SELECT * FROM Employees;');
    const [customers] = await db.execute('SELECT * FROM Customers;');
    const [services] = await db.execute('SELECT * FROM Services;');

    res.status(200).render('appointment_input', { employees, customers, services, newAppointment: true });
}

async function getEditAppointmentHTML (req, res) {
    const [employees] = await db.execute('SELECT * FROM Employees;');
    const [customers] = await db.execute('SELECT * FROM Customers;');
    const [services] = await db.execute('SELECT * FROM Services;');

    const [[appointment]] = await db.execute('SELECT * FROM Appointments WHERE appointmentId = ?;', [req.params.id]);
    const [selectedServices] = await db.execute('SELECT serviceId FROM AppointmentServices WHERE appointmentId = ?;', [req.params.id]);
    res.status(200).render('appointment_input', { employees, customers, services, appointment, selectedServices, newAppointment: false });
}

async function resetDb(_, res) {
  try {
    await db.query('CALL sp_LoadGreenscapesDb();');
    console.log('Database was reset');

    res.redirect('/');
  } catch (error) {
    console.error('Error resetting database:', error);
    res.status(500).send('Failed to reset database.');
  }
}

async function addAppointmentService (req, res) {
    try {
        const { appointmentId } = req.params;
        let data = req.body;

        if (isNaN(parseInt(data.newServiceId)))
            data.newServiceId = null;

        const query1 = `CALL sp_InsertAppointmentService(?, ?, @resultStatus);`;

        const [rows] = await db.query(query1, [
            data.newServiceId,
            appointmentId
        ]);

        if (rows.affectedRows == 1)
            console.log('Service was successfully added');
        else 
            console.log('Service failed to be added');

        res.redirect(`/appointments/${appointmentId}`);
    } catch (error) {
        console.error('Error executing queries:', error);
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
}

async function updateAppointmentService(req, res) {
    try {
        const { appointmentId, oldServiceId } = req.params;
        let data = req.body;

        if (isNaN(parseInt(data.newServiceId)))
            data.newServiceId = null;

        const query1 = 'CALL sp_UpdateAppointmentService(?, ?, ?, @resultStatus);';
        const [rows] = await db.query(query1, [
            oldServiceId,
            data.newServiceId,
            appointmentId
        ]);
        
        if (rows.affectedRows == 1)
            console.log(`Service was successfully updated `);
        else 
            console.log(`Service failed to be updated`);
    } catch (error) {
        console.error('Error executing queries:', error);
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
}

async function deleteAppointmentService(req, res) {
    try {
        const { appointmentId, serviceId } = req.params;

        const query1 = `CALL sp_DeleteAppointmentService(?, ?, @resultStatus);`;
        const [result] = await db.query(query1, [
            parseInt(appointmentId),
            parseInt(serviceId)
        ]);

        if (result.affectedRows == 1)
            res.status(200).send('Service was successfully deleted');
        else 
            res.status(500).send('Service failed to be deleted');
        
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
}

module.exports = {
    getRootHTML,
    getEmployeesHTML,
    getServicesHTML,
    getCustomersHTML,
    getInvoicesHTML,
    getAppointmentsHTML,
    getNewAppointmentHTML,
    getEditAppointmentHTML,
    resetDb,
    addAppointmentService,
    updateAppointmentService,
    deleteAppointmentService
}