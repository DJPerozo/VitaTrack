import { Sequelize } from 'sequelize-typescript'
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_database, 
    process.env.DB_username, 
    process.env.DB_password, 
    {
    host: process.env.DB_localhost,
    dialect: 'postgres',

    logging: false,

    models: [__dirname + "/../models/**/*"]

});

export default sequelize;