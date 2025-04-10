import User from "./user.js";
import Password from "./password.js";
import { DataTypes, Model } from "sequelize";

class Entry extends Model {
    static init(sequelize) {
        return super.init({
            title: DataTypes.STRING,
            description: DataTypes.TEXT,
            password: {
                allowNull: false,
                type: DataTypes.INTEGER,
                references: {
                    model: Password,
                }
            },
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

export default Entry;
