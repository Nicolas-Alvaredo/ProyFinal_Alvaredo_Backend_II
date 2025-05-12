import { ticketRepository } from '../repositories/ticket-repository.js';

export const generateTicketFromCart = async (req, res) => {
  try {
    const user = req.user;
    const ticket = await ticketRepository.generate(user);
    res.status(201).json({
        message: "Compra finalizada",
        ticket: {
          _id: ticket._id,
          code: ticket.code,
          purchase_datetime: ticket.purchase_datetime,
          amount: ticket.amount,
          purchaser: ticket.purchaser,
          __v: ticket.__v
        }
      });
      
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};