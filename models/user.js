import { DataTypes, Model } from "sequelize";

class User extends Model {
    static init(sequelize) {
        return super.init({
            name: DataTypes.STRING,
            email: DataTypes.TEXT,
            password: DataTypes.STRING
        }, { sequelize });
    }
}

export default User;
