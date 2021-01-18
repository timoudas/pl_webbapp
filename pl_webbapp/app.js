const express = require('express');
var mongoose = require('mongoose');
const hbs = require('express-handlebars');
var bodyParser = require('body-parser');
const { join } = require('path')
const app = express();
const keys = require('./configs/keys')
const reload = require('reload')
const http = require('http')
var server = http.createServer(app)
var sassMiddleware = require('node-sass-middleware');
var io = require('socket.io')(server);
var utils = require('./services/utils.js');
const { updateData } = require('./controllers/tableController');


// Database setup
const db = keys.mongoURI // CREATE THE /configs folder with the file keys.json in it.
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))

// VIEW ENGINE
app.engine('hbs', hbs({
    defaultLayout: 'main',
    extname: '.hbs',
    partialsDir: join(__dirname, 'views', 'partials')
}));

app.set('view engine', 'hbs');
app.set('port', process.env.PORT || 3000)

app.use(
    sassMiddleware({
        src: __dirname + '/public/sass', 
        dest: __dirname + '/public/css',
        prefix: '/css',
        // debug: true,   
        outputStyle: 'compressed'    
    })
);   
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules'));  

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Routing
app.use('/', require('./routes/homeRouter'))
app.use('/table', require('./routes/tableRouter'))
app.use('/players', require('./routes/playerRouter'))
app.use('/teams', require('./routes/teamRouter'))


io.on('connection', (socket) => {
  console.log('WE HAVE LIFTOFF');
});
io.on('connection', (socket) => {
    socket.on('btn-press', (msg) => {
        console.log('message from client: ' + msg);
        console.log('data update started');
        // (async () => {
        //     console.log(await utils.updateData())
        //   })()
        // TODO: SOLVE ASYNC SHIET
        io.emit('sending-back', "Update Completed!")
    });
});

// Reload code here
reload(app).then(function (reloadReturned) {
    // reloadReturned is documented in the returns API in the README
    // Reload started, start web server
    server.listen(app.get('port'), function () {
        console.log('Web server listening on port ' + app.get('port'))
    })
}).catch(function (err) {
  console.error('Reload could not start, could not start server/sample app', err)
})