import { userDao } from '../daos/mongodb/user-dao.js';
import UserDTO from '../dto/user-dto.js';
import { transporter, getMailConfig } from '../services/email-service.js';

export const userRepository = {
  getByEmail: async (email) => userDao.getByEmail(email),

  create: async (user) => {
    const newUser = await userDao.create(user);
    try {
      await transporter.sendMail(getMailConfig(newUser));
      console.log("📧 Email de bienvenida enviado a:", newUser.email);
    } catch (err) {
      console.error("❌ Error al enviar email de bienvenida:", err.message);
    }
    return newUser;
  },

  findById: async (id) => {
    const user = await userDao.getById(id);
    return new UserDTO(user);
  },

  findByIdWithPassword: async (id) => {
    return await userDao.getByIdWithPassword(id);
  }
};
