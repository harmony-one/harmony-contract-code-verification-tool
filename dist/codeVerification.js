/*
const fs = require("fs");
const child_process = require("child_process");
const path = require("path");
const uuid = require("uuid");
const { Harmony } = require("@harmony-js/core");
const { ChainID, ChainType } = require("@harmony-js/utils");

const hmy = new Harmony("https://api.s0.b.hmny.io/", {
  chainType: ChainType.Harmony,
  chainId: ChainID.HmyTestnet,
});

const migration = (val) => {
  const str = `const Migrations = artifacts.require("${val}");module.exports = function(deployer) {deployer.deploy(${val});};`;
  return str;
};

const truffleConfig = (value) => {
  const str = `
  module.exports = {
    compilers: {
      solc: {
      version: "${value}",
      },
    },
  };
  
  `;
  return str;
};

const clone = (parse, filepath) => {
  return new Promise((resolve, rejects) => {
    const cloning = child_process.spawn("git", [
      "clone",
      `${parse[0]}//${parse[2]}/${parse[3]}/${parse[4]}`,
      "--progress",
    ]);

    cloning.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    cloning.on("close", async (code) => {
      resolve("done");
      console.log(`child process exited with code ${code}`);
    });
  });
};

const deleteFile = async (val, uuid) => {
  fs.rmdir(path.join(__dirname, val), { recursive: true }, () =>
    console.log("git delete")
  );
  fs.rmdir(path.join(__dirname, uuid), { recursive: true }, () =>
    console.log("truffle delete")
  );
};

const renamingFiles = async (filepath, uuid) => {
  return new Promise((resolve, rejects) => {
    fs.readdir(filepath, (err, files) => {
      console.log(files);
      const allFiles = [];
      files.forEach((file) => {
        allFiles.push(
          new Promise((resolve, rejects) => {
            fs.rename(
              path.join(filepath, file),
              path.join(__dirname, uuid, "contracts", file),
              () => {
                console.log("done");
              }
            );
          })
        );

        Promise.all(allFiles).then(resolve);
      });
    });
  });
};

const generateFiles = async (
  solidityVersion,
  contractAddress,
  parse,
  filepath,
  uuid
) => {
  fs.writeFileSync(
    path.join(__dirname, uuid, "truffle-config.js"),
    truffleConfig(solidityVersion)
  );

  const filename = parse[parse.length - 1].split(".")[0];
  console.log(filename);

  const removeDefault = new Promise((resolve, rejects) => {
    fs.unlink(
      path.join(__dirname, uuid, "migrations", "1_initial_migration.js"),
      () => resolve()
    );
  });

  const removeDefault2 = new Promise((resolve, rejects) => {
    fs.unlink(path.join(__dirname, uuid, "contracts", "Migrations.sol"), () =>
      resolve()
    );
  });
  const migrations = new Promise((resolve, rejects) => {
    fs.writeFile(
      path.join(__dirname, uuid, "migrations", "1.js"),
      migration(filename),
      (err) => {
        console.log("migrations created");
        resolve();
      }
    );
  });
  await removeDefault;
  await removeDefault2;
  await migrations;
  await clone(parse, filepath);
};

async function getSmartContractCode(addr) {
  const response = await hmy.blockchain.getCode({
    address: addr,
    blockNumber: "latest",
  });
  return response.result;
}

export async function codeVerification({
                                                 contractAddress,
                                                 solidityVersion,
                                                 githubURL,
                                               }) {
  const parse = githubURL.split("/");

  const newId = uuid.v1();

  const truffle = child_process.spawn("truffle", ["init", newId]);

  truffle.on("close", async (code) => {
    console.log(`child process exited with code ${code}`);

    let filepath = __dirname;

    for (let v = 4; v < parse.length - 1; v++) {
      if (v == 5 || v == 6) {
        continue;
      }
      filepath = path.join(filepath, parse[v]);
    }

    console.log('generateFiles', filepath)
    await generateFiles(
      solidityVersion,
      contractAddress,
      parse,
      filepath,
      newId
    );

    console.log('renamingFiles', filepath,  newId)
    await renamingFiles(filepath, newId);

    const compile = await new Promise((resolve, rejects) => {
      child_process.exec(
        `cd ${newId} && npm install && pwd && truffle compile `,
        (err, stdout, stderr) => {
          console.log(err);
          if (err) {
            console.log(err);
            rejects(false);
          }
          resolve(true);
        }
      );
    });

    console.log('Compilation')

    const bytecodeContract = await getSmartContractCode(contractAddress);

    console.log('original ', bytecodeContract)

    const check = new Promise((resolve, rejects) => {
      const bytecode = require(path.join(
        __dirname,
        newId,
        "build",
        "contracts",
        parse[parse.length - 1].split(".")[0] + ".json"
      ));
      console.log(
        bytecode.bytecode,
        "                                               ",
        bytecodeContract
      );

      if (bytecodeContract === bytecode.bytecode) {
        {
          console.log("same");
          resolve(true);
        }
      } else {
        resolve(false);
      }
    });
    await check;
    await deleteFile(parse[4], newId);
    return check;
  });
}*/
//# sourceMappingURL=codeVerification.js.map