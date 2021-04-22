const verify = require( "../verification/index" ).codeVerification

test('Running tests', async () => {
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
  data = await verify(
    {
      contractAddress: 'one1rcs4yy4kln53ux60qdeuhhvpygn2sutn500dhw',
      githubURL: 'https://github.com/rachit2501/Lottery-System/blob/master/contracts/Lottery.sol',
      chainType: 'testnet',
      solidityVersion: '0.4.1'
    }
  )
  expect(data.verified).toBe(false)   // contract was compiled with 0.4.17 but this will provide coverage for no metadata extraction portion
  data = await verify(
    {
      contractAddress: 'one1rcs4yy4kln53ux60qdeuhhvpygn2sutn500dhwa',
      githubURL: 'https://github.com/rachit2501/Lottery-System/blob/master/contracts/Lottery.sol',
      chainType: 'testnet',
      solidityVersion: '0.4.17',
      keep: true
    }
  )
  expect(data.verified).toBe(false)   // invalid address
  data = await verify(
    {
      contractAddress: 'one105z5dka3mj5pprve4guf4r5uurzqkgms40ma3e',
      githubURL: 'https://github.com/rachit2501/Lottery-System/blob/master/contracts/Lottery.sol',
      chainType: 'mainnet',
      solidityVersion: '0.4.17',
    }
  )
  expect(data.verified).toBe(false)   // different contract on mainnet
  data = await verify(
    {
      contractAddress: 'one1rcs4yy4kln53ux60qdeuhhvpygn2sutn500dhw',
      githubURL: 'Fake',
      chainType: 'mainnet',
      solidityVersion: '0.4.17'
    }
  )
  expect(data.verified).toBe(false)   // Github.ts failure
  data = await verify(
    {
      contractAddress: 'one1rcs4yy4kln53ux60qdeuhhvpygn2sutn500dhw',
      githubURL: 'Fake.sol',
      chainType: 'mainnet',
      solidityVersion: '0.4.17'
    }
  )
  expect(data.verified).toBe(false)    // Github.ts failure
});
