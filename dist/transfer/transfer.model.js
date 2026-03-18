"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transfer = void 0;
exports.default = default_1;
// src/transfer/transfer.model.ts
const sequelize_1 = require("sequelize");
class Transfer extends sequelize_1.Model {
}
exports.Transfer = Transfer;
function default_1(sequelize) {
    Transfer.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        employeeId: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: 'employees',
                key: 'id'
            }
        },
        fromDepartmentId: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: 'departments',
                key: 'id'
            }
        },
        toDepartmentId: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: 'departments',
                key: 'id'
            }
        },
        reason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
            allowNull: false,
            defaultValue: 'Pending'
        },
        approvedBy: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id'
            }
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
        modelName: 'Transfer',
        tableName: 'transfers',
        timestamps: true
    });
    return Transfer;
}
