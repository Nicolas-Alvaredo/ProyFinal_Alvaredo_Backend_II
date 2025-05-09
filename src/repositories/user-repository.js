import { userDao } from '../daos/mongodb/user-dao.js';
import UserDTO from '../dto/user-dto.js';

export const userRepository = {
  getByEmail: async (email) => userDao.getByEmail(email),
  create: async (user) => userDao.create(user),
  findById: async (id) => {
    const user = await userDao.getById(id);
    return new UserDTO(user);
  }
};
