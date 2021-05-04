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
  const config = truffleConfig(solidityVersion)
  fs.writeFileSync(path.join(path.resolve(directory), 'truffle-config.js'), config)
}


export const installDependencies = async (directory) => {
  execSync(`cd ${directory} && yarn 2>&1`)
}

export const compile = async (directory) => {
  try {
    execSync(`cd ${directory} && truffle compile 2>&1`)
    return true
  }
  catch(e) {
    return false
  }
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
  if (fs.existsSync(dir)) {
    const data = fs.readFileSync(dir).toString()
    const { deployedBytecode, bytecode } = JSON.parse(data)
    return { deployedBytecode, bytecode }
  } else {
    const deployedBytecode = false
    const bytecode = false
    return { deployedBytecode, bytecode }
  }
}
