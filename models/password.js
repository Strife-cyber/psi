import User from "./user.js";
import { Model, DataTypes } from "sequelize";

class Password extends Model {
    static init(sequelize) {
        return super.init({
            value: DataTypes.STRING,
            isUnique: DataTypes.BOOLEAN,
            rarityScore: DataTypes.NUMBER,
            strengthScore: DataTypes.NUMBER,
            user: {
                allowNull: false,
                type: DataTypes.INTEGER,
                references: {
                    model: User
                }
            }
        }, { sequelize });
    }
}

export default Password;
