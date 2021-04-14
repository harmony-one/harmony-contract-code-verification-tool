const { Harmony } = require("@harmony-js/core");
const { ChainID, ChainType } = require("@harmony-js/utils");

const rpcUrl = {
  'testnet':"https://api.s0.b.hmny.io/",
  'mainnet':"https://api.s0.t.hmny.io/",
}

const testnet = new Harmony(rpcUrl.testnet, {
  chainType: ChainType.Harmony,
  chainId: ChainID.HmyTestnet,
});

const mainnet = new Harmony(rpcUrl.mainnet, {
  chainType: ChainType.Harmony,
  chainId: ChainID.HmyMainnet,
});

export const getSmartContractCode = async (chain, address) => {
  const hmy = chain === 'mainnet' ? mainnet : testnet
  const response = await hmy.blockchain.getCode({
    address,
    blockNumber: "latest",
  });

  return response.result;
}