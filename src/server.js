import express from "express";
import session from "express-session";
import morgan from "morgan";
import { localsMiddleware } from "./middlewares";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const app = express();
const logger = morgan("dev");

// 뷰 엔진 설정 (Pug 사용)
app.set("view engine", "pug");
// 뷰 파일의 경로 설정
app.set("views", process.cwd() + "/src/views");

// HTTP 요청 로깅을 위한 미들웨어 설정 (morgan 사용)
app.use(logger);
// 폼 데이터를 처리할 수 있도록 설정 (URL-encoded 데이터 파싱)
app.use(express.urlencoded({ extended: true }));

// 세션 미들웨어 설정
app.use(
  session({
    secret: "Hello!", // 세션 암호화를 위한 비밀 키
    resave: true, // 세션을 강제로 다시 저장할지 여부
    saveUninitialized: true, // 초기화되지 않은 세션을 저장할지 여부
  })
);

// 세션 상태를 콘솔에 출력하는 미들웨어 (디버깅용)
app.use((req, res, next) => {
  req.sessionStore.all((error, sessions) => {
    console.log(sessions);
    next();
  });
});

app.use(localsMiddleware);

// 라우터 설정
app.use("/", rootRouter); // 루트 경로에 대한 라우터 연결
app.use("/videos", videoRouter); // /videos 경로에 대한 라우터 연결
app.use("/users", userRouter); // /users 경로에 대한 라우터 연결

export default app;
