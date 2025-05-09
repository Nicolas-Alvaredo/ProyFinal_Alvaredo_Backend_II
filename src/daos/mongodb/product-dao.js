import MongoDao from './mongo-dao.js';
import Product from './models/product-model.js';

class ProductDao extends MongoDao {
  constructor() {
    super(Product);
  }

  async paginate(filter, options) {
    return await this.model.paginate(filter, options);
  }
}

export const productDao = new ProductDao();
