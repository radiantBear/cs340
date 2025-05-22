require('dotenv').config();
const app = require('express')();
const port = process.env.PORT || 3000;
const db = require('./database/db-connector');
const Handlebars = require('handlebars');

app.engine('.hbs', require('express-handlebars').engine({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');

Handlebars.registerHelper('formatDateForInput', (date) => {
    return date.toISOString().split('T')[0]
});

Handlebars.registerHelper('eq', (a, b) => {
    return a === b;
});

app.get('/', (_, res) => {
    res.status(200).render('index');
});

app.get('/employees', async (_, res) => {
    const [employees] = await db.execute('SELECT * FROM Employees;');
    res.status(200).render('employees', { employees });
});

app.get('/services', async (_, res) => {
    const [services] = await db.execute('SELECT * FROM Services;');
    res.status(200).render('services', { services });
});

app.get('/customers', async (_, res) => {
    const [customers] = await db.execute('SELECT * FROM Customers;');
    res.status(200).render('customers', { customers });
});

app.get('/invoices', async (_, res) => {
    const [invoices] = await db.execute('SELECT * FROM Invoices;');
    res.status(200).render('invoices', { invoices });
});

app.get('/appointments', async (_, res) => {
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
});

app.get('/appointments/new', async (_, res) => {
    const [employees] = await db.execute('SELECT * FROM Employees;');
    const [customers] = await db.execute('SELECT * FROM Customers;');
    const [services] = await db.execute('SELECT * FROM Services;');

    res.status(200).render('appointment_input', { employees, customers, services, newAppointment: true });
});

app.get('/appointments/:id', async (req, res) => {
    const [employees] = await db.execute('SELECT * FROM Employees;');
    const [customers] = await db.execute('SELECT * FROM Customers;');
    const [services] = await db.execute('SELECT * FROM Services;');

    const [[appointment]] = await db.execute('SELECT * FROM Appointments WHERE appointmentId = ?;', [req.params.id]);
    const [selectedServices] = await db.execute('SELECT serviceId FROM AppointmentServices WHERE appointmentId = ?;', [req.params.id]);
    res.status(200).render('appointment_input', { employees, customers, services, appointment, selectedServices, newAppointment: false });
});

app.post('/resetDb', async (req, res) => {
  try {
    await db.query('CALL sp_LoadGreenscapesDb();');
    console.log('Database was reset');

    res.redirect('/');
  } catch (error) {
    console.error('Error resetting database:', error);
    res.status(500).send('Failed to reset database.');
  }
});

app.post('/appointments/:appointmentId/addservice', async function (req, res) {
    try {
        const { appointmentId } = req.params;
        let data = req.body;

        if (isNaN(parseInt(data.newServiceId)))
            data.newServiceId = null;

        const query1 = `CALL sp_InsertAppointmentService(?, ?, @resultStatus);`;

        const [[[rows]]] = await db.query(query1, [
            data.newServiceId,
            appointmentId
        ]);

        if (rows.resultStatus == 1)
            console.log(`Service was successfully added `
            );
        else console.log(`Service failed to be added`);

        res.redirect(`/appointments/${appointmentId}`);
    } catch (error) {
        console.error('Error executing queries:', error);
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.post('/appointments/:appointmentId/updateservice/:oldServiceId', async function (req, res) {
    try {
        const { appointmentId, oldServiceId } = req.params;
        let data = req.body;

        if (isNaN(parseInt(data.newServiceId)))
            data.newServiceId = null;

        const query1 = 'CALL sp_UpdateAppointmentService(?, ?, ?, @resultStatus);';
        const [[[rows]]] = await db.query(query1, [
            oldServiceId,
            data.newServiceId,
            appointmentId
        ]);
        
        if (rows.resultStatus == 1)
            console.log(`Service was successfully updated `
            );
        else console.log(`Service failed to be updated`);

        res.redirect(`/appointments/${appointmentId}`);
    } catch (error) {
        console.error('Error executing queries:', error);
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.post('/appointments/:appointmentId/deleteservice/:serviceId', async function (req, res) {
    try {
        const { appointmentId, serviceId } = req.params;

        const query1 = `CALL sp_DeleteAppointmentService(?, ?, @resultStatus);`;
        const [[[rows]]] = await db.query(query1, [
            appointmentId,
            serviceId
        ]);

        if (rows.resultStatus == 1)
            console.log(`Service was successfully deleted `
            );
        else console.log(`Service failed to be deleted`);

        // Redirect the user to the updated webpage data
        res.redirect(`/appointments/${appointmentId}`);
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.listen(port, () => {
    console.log("Server is listening on port", port);
});