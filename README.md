# Wetube Reloaded

## 2024.10.22

### router

/ -> Home  
/join -> Join  
/login -> Login  
/search -> Search

/users/:id -> See User  
/users/logout -> Log Out  
/users/edit -> Edit user  
/users/delete -> Delete user

/videos/:id -> See Video  
/videos/:id/edit -> Edit Video  
/videos/:id/delete -> Delete Video  
/videos/upload -> Upload Video

## 2024.10.22

### Updated routes to use dynamic parameters (:id)

정규식을 사용(\\d+)해 숫자만 허용

nodeJs의 경우 :id가 코드 줄에서 상위에 위치하면 id가 포함하지 않는 경로에도 영향을 미치기 때문에 하위에 위치

## 2024.10.24

### Write Template

1. Install pug

- `npm install pug`로 Pug 설치

2. Configure Express

- `app.set("views", process.cwd() + "/src/views")`을 사용해 Express에서 뷰 엔진으로 Pug 설정
- 뷰 경로는 `process.cwd() + '/views'` 로 설정

3. Writing and Rendering Pug Templates

- Pug 파일을 **소문자**로 작성
- `res.render("home")`으로 Pug 파일을 렌더링해 HTML로 변환

4. Template Inheritance

- `extends`로 베이스 템플릿(base.pug)을 확장
- `block`을 사용해 확장된 템플릿에서 특정 부분을 채워넣음

5. Iteration and Array Handling

- `each` 루프를 통해 `videos` 배열을 순회

6. Use Mixin

- `mixin` 을 정의하여 동일한 **HTML 구조**를 반복적으로 생성
- `mixin video(video)`는 비디오 정보를 받아 각 비디오 속성 표시

```pug
mixin video(video)
    div
        h4=video.title
    ul
        li #{video.rating}/5
        li #{video.comments} comments.
```

## 2024.10.25

### post request

1. Setting up the server with `express.urlencoded()`

```javascript
app.use(express.urlencoded({ extended: true }));
```

- form 데이터를 파싱해 `req.body`에서 사용할 수 있도록 설정

2. Update title with `postEdit` controller

```javascript
export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  videos[id - 1].title = title;
  res.redirect(`/videos/${id}`);
};
```

- form 에서 입력한 새로운 제목으로 비디오 제목을 업데이트하고 해당 페이지를 redirect

## 2024.10.28

### Setting up MongoDB with Mongoose

1. Install Mongoose

```bash
npm install mongoose
```

2. Connecting to MongoDB

- MongoDB에 연결하기 위해 Mongoose를 설정

```javascript
import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/wetube", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (error) => console.log("DB Error:", error));
db.once("open", () => console.log("Connected to DB"));
```

- `mongoose.connect()` 로 MongoDB와 연결하고, 성공적으로 연결했는지 로그로 확인

### Creating a Model

1. Define the Schema

- MongoDB에 저장할 데이터 구조를 정의하기 위해 Mongoose의 `Schema`를 사용함

```javascript
const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  createdAt: Date,
  hashtags: [{ type: String }],
  meta: {
    views: Number,
    rating: Number,
  },
});
```

- 각 필드에 타입을 지정하고, `meta` 객체에는 `views`와 `rating`을 포함

2. Create the Model

- `Schema`를 바탕으로 `Model` 생성

```javascript
const Video = mongoose.model("Video", videoSchema);

export default Video;
```

- `Video`라는 모델을 생성하여 MongoDB에서 다룰 수 있음

3. Creating a Video Schema with Validation

- 각 필드에는 **유효성 검사(validation)**를 추가하여 필수적인 값들을 설정

```javascript
import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true }, // 제목은 필수
  description: { type: String, required: true }, // 설명도 필수
  createdAt: { type: Date, required: true, default: Date.now }, // 생성 날짜는 기본값이 현재 날짜
  hashtags: [{ type: String }], // 해시태그는 배열 형태로 저장
  meta: {
    views: { type: Number, default: 0, required: true }, // 조회수는 기본값 0
    rating: { type: Number, default: 0, required: true }, // 평점도 기본값 0
  },
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
```

