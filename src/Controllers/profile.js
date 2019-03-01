const { prisma } = require("../../generated/prisma-client");

const getProfileByUserId = async (req, res) => {
  const { id } = req.params;
  const profile = await prisma
    .user({ id })
    .profile()
    res.json(profile);
};

const createProfile = async (req, res) => {
  const { userId, name, lastName, cpf, rg, birthDate, nickName } = req.body;

  const profile = await prisma.createProfile({
    name,
    lastName,
    cpf,
    rg,
    birthDate,
    nickName,
    owner: {
      connect: {
        id: userId
      }
    }
  });
  res.json(profile);
};

module.exports = {
  createProfile,
  getProfileByUserId
};
