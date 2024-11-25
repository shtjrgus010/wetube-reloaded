import bcrypt from "bcrypt";
import User from "../models/User";

// 회원가입 페이지 렌더링
export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });

// 회원가입 폼 제출 처리
export const postJoin = async (req, res) => {
  // 요청 본문에서 폼 데이터를 구조 분해
  const { name, email, username, password, password2, location } = req.body;
  const pageTitle = "Join";

  // 비밀번호 확인이 일치하는지 확인
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "비밀번호 확인이 일치하지 않습니다.",
    });
  }

  // 사용자 이름이나 이메일이 이미 사용 중인지 확인
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (exists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "이 사용자 이름/이메일은 이미 사용 중입니다.",
    });
  }

  // 새로운 사용자 생성
  try {
    await User.create({
      name,
      username,
      email,
      password,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    // 사용자 생성 중 오류 처리
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: error._message,
    });
  }
};

// 로그인 페이지 렌더링
export const getLogin = (req, res) => {
  res.render("login", {
    pageTitle: "Login",
  });
};

// 로그인 폼 제출 처리
export const postLogin = async (req, res) => {
  // 요청 본문에서 로그인 자격 증명을 구조 분해
  const { username, password } = req.body;
  const pageTitle = "Login";

  // 사용자 이름으로 사용자 찾기
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "이 사용자 이름으로 된 계정이 존재하지 않습니다.",
    });
  }

  // 제공된 비밀번호와 데이터베이스에 저장된 해시된 비밀번호 비교
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "비밀번호가 틀렸습니다.",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  // 로그인 성공 시 홈 페이지로 리디렉션
  return res.redirect("/");
};

// 사용자 정보 수정 기능 플레이스홀더
export const edit = (req, res) => res.send("사용자 정보 수정");

// 사용자 삭제 기능 플레이스홀더
export const remove = (req, res) => res.send("사용자 삭제");

// 로그아웃 기능 플레이스홀더
export const logout = (req, res) => res.send("로그아웃");

// 사용자 프로필 보기 기능 플레이스홀더
export const see = (req, res) => res.send("사용자 보기");
