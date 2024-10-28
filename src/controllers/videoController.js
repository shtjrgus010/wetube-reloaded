import Video from "../models/Video";

export const home = async (req, res) => {
  try {
    // MongoDB에서 모든 video 문서를 검색
    const videos = await Video.find({});
    return res.render("home", {
      pageTitle: "Home",
      videos,
    });
  } catch {
    return res.render("server-error");
  }
};

export const watch = (req, res) => {
  const { id } = req.params;
  return res.render("watch", {
    pageTitle: `Watching`,
    videos: [],
  });
};

export const getEdit = (req, res) => {
  const { id } = req.params;
  return res.render("edit", {
    pageTitle: `Editing`,
  });
};

export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", {
    pageTitle: "upload Video",
  });
};

export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  try {
    await Video.create({
      title,
      description,
      hashtags: hashtags.split(",").map((word) => `#${word}`),
    });
    return res.redirect("/");
  } catch (error) {
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};
