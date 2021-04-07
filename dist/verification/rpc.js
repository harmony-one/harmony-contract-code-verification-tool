"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSmartContractCode = void 0;
const { Harmony } = require("@harmony-js/core");
const { ChainID, ChainType } = require("@harmony-js/utils");
const rpcUrl = "https://api.s0.b.hmny.io/";
const hmy = new Harmony(rpcUrl, {
    chainType: ChainType.Harmony,
    chainId: ChainID.HmyTestnet,
});
exports.getSmartContractCode = async (address) => {
    const response = await hmy.blockchain.getCode({
        address,
        blockNumber: "latest",
    });
    return response.result;
};
//# sourceMappingURL=rpc.js.map