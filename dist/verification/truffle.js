"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getByteCode = exports.compile = exports.installDependencies = exports.createMigration = exports.createConfiguration = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const { execSync } = require("child_process");
const truffleConfig = (value) => {
    return `
  module.exports = {
    compilers: {
      solc: {
      version: "${value}",
      },
    },
  };
  
  `;
};
const migration = (val) => {
    return `const Migrations = artifacts.require("${val}");module.exports = function(deployer) {deployer.deploy(${val});};`;
};
exports.createConfiguration = async (solidityVersion, directory) => {
    if (!solidityVersion) {
        throw new Error("No Solidity version specified");
    }
    const config = truffleConfig(solidityVersion);
    fs_1.default.writeFileSync(path_1.default.join(directory, "truffle-config.js"), config);
};
exports.createMigration = async (directory, githubUrl) => {
    const fileName = getFileName(githubUrl).split('.')[0];
    try {
        fs_1.default.unlinkSync(path_1.default.join(directory, "migrations", "1_initial_migration.js"));
    }
    catch (e) {
    }
    try {
        fs_1.default.unlinkSync(path_1.default.join(directory, "contracts", "Migrations.sol"));
    }
    catch (e) {
    }
    const migrationDirectory = path_1.default.join(directory, "migrations");
    if (!fs_1.default.existsSync(migrationDirectory)) {
        fs_1.default.mkdirSync(migrationDirectory);
    }
    fs_1.default.writeFileSync(path_1.default.join(migrationDirectory, "1.js"), migration(fileName));
};
exports.installDependencies = async (directory) => {
    execSync(`cd ${directory} && yarn`);
};
exports.compile = async (directory) => {
    execSync(`cd ${directory} && truffle compile`);
};
const renameFile = (filename, inExtension, outExtension) => {
    return filename.split(inExtension)[0] + outExtension;
};
const getFileName = githubUrl => {
    const parts = githubUrl.split("/");
    return parts[parts.length - 1];
};
exports.getByteCode = async (githubUrl, directory) => {
    const fileName = getFileName(githubUrl);
    const abiFileName = renameFile(fileName, "sol", "json");
    const dir = path_1.default.join(directory, "build", "contracts", abiFileName);
    const data = fs_1.default.readFileSync(dir).toString();
    const { deployedBytecode, bytecode } = JSON.parse(data);
    return { deployedBytecode, bytecode };
};
//# sourceMappingURL=truffle.js.map