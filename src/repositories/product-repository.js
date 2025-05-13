import { productDao } from '../daos/mongodb/product-dao.js';

export const productRepository = {
  getAll: async () => productDao.getAll(),
  getById: async (id) => productDao.getById(id),
  create: async (data) => productDao.create(data),
  update: async (id, data) => productDao.update(id, data),
  delete: async (id) => productDao.delete(id),
  paginate: async (filter, options) => productDao.paginate(filter, options)
};
