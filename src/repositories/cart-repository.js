import { cartDao } from '../daos/mongodb/cart-dao.js';

export const cartRepository = {
  create: async () => cartDao.create({ products: [] }),
  getById: async (id) => cartDao.getById(id),
  getPopulatedById: async (id) => cartDao.getPopulatedById(id),
  update: async (id, data) => cartDao.update(id, data),
  delete: async (id) => cartDao.delete(id),
  getAll: async () => cartDao.getAll()
};
