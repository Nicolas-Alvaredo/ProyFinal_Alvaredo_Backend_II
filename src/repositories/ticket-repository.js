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

      // ✅ Devolver el stock al producto
      dbProduct.stock += item.quantity;
      await dbProduct.save();

      amount += item.quantity * dbProduct.price;
    }

    // ✅ Generar el ticket
    const ticket = await ticketDao.create({
      code: `TCKT-${Date.now()}`,
      purchase_datetime: new Date().toLocaleString(),
      amount,
      purchaser: user.email
    });

    // ✅ Vaciar el carrito
    await cartRepository.update(cart._id, { products: [] });

    return ticket;
  }
};
