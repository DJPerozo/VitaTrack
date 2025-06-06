import express from 'express';
import morgan from 'morgan';
import colors from 'colors';
import sequelize from './config/db';
import authRouter from './routers/auth-router';
import projectRouter from './routers/projects-router';
import tasksRouter from './routers/tasks';
import sportsActivities from './routers/sportsActivities-router';
import typesActivitys from './routers/typesActivity-router';
import learningRouter from './routers/learning-router';

const app = express();

app.use(morgan('dev'));
app.use(express.json());


app.use('/api/auth', authRouter);

app.use('/api/projects', projectRouter);

app.use('/api/tasks', tasksRouter);

app.use('/api/sports-activities', sportsActivities);

app.use('/api/types-activitys', typesActivitys);

app.use('/api/learning', learningRouter);


async function main() {
  try {
    await sequelize.authenticate();
    sequelize.sync({alter: true});
    console.log(colors.blue.bold('Connection has been established successfully.'));
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

main();


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(colors.cyan.bold(`El servidor esta Funcionando en el Puerto ${PORT}...`));
});