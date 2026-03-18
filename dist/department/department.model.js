"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Department = void 0;
exports.default = default_1;
// src/department/department.model.ts
const sequelize_1 = require("sequelize");
class Department extends sequelize_1.Model {
}
exports.Department = Department;
function default_1(sequelize) {
    Department.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true
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
        modelName: 'Department',
        tableName: 'departments',
        timestamps: true
    });
    return Department;
}
