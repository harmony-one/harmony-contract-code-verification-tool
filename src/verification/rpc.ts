const { Harmony } = require("@harmony-js/core");
const { ChainID, ChainType } = require("@harmony-js/utils");

const rpcUrl = "https://api.s0.b.hmny.io/"

const hmy = new Harmony(rpcUrl, {
  chainType: ChainType.Harmony,
  chainId: ChainID.HmyTestnet,
});

export const getSmartContractCode = async (address) => {
  const response = await hmy.blockchain.getCode({
    address,
    blockNumber: "latest",
  });

  return response.result;
}