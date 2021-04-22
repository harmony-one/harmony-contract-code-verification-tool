import fs from 'fs'

// https://www.badykov.com/ethereum/2019/08/22/solidity-bytecode-metadata/
// https://www.shawntabrizi.com/ethereum/verify-ethereum-contracts-using-web3-js-and-solc/
export function verifyByteCode(deployedByteCode, compiledByteCode, solidityVersion) {
  let compiled = splitByteCode(compiledByteCode, solidityVersion)
  let deployed = splitByteCode(deployedByteCode, solidityVersion)
  return Buffer.compare(compiled, deployed) === 0
}

function arrayify(code) {
  let hex = (<string>code).substring(2)
  const result = []
    for (let i = 0; i < hex.length; i += 2) {
        result.push(parseInt(hex.substring(i, i + 2), 16))
    }
  return new Uint8Array(result) // has slice function already
}

// according to https://docs.soliditylang.org/_/downloads/en/v0.4.6/pdf/ there is no contract metadata, a sentiment echoed by link #2 above
// metadata is embedded in the contract starting from solidity v0.4.7 https://docs.soliditylang.org/_/downloads/en/v0.4.7/pdf/
function splitByteCode(providedByteCode, solidityVersion) {
  const solidityMinorVersion = +(solidityVersion.split('.')[1])
  const solidityPatchVersion = +(solidityVersion.split('.')[2])
  let bytecode
  try {
    if (solidityMinorVersion >= 4 && solidityPatchVersion >= 7) {
      let buffer = Buffer.from(arrayify(providedByteCode))
      let metadataLength = buffer.readIntBE(buffer.length - 2, 2)  // "Since the beginning of that encoding is not easy to find, its length is added in a two-byte big-endian encoding"
      bytecode = buffer.slice(0, buffer.length - metadataLength - 2)
    } else {
      bytecode = Buffer.from(arrayify(providedByteCode))
    }
    return bytecode
  } catch
    (e) {
  console.log(e)
  throw new Error('Cant split bytecode into bytecode and metadata')
  }
}
