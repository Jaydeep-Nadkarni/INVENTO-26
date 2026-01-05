// src/repositories/userRepository.js
import User from "../models/userModel.js";

export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};
