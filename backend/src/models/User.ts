import {
  AllowNull,
  Column,
  Default,
  DefaultScope,
  Model,
  Scopes,
  Table,
  Unique,
} from 'sequelize-typescript';
import { ExpirationTime } from '../utils/jwt';
import { CompareHash, GenerateHash } from './../utils/bcript';

@DefaultScope({
  attributes: {
    exclude: ['password'],
  },
  order: [['id', 'ASC']],
})
@Scopes({
  login: {
    attributes: {
      include: ['password'],
    },
  },
})
@Table({
  tableName: 'Users',
  timestamps: true,
  hooks: {
    beforeSave: async function(user: User) {
      user.set('password', await User.passwordToHash(user.password));
    },
  },
})
export class User extends Model<User> {
  @Unique
  @AllowNull(false)
  @Column
  email!: string;

  @AllowNull(false)
  @Column
  password!: string;

  @AllowNull(false)
  @Default(false)
  @Column
  isAdmin!: boolean;

  @AllowNull(true)
  @Default(new Date(0))
  @Column
  exp!: Date;

  comparePassword(password: string) {
    return CompareHash(password, this.password);
  }

  setExprationTime() {
    this.exp.setDate(ExpirationTime());
    return this;
  }

  clearExprationTime() {
    this.exp.setDate(0);
    return this;
  }

  static async passwordToHash(password: string) {
    return await GenerateHash(password);
  }
}
