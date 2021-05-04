const { Harmony } = require("@harmony-js/core")
const { ChainID, ChainType } = require("@harmony-js/utils")

let rpcUrl = {
  'testnet':"https://api.s0.b.hmny.io/",
  'mainnet':"https://api.s0.t.hmny.io/",
}

let testnet = new Harmony(rpcUrl.testnet, {
  chainType: ChainType.Harmony,
  chainId: ChainID.HmyTestnet,
})

let mainnet = new Harmony(rpcUrl.mainnet, {
  chainType: ChainType.Harmony,
  chainId: ChainID.HmyMainnet,
})

export let getSmartContractCode = async (chain, address) => {
  const hmy = chain === 'mainnet' ? mainnet : testnet
  const response = await hmy.blockchain.getCode({
    address,
    blockNumber: "latest",
  })
  return response
}
