require('dotenv').config();
const app = require('express')();
const port = process.env.PORT || 3000;
const db = require('./database/db-connector');

app.engine('.hbs', require('express-handlebars').engine({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');


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