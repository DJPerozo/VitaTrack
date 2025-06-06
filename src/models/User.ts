import { Table, Model, Column, DataType, Default, AllowNull, HasMany, Unique, PrimaryKey, AutoIncrement } from 'sequelize-typescript';
import Project from './Projects';
import Task from './Tasks';
import SportsActivity from './SportsActivities';
import TypesActivity from './TypesActivity';
import Learning from './Learning';


@Table({
  tableName: 'users'
})

class User extends Model{
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER
  })
  declare id: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(100)
  })
  declare name: string;

  @Unique(true)
  @AllowNull(false)
  @Column({
    type: DataType.STRING(50)
  })
  declare email: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING
  })
  declare password: string;

  
  @Column({
    type: DataType.STRING(6)
  })
  declare token: string;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN
  })
  declare confirm: boolean;


  @HasMany(() => Project, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'  
  })
  declare project: Project[];

  @HasMany(() => Task, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'  
  })
  declare tasks: Task[];

  
  @HasMany(() => SportsActivity, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'  
  })
  declare sportsActivity: SportsActivity[];

  @HasMany(() => TypesActivity, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'  
  })
  declare typesActivity: TypesActivity[];


  @HasMany(() => Learning, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  declare learning: Learning[];


};

export default User