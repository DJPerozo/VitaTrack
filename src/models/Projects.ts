import { Table, Model, DataType, Column, BelongsTo, ForeignKey, AllowNull, Default, PrimaryKey, AutoIncrement, HasMany } from 'sequelize-typescript';
import User from './User';
import Task from './Tasks';

@Table({
  tableName: 'projects'
})

class Project extends Model{
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
  declare name: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING
  })
  declare description: string;

  @Default('Planificado')
  @Column({
    type: DataType.ENUM('Planificado', 'En_progreso', 'Completado')
  })
  declare estado: string;

  @ForeignKey(() => User)
  @Column({type: DataType.INTEGER})
  declare userId: number;

  @BelongsTo(() => User)
  declare user: User;

  @HasMany(() => Task, {
    onUpdate: 'CASCADE',  
    onDelete: 'CASCADE'
  })
  declare tasks: Task[]; 
 
};

export default Project;
