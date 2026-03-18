"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = void 0;
exports.default = default_1;
// src/requests/requests.model.ts
const sequelize_1 = require("sequelize");
class Request extends sequelize_1.Model {
}
exports.Request = Request;
function default_1(sequelize) {
    Request.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        type: {
            type: sequelize_1.DataTypes.ENUM('Equipment', 'Leave', 'Resources'),
            allowNull: false
        },
        items: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
            allowNull: false,
            defaultValue: 'Pending'
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW
        }
    }, {
        sequelize,
        modelName: 'Request',
        tableName: 'requests',
        timestamps: true
    });
    return Request;
}
