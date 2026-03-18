"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
exports.initialize = initialize;
// src/_helpers/db.ts
const config_json_1 = __importDefault(require("../../config.json"));
const promise_1 = __importDefault(require("mysql2/promise"));
const sequelize_1 = require("sequelize");
exports.db = {};
async function initialize() {
    const { host, port, user, password, database } = config_json_1.default.database;
    const connection = await promise_1.default.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS\`${database}\`;`);
    await connection.end();
    const sequelize = new sequelize_1.Sequelize(database, user, password, { dialect: 'mysql' });
    const { default: userModel } = await Promise.resolve().then(() => __importStar(require('../users/user.model')));
    const { default: departmentModel } = await Promise.resolve().then(() => __importStar(require('../department/department.model')));
    const { default: employeeModel } = await Promise.resolve().then(() => __importStar(require('../employee/employee.model')));
    const { default: requestModel } = await Promise.resolve().then(() => __importStar(require('../requests/requests.model')));
    const { default: transferModel } = await Promise.resolve().then(() => __importStar(require('../transfer/transfer.model')));
    exports.db.User = userModel(sequelize);
    exports.db.Department = departmentModel(sequelize);
    exports.db.Employee = employeeModel(sequelize);
    exports.db.Request = requestModel(sequelize);
    exports.db.Transfer = transferModel(sequelize);
    // Set up associations
    exports.db.User.hasOne(exports.db.Employee, { foreignKey: 'userId', as: 'employee' });
    exports.db.Employee.belongsTo(exports.db.User, { foreignKey: 'userId', as: 'user' });
    exports.db.Department.hasMany(exports.db.Employee, { foreignKey: 'departmentId', as: 'employees' });
    exports.db.Employee.belongsTo(exports.db.Department, { foreignKey: 'departmentId', as: 'department' });
    exports.db.User.hasMany(exports.db.Request, { foreignKey: 'userId', as: 'requests' });
    exports.db.Request.belongsTo(exports.db.User, { foreignKey: 'userId', as: 'user' });
    exports.db.Employee.hasMany(exports.db.Transfer, { foreignKey: 'employeeId', as: 'transfers' });
    exports.db.Transfer.belongsTo(exports.db.Employee, { foreignKey: 'employeeId', as: 'employee' });
    exports.db.Department.hasMany(exports.db.Transfer, { foreignKey: 'fromDepartmentId', as: 'transfersFrom' });
    exports.db.Department.hasMany(exports.db.Transfer, { foreignKey: 'toDepartmentId', as: 'transfersTo' });
    exports.db.Transfer.belongsTo(exports.db.Department, { foreignKey: 'fromDepartmentId', as: 'fromDepartment' });
    exports.db.Transfer.belongsTo(exports.db.Department, { foreignKey: 'toDepartmentId', as: 'toDepartment' });
    exports.db.User.hasMany(exports.db.Transfer, { foreignKey: 'approvedBy', as: 'approvedTransfers' });
    exports.db.Transfer.belongsTo(exports.db.User, { foreignKey: 'approvedBy', as: 'approver' });
    await sequelize.sync({ alter: true });
    console.log('Database initialized and models synced');
}
