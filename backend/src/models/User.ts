import { CorrectPassword } from './../utils/bcript';
import {
  DefaultScope,
  Scopes,
  Model,
  Table,
  Column,
  AllowNull,
  Unique,
} from 'sequelize-typescript';

import { GeneratePasswordHash } from '../utils/bcript';

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
  paranoid: true,
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

  async validPassword(password: string) {
    return await CorrectPassword(password, this.password);
  }

  static async passwordToHash(password: string) {
    return await GeneratePasswordHash(password);
  }

  //   @CreatedAt
  //   @Column
  //   createdAt!: Date;

  //   @UpdatedAt
  //   @Column
  //   updatedAt!: Date;

  // comparePassword(password: string): boolean {
  //   // 省略
  // }

  // static passwordToHash(password: string, salt?: string): string {
  //   // 省略
  // }

  static verifyToken(token: string) {
    // TODO:

    return true;
  }
}
