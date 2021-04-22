const verify = require( "../verification/index" ).codeVerification

test('Running test 1', async () => {
  let data = await verify(
    {
      contractAddress: 'one1rcs4yy4kln53ux60qdeuhhvpygn2sutn500dhw',
      githubURL: 'https://github.com/rachit2501/Lottery-System/blob/master/contracts/Lottery.sol',
      chainType: 'testnet',
      solidityVersion: '0.4.17',
      keep: true
    }
  )
  expect(data.verified).toBe(true)    // will match
});

test('Running test 2', async () => {
  let data = await verify(
    {
      contractAddress: 'one1rcs4yy4kln53ux60qdeuhhvpygn2sutn500dhw',
      githubURL: 'https://github.com/rachit2501/Lottery-System/blob/master/contracts/Lottery.sol',
      chainType: 'testnet',
      solidityVersion: '0.4.1'
    }
  )
  expect(data.verified).toBe(false)   // contract was compiled with 0.4.17 but this will provide coverage for no metadata extraction portion
});

test('Running test 3', async () => {
  let data = await verify(
    {
      contractAddress: 'one1rcs4yy4kln53ux60qdeuhhvpygn2sutn500dhwa',
      githubURL: 'https://github.com/rachit2501/Lottery-System/blob/master/contracts/Lottery.sol',
      chainType: 'testnet',
      solidityVersion: '0.4.17',
      keep: true
    }
  )
  expect(data.verified).toBe(false)   // invalid Bech32 address
});

test('Running test 4', async () => {
  let data = await verify(
    {
      contractAddress: 'one16skweach8tqt0ce4a3x8jtuz0gtrn374vul3ua',
      githubURL: 'https://github.com/rachit2501/Lottery-System/blob/master/contracts/Lottery.sol',
      chainType: 'testnet',
      solidityVersion: '0.4.17',
    }
  )
  expect(data.verified).toBe(false)   // different contract (MetaCoin.sol) from the one posted at the above address
});

test('Running test 5', async () => {
  let data = await verify(
    {
      contractAddress: 'one1rcs4yy4kln53ux60qdeuhhvpygn2sutn500dhw',
      githubURL: 'Fake',
      chainType: 'testnet',
      solidityVersion: '0.4.17'
    }
  )
  expect(data.verified).toBe(false)   // Github.ts failure
});

test('Running test 6', async () => {
  let data = await verify(
    {
      contractAddress: 'one1rcs4yy4kln53ux60qdeuhhvpygn2sutn500dhw',
      githubURL: 'Fake.sol',
      chainType: 'mainnet',
      solidityVersion: '0.4.17'
    }
  )
  expect(data.verified).toBe(false)    // Github.ts failure
});
