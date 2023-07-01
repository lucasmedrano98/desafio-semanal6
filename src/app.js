import MongoStore from 'connect-mongo';
import express from 'express';
import handlebars from 'express-handlebars';
import session from 'express-session';
import path from 'path';
import { __dirname } from './config.js';
import { cartsRouter } from './routes/carts.router.js';
import { home } from './routes/home.router.js';
import { initRouter } from './routes/init.router.js';
import { loginRouter } from './routes/login.router.js';
import { logoutRouter } from './routes/logout.router.js';
import { productsRouter } from './routes/products.router.js';
import { realTimeProducts } from './routes/realtimeproducts.router.js';
import { registerRouter } from './routes/register.router.js';
import { testChatRouter } from './routes/test-chat.router.js';
import { connectMongo } from './utils/dbConnection.js';
import { connectSocketServer } from './utils/socketServer.js';

const app = express();
const PORT = 8080;

connectMongo();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

// CONFIG DEL MOTOR DE PLANTILLAS
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

const httpServer = app.listen(PORT, () => {
  console.log(`App runing on ${__dirname} - server http://localhost:${PORT}`);
});

connectSocketServer(httpServer);

app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        'mongodb+srv://lucasmedrano98lm:Xg6CweZZ7Kaew1lZ@cluster0.q1xgzj4.mongodb.net/?retryWrites=true&w=majority',
      ttl: 86400 * 7,
    }),
    secret: 'asdmsOAMSimaioMSAOidAi21o3m',
    resave: true,
    saveUninitialized: true,
  })
);
app.get('/session', (req, res) => {
  console.log(req.session);
  if (req.session?.cont) {
    req.session.cont++;
    res.send(JSON.stringify(req.session));
  } else {
    req.session.cont = 1;
    req.session.busqueda = 'cetosis';
    res.send(JSON.stringify(req.session));
  }
});

//TODOS MIS ENDPOINTS
app.use('/api/products', productsRouter);
app.use('/carts', cartsRouter);
app.use('/', initRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/logout', logoutRouter);
app.use('/home', home);
app.use('/realtimeproducts', realTimeProducts);
app.use('/test-chat', testChatRouter);

//OTROS ENDPOINTS
app.get('*', (req, res) => {
  return res.status(404).json({ status: 'error', msg: 'No se encuentra esa ruta', data: {} });
});
