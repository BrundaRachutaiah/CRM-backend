module.exports = (req, res, next) => {
  /**
   * In real-world apps, JWT or session is verified here.
   * For this project, we mock authenticated user.
   */

  req.user = {
    id: req.headers['x-agent-id'] || null
  };

  next();
};
