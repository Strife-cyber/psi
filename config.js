import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'psi.sqlite',
    logging: false
});

export default sequelize;
