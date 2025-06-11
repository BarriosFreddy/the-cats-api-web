import { injectable } from 'inversify';
import { User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { UserModel } from '../database/models/UserModel';

@injectable()
class UserRepositoryImpl implements UserRepository {

  async create(user: User): Promise<User> {
    const doc = await UserModel.create(user);
    return new User({ id: doc._id.toString(), name: doc.name!, email: doc.email! });
  }

  async findAll(): Promise<User[]> {
    const docs = await UserModel.find();
    return docs.map(doc => new User({ id: doc._id.toString(), name: doc.name!, email: doc.email! }));
  }

  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findById(id);
    return doc ? new User({ id: doc._id.toString(), name: doc.name!, email: doc.email! }) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email }).exec();
    return doc ? new User({ id: doc._id.toString(), name: doc.name!, email: doc.email!, password: doc.password }) : null;
  }

  async update(id: string, user: User): Promise<User | null> {
    const doc = await UserModel.findByIdAndUpdate(
      id,
      { name: user.name, email: user.email },
      { new: true }
    );
    return doc ? new User({ id: doc._id.toString(), name: doc.name!, email: doc.email! }) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id);
    return !!result;
  }
}

export default UserRepositoryImpl;
