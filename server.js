require("dotenv").config();

const express = require("express");
const cors = require("cors");
const WebSocket = require("ws");
const app = express();
const server = require("http").createServer(app);
const session = require("express-session");
const userRouter = require("./routers/user_routes");
const stockRouter = require("./routers/stock_routes");
const holdingsRouter = require("./routers/holdings_routes");

const port = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/stocks", stockRouter);
app.use("/api/v1/holdings", holdingsRouter);

server.listen(port, async () => {
  console.log(`Portfolio Tracker BE listening on port ${port}`);
});

// socket for connecting to finnhub (connecting BE to Finnhub)
const socket = new WebSocket("wss://ws.finnhub.io?token=cai0r9aad3i7auh4hp40");

// socket server for FE to connect to (connecting BE and FE)
const wss = new WebSocket.Server({ server: server });

let symbol = null;

wss.on("connection", function connection(ws) {
  console.log("FE is connected");

  // listening from FE (receiving data from FE to BE)
  ws.addEventListener("message", function (stockSymbol) {
    console.log("FE sending this symbol: ", stockSymbol.data);
    if (stockSymbol.data == "unsub") {
      socket.send(JSON.stringify({ type: "unsubscribe", symbol: `${symbol}` }));
    } else {
      symbol = stockSymbol.data;
      socket.send(JSON.stringify({ type: "subscribe", symbol: `${symbol}` }));
    }
    console.log("symbol after if else statement: ", stockSymbol.data);
    console.log(symbol);
  });

  //listening for messages, logging and sending data from BE to FE
  socket.addEventListener("message", function (event) {
    // setTimeout(function () {
    //   console.log("Message from server ", event.data);
    // }, 2000);
    ws.send(event.data);
  });
});
