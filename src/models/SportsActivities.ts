import { Table, Model, DataType, Column, BelongsTo, ForeignKey, AllowNull, PrimaryKey, AutoIncrement, HasMany } from 'sequelize-typescript';
import User from './User';
import TypesActivity from './TypesActivity';

@Table({
  tableName: 'sports_activities',
  updatedAt: false
})

class SportsActivity extends Model{
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER
  })
  declare id: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING
  })
  declare duration: string;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM('leve','moderada','alta','extrema')
  })
  declare intensity: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER
  })
  declare userId: number;

  @BelongsTo(() => User)
  declare user: User

  @HasMany(() => TypesActivity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  declare typesActivity: TypesActivity[];


};

export default SportsActivity;

