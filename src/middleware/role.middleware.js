const ERR = require("../utils/errors");

const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    const userRoles = req.user?.roles || [];

    const hasPermission = allowedRoles.some((role) =>
      userRoles.includes(role)
    );

    if (!hasPermission) {
      return next(ERR.accessDenied());
    }

    return next();
  };
};

module.exports = roleMiddleware;
