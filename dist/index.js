"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./verification/index");
const run = async () => {
    /* const res = await codeVerification({
       contractAddress: "one1rcs4yy4kln53ux60qdeuhhvpygn2sutn500dhw",
       githubURL:
         "https://github.com/rachit2501/Lottery-System/blob/master/contracts/Lottery.sol",
       solidityVersion: "0.4.17",
     });*/
    /* const res = await codeVerification({
       contractAddress: "one16rgcltnlrekr664ueczvvhl2j7s5p6amezdhw3",
       githubURL:
         "https://github.com/harmony-one/davinci_nft_marketplace/blob/master/contracts/token/DavinciToken.sol",
       solidityVersion: "0.6.12",
     });*/
    /* const res = await codeVerification({
       contractAddress: "0x0c1310bbd93c6977fde20dc813cff8236ba1f0dd",
       githubURL:
         "https://github.com/harmony-one/ethhmy-bridge/blob/master/contracts/lib/MultiSigWallet.sol",
       solidityVersion: "0.5.17",
     });
     */
    const res = await index_1.codeVerification({
        contractAddress: "0x0f916E162362b12e87b1Af221BB5A3e320dd9aeb",
        githubURL: "https://github.com/ensdomains/ethregistrar/blob/master/contracts/StablePriceOracle.sol",
        solidityVersion: "0.5.17",
    });
    console.log({ res });
};
run();
//# sourceMappingURL=index.js.map