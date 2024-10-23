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
