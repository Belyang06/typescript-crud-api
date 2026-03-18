"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferService = void 0;
// src/transfer/transfer.service.ts
const db_1 = require("../_helpers/db");
exports.TransferService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    approve,
    reject,
    executeTransfer,
};
async function getAll() {
    return await db_1.db.Transfer.findAll({
        include: [
            {
                model: db_1.db.Employee,
                as: 'employee',
                include: [{ model: db_1.db.User, as: 'user' }]
            },
            { model: db_1.db.Department, as: 'fromDepartment' },
            { model: db_1.db.Department, as: 'toDepartment' },
            { model: db_1.db.User, as: 'approver' }
        ]
    });
}
async function getById(id) {
    return await getTransfer(id);
}
async function create(params) {
    // Get the employee's current department
    const employee = await db_1.db.Employee.findByPk(params.employeeId);
    if (!employee) {
        throw new Error('Employee not found');
    }
    // Check if toDepartment exists
    const toDepartment = await db_1.db.Department.findByPk(params.toDepartmentId);
    if (!toDepartment) {
        throw new Error('Target department not found');
    }
    const transferData = {
        ...params,
        fromDepartmentId: employee.departmentId
    };
    return await db_1.db.Transfer.create(transferData);
}
async function update(id, params) {
    const transfer = await getTransfer(id);
    if (params.employeeId !== undefined) {
        const employee = await db_1.db.Employee.findByPk(params.employeeId);
        if (!employee) {
            throw new Error('Employee not found');
        }
    }
    if (params.toDepartmentId !== undefined) {
        const department = await db_1.db.Department.findByPk(params.toDepartmentId);
        if (!department) {
            throw new Error('Target department not found');
        }
    }
    if (params.approvedBy !== undefined && params.approvedBy !== null) {
        const user = await db_1.db.User.findByPk(params.approvedBy);
        if (!user) {
            throw new Error('Approver not found');
        }
    }
    await transfer.update(params);
}
async function approve(id, approvedBy) {
    const user = await db_1.db.User.findByPk(approvedBy);
    if (!user) {
        throw new Error('Approver not found');
    }
    const transfer = await getTransfer(id);
    await transfer.update({ status: 'Approved', approvedBy });
}
async function reject(id, approvedBy) {
    const user = await db_1.db.User.findByPk(approvedBy);
    if (!user) {
        throw new Error('Approver not found');
    }
    const transfer = await getTransfer(id);
    await transfer.update({ status: 'Rejected', approvedBy });
}
async function executeTransfer(id) {
    const transfer = await getTransfer(id);
    if (transfer.status !== 'Approved') {
        throw new Error('Transfer must be approved before execution');
    }
    // Update employee's department
    const employee = await db_1.db.Employee.findByPk(transfer.employeeId);
    if (!employee) {
        throw new Error('Employee not found');
    }
    await employee.update({ departmentId: transfer.toDepartmentId });
}
async function _delete(id) {
    const transfer = await getTransfer(id);
    await transfer.destroy();
}
async function getTransfer(id) {
    const transfer = await db_1.db.Transfer.findByPk(id, {
        include: [
            { model: db_1.db.Employee, as: 'employee', include: [{ model: db_1.db.User, as: 'user' }] },
            { model: db_1.db.Department, as: 'fromDepartment' },
            { model: db_1.db.Department, as: 'toDepartment' },
            { model: db_1.db.User, as: 'approver' }
        ]
    });
    if (!transfer)
        throw new Error('Transfer not found');
    return transfer;
}
