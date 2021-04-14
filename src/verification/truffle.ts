import fs from 'fs'
import path from 'path'

const { execSync } = require('child_process')

const truffleConfig = (value) => {
  return `
  module.exports = {
    compilers: {
      solc: {
      version: "${value}",
      },
    },
  };
  
  `
}

export const createConfiguration = async (solidityVersion, directory) => {
  if (!solidityVersion) {
    throw new Error('No Solidity version specified')
  }
  console.log(path.join(path.resolve(directory), 'truffle-config.js'))
  const config = truffleConfig(solidityVersion)
  fs.writeFileSync(path.join(path.resolve(directory), 'truffle-config.js'), config)
}


export const installDependencies = async (directory) => {
  execSync(`cd ${directory} && yarn`)
}

export const compile = async (directory) => {
  execSync(`cd ${directory} && truffle compile`)
}

const renameFile = (filename, inExtension, outExtension) => {
  return filename.split(inExtension)[0] + outExtension
}

const getFileName = githubUrl => {
  const parts = githubUrl.split('/')
  return parts[parts.length - 1]
}

export const getByteCode = async (githubUrl, directory) => {
  const fileName = getFileName(githubUrl)
  const abiFileName = renameFile(fileName, 'sol', 'json')

  const dir = path.join(directory, 'build', 'contracts', abiFileName)

  const data = fs.readFileSync(dir).toString()

  const { deployedBytecode, bytecode } = JSON.parse(data)
  return { deployedBytecode, bytecode }
}