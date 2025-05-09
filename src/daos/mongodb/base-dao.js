export default class MongoDao {
    constructor(model) {
      this.model = model;
    }
  
    async getById(id) {
      return await this.model.findById(id);
    }
  
    async getAll() {
      return await this.model.find();
    }
  
    async create(data) {
      return await this.model.create(data);
    }
  
    async update(id, data) {
      return await this.model.findByIdAndUpdate(id, data, { new: true });
    }
  
    async delete(id) {
      return await this.model.findByIdAndDelete(id);
    }
  }
  