import * as github from './github'
import * as truffle from './truffle'
import * as rpc from './rpc'
import path from 'path'
import fs from 'fs'
import { verifyByteCode } from './verify'
const ora = require("ora")

function cleanUp(directory, keep) {
  if (keep == true)
    return
  let spinner = ora('Cleaning up cloned repository...').start()
  fs.rmdirSync(directory, {recursive: true})
  spinner.succeed('Cloned repository deleted')
}

export const codeVerification = async (
  {
    contractAddress,
    solidityVersion,
    githubURL,
    commitHash,
    keep,
    chainType
  }
) => {
  const taskId = contractAddress
  const directory = path.join(__dirname, '../', taskId)

  try {
  // todo validate address SDK hmy isAddress
  // todo validate if folder already exist

  let spinner = ora('Getting actual bytecode from the blockchain...').start()
  const actualBytecode = await rpc.getSmartContractCode(chainType, contractAddress)
  if (!actualBytecode || actualBytecode === '0x') {
    spinner.stop()
    throw new Error(`No bytecode found for address ${contractAddress}`)
  }
  spinner.succeed('Got actual bytecode from the blockhain')

  spinner = ora('Cloning smart contract Github repository...').start()
  try {
    await github.clone(githubURL, taskId, commitHash)
  } catch (e) {
    spinner.stop()
    process.exit(1)
  }
  spinner.succeed('Github repository cloned')

  spinner = ora('Creating tuffle configuration...').start()
  await truffle.createConfiguration(solidityVersion, directory)
  spinner.succeed('Truffle configuration ready')

  spinner = ora('Installing contract dependencies...').start()
  await truffle.installDependencies(directory)
  spinner.succeed('Contract dependencies installed')

  spinner = ora('Compiling...').start()
  await truffle.compile(directory)
  spinner.succeed('Compiling complete')

  spinner = ora('Getting compiled bytecode...').start()
  const { deployedBytecode, bytecode } = await truffle.getByteCode(githubURL, directory)
  spinner.succeed('Obtained compiled bytecode')

  const verified = verifyByteCode(actualBytecode, deployedBytecode, solidityVersion)

  if (verified) {
    const commitHashCalculated = await github.getCommitHash(directory)
    cleanUp(directory, keep)
    return {
      verified: true,
      commitHash: commitHashCalculated
    }
  }

  } catch(error) {
    console.error(error)
    cleanUp(directory, keep)
    return {
      verified: false,
      error
    }
  }

  cleanUp(directory, keep)
  return {
    verified: false,
    error: 'No match'
  }
}
