require("dotenv").config();
const path = require("path");
const { createServer } = require("http");

const express = require("express");
const createError = require("http-errors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const { Server } = require("socket.io");

const { viewSessionData, sessionLocals, isAuthenticated } = require("./middleware/");
const PORT = process.env.PORT || 3000;

const app = express();
const httpServer = createServer(app);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "backend")));
app.use(express.static(path.join(__dirname, "static")));

const sessionMiddleware = session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production" || process.env.NODE_ENV === "development",
    sameSite: "None",
  },
});

app.use(sessionMiddleware);

if (process.env.NODE_ENV === "development") {
  app.use(viewSessionData);
  app.use(sessionLocals);
  const livereload = require("livereload");
  const connectLiveReload = require("connect-livereload");
  const liveReloadServer = livereload.createServer();
  liveReloadServer.watch(path.join(__dirname, "backend", "static"));
  liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 100);
  });
  app.use(connectLiveReload());
}

app.use((req, res, next) => {
  console.log("Session data:", req.session);
  next();
});

const io = new Server(httpServer);
io.engine.use(sessionMiddleware);

// Include and use the exported function from socket.js
const socketLogic = require('../socket');
socketLogic(io);

io.on("connection", socket => {
  socket.join(socket.request.session.id);
});

const Routes = require("./routes");

app.use("/", Routes.landing);
app.use("/auth", Routes.authentication);
app.use("/sign_up", Routes.authentication);
app.use("/lobby", isAuthenticated, Routes.lobby);
app.use("/game", isAuthenticated, Routes.game);
app.use("/chat", isAuthenticated, Routes.chat);

app.use((_request, _response, next) => {
  console.log("Middleware: ", _request.originalUrl);
  next(createError(404));
});

httpServer.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
