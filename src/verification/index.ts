import * as github from "./github";
import * as truffle from "./truffle";
import * as rpc from './rpc'
import path from "path";
import fs from 'fs'

export const codeVerification = async (
  {
    contractAddress,
    solidityVersion,
    githubURL
  }
) => {
  const taskId = Date.now() + '-' + Math.floor(Math.random() * 10000)
  const directory = path.join(__dirname, "../", taskId);

  console.log("New task", { taskId, directory });

  console.log('Getting actual bytecode from the blockchain...')
  const actualBytecode = await rpc.getSmartContractCode(contractAddress)
  if (!actualBytecode || actualBytecode === '0x') {
    throw new Error(`No bytecode found for address ${contractAddress}`)
  }

  console.log('Cloning github...')
  await github.clone(githubURL, taskId)
  console.log('Creating truffle config...')
  await truffle.createConfiguration(solidityVersion, directory);
  await truffle.createMigration(directory, githubURL)
  console.log('Installing contract dependencies...')
  await truffle.installDependencies(directory)
  console.log('Compiling...')
  await truffle.compile(directory)
  console.log('Getting compiled bytecode')
  const {deployedBytecode, bytecode} = await truffle.getByteCode(githubURL, directory)

  console.log('Cleaning up...')
  // fs.rmdirSync(directory, { recursive: true })


  console.log({actualBytecode, deployedBytecode, bytecode})
  console.log({a: actualBytecode.length, d: deployedBytecode.length, b: bytecode.length})
  return actualBytecode === deployedBytecode || actualBytecode === bytecode
};
