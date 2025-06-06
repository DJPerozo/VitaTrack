import { Table, Model, DataType, Column, AllowNull, BelongsTo, ForeignKey, Default, PrimaryKey, AutoIncrement } from 'sequelize-typescript';
import User from './User';
import Project from './Projects';

@Table({
  tableName: 'tasks'
})

class Task extends Model{
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER
  })
  declare id: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(150)
  })
  declare title: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(255)
  })
  declare description: string;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN
  })
  declare completed: boolean;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column({type: DataType.INTEGER})
  declare userId: number;

  @BelongsTo(() => User)
  declare user: User;

  @AllowNull(false)
  @ForeignKey(() => Project)
  @Column({type: DataType.INTEGER})
  declare projectId: number;

  @BelongsTo(() => Project)
  declare project: Project;


};

export default Task;