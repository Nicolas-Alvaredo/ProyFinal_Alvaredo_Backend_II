import MongoDao from './base-dao.js';
import User from './models/user-model.js';

class UserDao extends MongoDao {
  constructor() {
    super(User);
  }

  async getByEmail(email) {
    return await this.model.findOne({ email });
  }

  async getByIdWithPassword(id) {
    return await this.model.findById(id).select('+password');
  }
}

export const userDao = new UserDao();
