const User = require("../../models/User");

const getCurrentUser = async (userId) => {
  const user = await User.findOne({
    _id: userId,
    isDeleted: false,
  }).populate({
    path: "employeeId",
    match: {
      isDeleted: false,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

module.exports = getCurrentUser;