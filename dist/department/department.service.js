"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentService = void 0;
// src/department/department.service.ts
const db_1 = require("../_helpers/db");
exports.DepartmentService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
};
async function getAll() {
    return await db_1.db.Department.findAll();
}
async function getById(id) {
    return await getDepartment(id);
}
async function create(params) {
    const existingDept = await db_1.db.Department.findOne({ where: { name: params.name } });
    if (existingDept) {
        throw new Error(`Department "${params.name}" already exists`);
    }
    return await db_1.db.Department.create(params);
}
async function update(id, params) {
    const department = await getDepartment(id);
    await department.update(params);
}
async function _delete(id) {
    const department = await getDepartment(id);
    await department.destroy();
}
async function getDepartment(id) {
    const department = await db_1.db.Department.findByPk(id);
    if (!department)
        throw new Error('Department not found');
    return department;
}
