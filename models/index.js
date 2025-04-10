import User from "./user.js";
import Entry from "./entry.js";
import Password from "./password.js";
import sequelize from "../config.js";

User.init(sequelize);
Password.init(sequelize);
Entry.init(sequelize);

User.hasMany(Entry, { foreignKey: "user" });
User.hasMany(Password, { foreignKey: "user" });

Password.belongsTo(User, { foreignKey: "user" });
Password.hasMany(Entry, { foreignKey: "password" });

Entry.belongsTo(User, { foreignKey: "user" });
Entry.belongsTo(Password, { foreignKey: "password" });

const models = {
    sequelize,
    User,
    Password,
    Entry
};

sequelize
    .sync({ alter: false })
    .then(() => console.log('Database && tables created!'))
    .catch((error) => console.error('Database sync failed: ', error));

export default models;
