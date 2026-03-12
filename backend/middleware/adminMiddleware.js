export const adminOnly = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ msg: "Admin only" });
  }
  next();
};