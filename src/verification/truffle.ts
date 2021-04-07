import fs from "fs";
import path from "path";

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

export const createConfiguration = async (solidityVersion, directory) => {
  if (!solidityVersion) {
    throw new Error("No Solidity version specified");
  }

  const config = truffleConfig(solidityVersion);
  fs.writeFileSync(path.join(directory, "truffle-config.js"), config);
};

export const createMigration = async (
  directory,
  githubUrl
) => {
  const fileName = getFileName(githubUrl).split('.')[0];

  try {
    fs.unlinkSync(path.join(directory, "migrations", "1_initial_migration.js"));
  } catch (e) {
  }
  try {
    fs.unlinkSync(path.join(directory, "contracts", "Migrations.sol"));
  } catch (e) {
  }

  const migrationDirectory = path.join(directory, "migrations")
  if (!fs.existsSync(migrationDirectory)){
    fs.mkdirSync(migrationDirectory);
  }

  fs.writeFileSync(path.join(migrationDirectory, "1.js"), migration(fileName));
};

export const installDependencies = async (directory) => {
  execSync(`cd ${directory} && yarn`);
};

export const compile = async (directory) => {
  execSync(`cd ${directory} && truffle compile`);
};

const renameFile = (filename, inExtension, outExtension) => {
  return filename.split(inExtension)[0] + outExtension;
};

const getFileName = githubUrl => {
  const parts = githubUrl.split("/");
  return parts[parts.length - 1];
};

export const getByteCode = async (githubUrl, directory) => {
  const fileName = getFileName(githubUrl);
  const abiFileName = renameFile(fileName, "sol", "json");

  const dir = path.join(directory, "build", "contracts", abiFileName);

  const data = fs.readFileSync(dir).toString();

  const { deployedBytecode, bytecode } = JSON.parse(data);
  return {deployedBytecode, bytecode};
};