import fs from 'fs'
const { execSync } = require("child_process")
const ora = require("ora")


export const clone = async (githubUrl, directory, commitHash) => {

  if (githubUrl.substr(githubUrl.length - 4) !== '.sol') {
    throw new Error('Link should point to specific sol contract')
  }

  if (githubUrl.indexOf('/blob')===-1) {
    throw new Error('Use blob github link')
  }

  if (githubUrl.substr(0, 18) !== "https://github.com") {
    throw new Error ('Only contracts hosted on github are allowed')
  }

  const actualUrl = githubUrl.split('/blob')[0]

  if (fs.existsSync(directory)) {
    let spinner = ora('Removing already existing repository').start()
    fs.rmdirSync(directory, {recursive: true})
    spinner.succeed('Removed existing repository')
  }

  execSync(`git clone ${actualUrl} ${directory} 2>&1`)
  if (commitHash) {
    console.log('Switching to commit')
    execSync(`cd ${directory} && git checkout ${commitHash} 2>&1`)
  }
}

export const getCommitHash = async (directory) => {
  const output = execSync(`cd ${directory} && git rev-parse HEAD 2>&1`)
  return output.toString().split('\n')[0]
}
