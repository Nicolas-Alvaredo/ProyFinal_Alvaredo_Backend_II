import { ticketDao } from '../daos/mongodb/ticket-dao.js';
import { cartRepository } from './cart-repository.js';
import { productRepository } from './product-repository.js';


export const ticketRepository = {
  generate: async (user) => {
    const cart = await cartRepository.getPopulatedById(user.cart);
    if (!cart || !cart.products.length) throw new Error("Carrito vacío o no encontrado");

    let amount = 0;

    for (const item of cart.products) {
      const dbProduct = await productRepository.getById(item.product._id);
      if (!dbProduct) continue;
      amount += item.quantity * dbProduct.price;
    }

    const ticket = await ticketDao.create({
      code: `TCKT-${Date.now()}`,
      purchase_datetime: new Date().toLocaleString(),
      amount,
      purchaser: user.email
    });

    cart.products = []; // vacía el carrito post-compra
    await cartRepository.update(cart._id, { products: [] });

    return ticket;
  }
};