import MongoDao from './base-dao.js';
import { TicketModel } from './models/ticket-model.js';

class TicketDao extends MongoDao {
  constructor() {
    super(TicketModel);
  }
}

export const ticketDao = new TicketDao();