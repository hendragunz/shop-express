export const get404 = (req, res, next) => {
  res.status(404).render("404", { docTitle: "Page Not Found" });
};


export const get500 = (req, res, next) => {
  res.status(500).render("500", { docTitle: "Internal Server Error" });
};