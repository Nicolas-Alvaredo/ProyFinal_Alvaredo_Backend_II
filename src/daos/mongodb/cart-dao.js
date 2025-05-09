import MongoDao from './base-dao.js'; 
import Cart from './models/cart-model.js';

class CartDao extends MongoDao {
  constructor() {
    super(Cart);
  }

  async getPopulatedById(id) {
    return await this.model.findById(id).populate('products.product');
  }
}

export const cartDao = new CartDao();
