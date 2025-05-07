require('dotenv').config();
const app = require('express')();
const port = process.env.PORT || 3000;

app.engine('handlebars', require('express-handlebars').engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');


app.get('/', (_, res) => {
    res.status(200).render('index');
});

app.get('*', (_, res) => {
    res.status(404).render('404');
});


app.listen(port, () => {
    console.log("Server is listening on port", port);
});