"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Employee = void 0;
exports.default = default_1;
// src/employee/employee.model.ts
const sequelize_1 = require("sequelize");
class Employee extends sequelize_1.Model {
}
exports.Employee = Employee;
function default_1(sequelize) {
    Employee.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        employeeId: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        userId: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        position: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        departmentId: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: 'departments',
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
        modelName: 'Employee',
        tableName: 'employees',
        timestamps: true
    });
    return Employee;
}
