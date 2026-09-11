import prisma from "../config/database.js";

export const findUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const findUserById = async (id) => {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
};

export const createUser = async (userData) => {
  return prisma.user.create({
    data: userData,
  });
};