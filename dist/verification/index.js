"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.codeVerification = void 0;
const truffle = __importStar(require("./truffle"));
const rpc = __importStar(require("./rpc"));
const path_1 = __importDefault(require("path"));
exports.codeVerification = async ({ contractAddress, solidityVersion, githubURL }) => {
    const taskId = "1"; // Date.now() + '-' + Math.floor(Math.random() * 10000)
    const directory = path_1.default.join(__dirname, "../", taskId);
    console.log("New task", { taskId, directory });
    console.log('Getting actual bytecode from the blockchain...');
    const actualBytecode = await rpc.getSmartContractCode(contractAddress);
    if (!actualBytecode || actualBytecode === '0x') {
        throw new Error(`No bytecode found for address ${contractAddress}`);
    }
    console.log('Cloning github...');
    // await github.clone(githubURL, taskId)
    console.log('Creating truffle config...');
    await truffle.createConfiguration(solidityVersion, directory);
    await truffle.createMigration(directory, githubURL);
    console.log('Installing contract dependencies...');
    // await truffle.installDependencies(directory)
    console.log('Compiling...');
    await truffle.compile(directory);
    console.log('Getting compiled bytecode');
    const { deployedBytecode, bytecode } = await truffle.getByteCode(githubURL, directory);
    console.log('Cleaning up...');
    // fs.rmdirSync(directory, { recursive: true })
    console.log({ actualBytecode, deployedBytecode, bytecode });
    console.log({ a: actualBytecode.length, d: deployedBytecode.length, b: bytecode.length });
    return actualBytecode === deployedBytecode || actualBytecode === bytecode;
};
//# sourceMappingURL=index.js.map