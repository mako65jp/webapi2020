import {
  AllowNull,
  BeforeBulkCreate,
  BeforeBulkUpdate,
  BeforeSave,
  Column,
  Default,
  DefaultScope,
  Model,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { generateHash } from './../utils/bcrypt';

@DefaultScope({
  attributes: { exclude: ['password'] },
  order: [['id', 'ASC']],
})
@Scopes({
  withPassword: { attributes: { include: ['password'] } },
})
@Table({
  tableName: 'Users',
  timestamps: true,
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

  @BeforeSave
  static BeforeSave(user: User): void {
    console.log('@BeforeSave');
    if (user.password) {
      user.set('password', generateHash(user.password));
    }
  }

  @BeforeBulkCreate
  static hooksBeforeBulkCreate(): void {
    // console.log('@BeforeBulkCreate:');
  }

  @BeforeBulkUpdate
  static hooksBeforeBulkUpdate(): void {
    // console.log('@BeforeBulkUpdate:');
  }
}
