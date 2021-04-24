import * as cbor from 'cbor'

//https://www.badykov.com/ethereum/2019/08/22/solidity-bytecode-metadata/
// https://www.shawntabrizi.com/ethereum/verify-ethereum-contracts-using-web3-js-and-solc/
export const verifyByteCode = (compiledByteCode: string, actualByteCode: string, solidityVersion: string) => {
  // binaryCode = vmcode + cobrEncode + cobrEncode.length(two-byte big-endian)
  const compiledCborSize = parseInt(compiledByteCode.slice(-4), 16);
  const actualCborSize = parseInt(actualByteCode.slice(-4), 16);
  if(compiledByteCode.slice(0, -(compiledCborSize+2)*2) != actualByteCode.slice(0, -(actualCborSize+2)*2)){
    return false;
  }
  const compiledCBOR = compiledByteCode.slice(-(compiledCborSize+2)*2, -4);
  const actualCBOR = actualByteCode.slice(-(actualCborSize+2)*2, -4);
  if(compiledCBOR == actualCBOR) return true;
  try {
    const compiledMeta = cbor.decode(compiledCBOR);
    const actualMeta = cbor.decode(actualCBOR);
    console.warn("meta info different:", compiledMeta, actualMeta);
    if(compiledMeta.solc && actualMeta.solc)
      return compiledMeta.solc.equals(actualMeta.solc);
  } catch {
      return false;
  }
  return true;
}
