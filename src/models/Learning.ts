import { Table, Model, DataType, Column, AllowNull, BelongsTo, ForeignKey, PrimaryKey, AutoIncrement, Default } from 'sequelize-typescript';
import User from './User';

@Table({
  tableName: 'learning',
  updatedAt: false
})

class Learning extends Model{
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER
  })
  declare id: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(255)
  })
  declare issue: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(255)
  })
  declare content: string;

  @Default('recursos.defaul')
  @Column({
    type: DataType.STRING(255)
  })
  declare resources: string;

  @Default('notas.defaul')
  @Column({
    type: DataType.STRING(255)
  })
  declare grades: string;
  
  
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER
  })
  declare userId: number;

  @BelongsTo(() => User)
  declare user: User


};

export default Learning;