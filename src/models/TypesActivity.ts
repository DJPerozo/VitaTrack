import { Table, Model, DataType, Column, BelongsTo, ForeignKey, AllowNull, PrimaryKey, AutoIncrement } from 'sequelize-typescript'
import SportsActivity from './SportsActivities';
import User from './User';


@Table({
  tableName: 'types-activity'
})

class TypesActivity extends Model{
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
    type: DataType.ENUM('cardio','fuerza','flexibilidad')
  })
  declare category: string;

  // Relacion Actividades Deportivas
  @ForeignKey(() => SportsActivity)
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER
  })
  declare sportsActivityId: number;

  @BelongsTo(() => SportsActivity)
  declare sportsActivity: SportsActivity

  //relacion Usuario
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER
  })
  declare userId: number;

  @BelongsTo(() => User)
  declare user: User
};

export default TypesActivity;