import {
  AllowNull,
  Column,
  Default,
  DefaultScope,
  Model,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { compareHash, generateHash } from './../utils/bcript';

@DefaultScope({
  attributes: { exclude: ['password'] },
  order: [['id', 'ASC']],
})
@Scopes({
  login: { attributes: { include: ['password'] } },
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
    return compareHash(password, this.password);
  }

  setExprationTime(exprationTime: number) {
    this.setDataValue('exp', new Date(exprationTime));
    return this;
  }

  static async passwordToHash(password: string) {
    return await generateHash(password);
  }
}
