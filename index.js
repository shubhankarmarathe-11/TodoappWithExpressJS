const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const session = require('express-session')
const exphbs  = require('express-handlebars');
// const flash = require('express-flash-message')
const flash = require('connect-flash');

const app = express()
port = process.env.PORT || 3000;




app.use(session({
  secret: "mysecretkey",
  resave: false,
  saveUninitialized: true,
}))


app.use(flash())

app.engine('handlebars', exphbs.engine({
  handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, "./public")));
app.use('/', require(path.join(__dirname,'router/route')));
app.use('/login', require(path.join(__dirname,'router/route')));
app.use(('/signup'), require(path.join(__dirname,'router/route')));
app.use(('/users/:username'), require(path.join(__dirname,'router/route')));



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})