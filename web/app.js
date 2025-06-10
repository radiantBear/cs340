// Application logic javascript file

// Citation for the following functions:
// Date: 05/20/2025
// Adapted from Exploration - Web Application Technology and Exploration - Implementing CUD operations in your app
// Source URL: https://oregonstate.instructure.com/courses/1999601/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25352968
// Source URL: https://oregonstate.instructure.com/courses/1999601/pages/exploration-web-application-technology-2

// Initial setup
require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const handle = require('./handlers');
const Handlebars = require('handlebars');

app.engine('.hbs', require('express-handlebars').engine({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');

Handlebars.registerHelper('formatDateForInput', (date) => {
    return date.toISOString().split('T')[0]
});

Handlebars.registerHelper('eq', (a, b) => {
    return a === b;
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get('/', handle.getRootHTML);
app.get('/employees', handle.getEmployeesHTML);
app.get('/services', handle.getServicesHTML);
app.get('/customers', handle.getCustomersHTML);
app.get('/invoices', handle.getInvoicesHTML);
app.get('/appointments', handle.getAppointmentsHTML);
app.get('/appointments/new', handle.getNewAppointmentHTML);
app.get('/appointments/:id', handle.getEditAppointmentHTML);

app.post('/resetDb', handle.resetDb);

app.post('/appointments/:appointmentId/service', handle.addAppointmentService);
app.patch('/appointments/:appointmentId/service/:oldServiceId', handle.updateAppointmentService);
app.delete('/appointments/:appointmentId/services/:serviceId', handle.deleteAppointmentService);

app.use('/static', express.static('static'));

app.listen(port, () => {
    console.log("Server is listening on port", port);
});