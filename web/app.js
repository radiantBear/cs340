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
    console.log(a, b)
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
    console.log(appointment);
    res.status(200).render('appointment_input', { employees, customers, services, appointment, newAppointment: false });
});

app.listen(port, () => {
    console.log("Server is listening on port", port);
});