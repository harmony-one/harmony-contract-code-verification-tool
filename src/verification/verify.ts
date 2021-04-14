const byteCodeStartBefore422 = '6060604052'
const byteCodeStartAfter422 = '6080604052'
const byteCodeEnd = 'a165627a7a72305820'

// https://www.shawntabrizi.com/ethereum/verify-ethereum-contracts-using-web3-js-and-solc/
export const verifyByteCode = (compiledByteCode: string, actualByteCode: string, solidityVersion: string) => {
  const t = trimByteCode(solidityVersion)
  return t(compiledByteCode) === t(actualByteCode)
}


const trimByteCode = (solidityVersion: string) => (byteCode: string) => {
  // solidityVersion = 0.1.2 0.4.17
  const solidityMinorVersion = +(solidityVersion.split('.')[1])
  const solidityPatchVersion = +(solidityVersion.split('.')[2])

  try {
    let byteCodeStart
    if (solidityMinorVersion >= 4 && solidityPatchVersion >= 22) {
      byteCodeStart = byteCodeStartAfter422
    } else {
      byteCodeStart = byteCodeStartBefore422
    }

    return byteCode.split(byteCodeStart)[1].split(byteCodeEnd)[0]
  } catch
    (e) {
    throw new Error('Cant trim bytecode by starting pointer and meta section')
  }
}