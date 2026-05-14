const crypto = require("node:crypto");

const generateTemporaryPassword = () => {
  const randomPassword = crypto
    .randomBytes(6)
    .toString("base64")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 8);

  return `@${randomPassword}1A`;
};

module.exports = generateTemporaryPassword;