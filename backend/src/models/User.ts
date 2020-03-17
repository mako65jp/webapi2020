import {
  AllowNull,
  Column,
  DefaultScope,
  Model,
  Scopes,
  Table,
  Unique,
  Default,
} from 'sequelize-typescript';
import { CompareHash, GenerateHash } from './../utils/bcript';
import { ExpirationTime } from '../utils/jwt';

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

  @Column
  exp!: number;

  async comparePassword(password: string) {
    return await CompareHash(password, this.password);
  }

  setExprationTime() {
    this.exp = ExpirationTime();
    return this;
  }

  static async passwordToHash(password: string) {
    return await GenerateHash(password);
  }
}
