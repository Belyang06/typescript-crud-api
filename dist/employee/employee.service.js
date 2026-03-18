"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeService = void 0;
// src/employee/employee.service.ts
const db_1 = require("../_helpers/db");
exports.EmployeeService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    getByUserId,
};
async function getAll() {
    return await db_1.db.Employee.findAll({
        include: [
            { model: db_1.db.User, as: 'user' },
            { model: db_1.db.Department, as: 'department' }
        ]
    });
}
async function getById(id) {
    return await getEmployee(id);
}
async function getByUserId(userId) {
    return await db_1.db.Employee.findOne({
        where: { userId },
        include: [
            { model: db_1.db.User, as: 'user' },
            { model: db_1.db.Department, as: 'department' }
        ]
    });
}
async function create(params) {
    const existingEmp = await db_1.db.Employee.findOne({ where: { employeeId: params.employeeId } });
    if (existingEmp) {
        throw new Error(`Employee ID "${params.employeeId}" already exists`);
    }
    // Check if user exists
    const user = await db_1.db.User.findByPk(params.userId);
    if (!user) {
        throw new Error('User not found');
    }
    // Check if department exists
    const department = await db_1.db.Department.findByPk(params.departmentId);
    if (!department) {
        throw new Error('Department not found');
    }
    const existingUser = await db_1.db.Employee.findOne({ where: { userId: params.userId } });
    if (existingUser) {
        throw new Error('User is already linked to an employee record');
    }
    return await db_1.db.Employee.create(params);
}
async function update(id, params) {
    const employee = await getEmployee(id);
    if (params.userId !== undefined) {
        const user = await db_1.db.User.findByPk(params.userId);
        if (!user) {
            throw new Error('User not found');
        }
        const existingUser = await db_1.db.Employee.findOne({ where: { userId: params.userId } });
        if (existingUser && existingUser.id !== id) {
            throw new Error('User is already linked to another employee record');
        }
    }
    if (params.departmentId !== undefined) {
        const department = await db_1.db.Department.findByPk(params.departmentId);
        if (!department) {
            throw new Error('Department not found');
        }
    }
    await employee.update(params);
}
async function _delete(id) {
    const employee = await getEmployee(id);
    await employee.destroy();
}
async function getEmployee(id) {
    const employee = await db_1.db.Employee.findByPk(id, {
        include: [
            { model: db_1.db.User, as: 'user' },
            { model: db_1.db.Department, as: 'department' }
        ]
    });
    if (!employee)
        throw new Error('Employee not found');
    return employee;
}
