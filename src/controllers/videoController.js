export const trending = (req, res) => res.send("Home Page Videos");
export const see = (req, res) => {
  console.log(req.params);
  return res.send(`Watch Video #${req.params.id}`);
};
export const edit = (req, res) => res.send("Edit");
export const search = (req, res) => res.send("search");
export const upload = (req, res) => res.send("Upload video");
export const deleteVideo = (req, res) => res.send("Delete Video");
