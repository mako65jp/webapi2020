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
import { compareHash, generateHash } from './../utils/bcript';

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
  static async BeforeSave(user: User): Promise<void> {
    if (user.password) {
      user.password = await generateHash(user.password);
    }
  }

  @BeforeBulkCreate
  static BeforeBulkCreate(): void {
    return;
  }

  @BeforeBulkUpdate
  static BeforeBulkUpdate(): void {
    return;
  }

  static async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await compareHash(password, hashedPassword);
  }
}
