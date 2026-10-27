export const requireCreator = (req, res, next) => {
  if (!req.user || !req.user.isCreator) {
    return res.status(403).json({ success: false, error: "Creator access required" });
  }
  next();
};

export default requireCreator;
