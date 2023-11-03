const express = require('express');
const app = express();
const port = 3000;

/** Router 미들웨어를 사용하겠다 **/
const cookieParser = require("cookie-parser");
const goodsRouter = require("./routes/goods");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");

const connect = require("./schemas");
connect(); // mongoose를 연결합니다.


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("assets"));

// localhost:3000/api -> goodsRouter
app.use("/api", [goodsRouter, usersRouter, authRouter]);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(port, '포트로 서버가 열렸어요!');
});