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

---

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

---

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
