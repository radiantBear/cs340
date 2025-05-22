// Citation for the following functions:
// Date: 05/20/2025
// Adapted from Exploration - Web Application Technology and Exploration - Implementing CUD operations in your app
// Source URL: https://oregonstate.instructure.com/courses/1999601/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25352968
// Source URL: https://oregonstate.instructure.com/courses/1999601/pages/exploration-web-application-technology-2

require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const db = require('./database/db-connector');
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
app.delete('/appointments/:appointmentId/services/:serviceId', );

app.use('/static', express.static('static'));

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