4. Inserting Data into the Database with `try-catch`

- 데이터베이스 작업은 실패할 가능성이 있기 때문에, 에러가 발생했을 때 에러처리가 중요
- 비동기 작업에서 `try-catch`는 서버가 멈추지 않도록 보호 및 에러 메시지를 보여줌

```javascript
export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  try {
    // 비디오 데이터를 MongoDB에 저장
    await Video.create({
      title,
      description,
      hashtags: hashtags.split(",").map((word) => `#${word.trim()}`),
    });
    return res.redirect("/"); // 업로드 완료 후 홈으로 리디렉션
  } catch (error) {
    // 에러 발생 시 업로드 페이지로 돌아가고 에러 메시지를 보여줌
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message, // Mongoose 에러 메시지 출력
    });
  }
};
```

## 2024.10.29

### Video Edit Function

1. Configure `getEdit` controller

- 비디오를 편집하기 위해 `id`를 통해 데이터벵스에서 불러와 템플릿에 전달
- 비디오에 해당하는 `id`가 없을 경우, "404" 페이지로 이동시켜 사용자가 찾을 수 없다는 메시지 표시

```javascript
export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.render("404");
  }
  return res.render("edit", {
    video,
  });
};
```

2. Configure `postEdit` controller

- `id`를 통해 비디오가 존재하는지 확인한 후, title, description, hashtags를 업데이트하고 수정된 비디오 페이지로 리디렉션

```javascript
export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id });
  if (!video) {
    return res.render("404");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: hashtags
      .split(",")
      .map((word) => (word.startWith("#") ? word : `#${word}`)),
  });
  res.redirect(`/video/${id}`);
};
```

## 2024.10.30

### Middleware, Static Method, Delete, and Search Functions

1. Middleware

- 비디오가 데이터베이스에 저장되기 전 실행되는 `pre("save")` 미들웨어를 설정해 저장 직전에 작업을 추가할 수 있음

```javascript
videoSchema.pre("save", async function () {
  console.log("We are about to save:", this);
});
```

2. Static Method: `formatHashtags`

- Static Method를 사용해서 `Middleware`의 작업을 전가시킴.
- Static Method의 장점으로는 `Model` 클래스 내에서 직접 호출할 수 있어 가독성이 좋아짐

```javascript
videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});
```

3. Delete Video Function

- 특정 `id`에 해당하는 비디오를 찾아 삭제

4. Search Function

- `search` 기능은 사용자가 입력한 `keyword`로 끝나는 비디오 제목을 검색하고, 정규식을 사용하여 대소문자를 구분하지 않고 검색

```javascript
export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(`${keyword}$`, "i"),
      },
    });
  }
  return res.render("search", { pageTitle: "Search", videos });
};
```

## 2024.10.31

### Account Creation, Form Validation, Status Code, and Login Functions

1. Account Creation

- `postJoin` 함수는 사용자가 회원가입 시 입력한 정보를 통해 계정을 생성, 비밀번호 일치 확인, 중복된 이메일과 사용자명 검사 기능

```javascript
export const postJoin = async (req, res) => {
  const { name, email, username, password, password2, location } = req.body;
  // 비밀번호 검사
  if (password !== password2) {
    return ...
    };
  }
  // 중복 검사
  // $or 연산자는 둘 이상의 조건 중 하나라도 일치하는 문서를 찾기 위함
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (exists) {
    return ...
  }
  try {
    await User.create({ name, username, email, password, location });
    return ...
  }
  catch (error)
    return ...
```

2.Form validation and Status Code

- `Browser` 에게 상태를 전달하는 역할이 큼

```javascript
  ...
  return res.status(400).render
  ...
```

3. Login Function

- `postLogin` 로그인 시 데이터베이스의 비밀번호와 체크하기 위해 `bcrypt.compare` 를 사용

```javascript
const ok = await bcrypt.compare(password, user.password);
```

4. Password Hashing with Middleware

- 비밀번호는 데이터베이스에 저장되기 전에 `pre("save")` 미들웨어를 통해 해시

```javascript
userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 5);
});
```
