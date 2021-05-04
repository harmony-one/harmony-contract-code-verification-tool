const verify = require( "../verification/index" ).codeVerification
const splitByteCode = require( "../verification/verify" ).splitByteCode
const createConfiguration = require( "../verification/truffle" ).createConfiguration

test('Checking valid contract at valid address', async () => {
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
})

test('Checking contract with metadata-less Solidity version', async () => {
  let data = await verify(
    {
      contractAddress: 'one1rcs4yy4kln53ux60qdeuhhvpygn2sutn500dhw',
      githubURL: 'https://github.com/rachit2501/Lottery-System/blob/master/contracts/Lottery.sol',
      chainType: 'testnet',
      solidityVersion: '0.4.1'
    }
  )
  expect(data.verified).toBe(false)   // contract was compiled with 0.4.17 but this will provide coverage for no metadata extraction portion
})

test('Invalid Bech32 address', async () => {
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
})

test('Checking for contract mismatch', async () => {
  let data = await verify(
    {
      contractAddress: 'one16skweach8tqt0ce4a3x8jtuz0gtrn374vul3ua',
      githubURL: 'https://github.com/rachit2501/Lottery-System/blob/master/contracts/Lottery.sol',
      chainType: 'testnet',
      solidityVersion: '0.4.17',
    }
  )
  expect(data.verified).toBe(false)   // different contract (MetaCoin.sol) from the one posted at the above address
})

test('Checking with incorrect Github path (no sol)', async () => {
  let data = await verify(
    {
      contractAddress: 'one1rcs4yy4kln53ux60qdeuhhvpygn2sutn500dhw',
      githubURL: 'Fake',
      chainType: 'testnet',
      solidityVersion: '0.4.17'
    }
  )
  expect(data.verified).toBe(false)   // Github.ts failure
})

test('Incorrect Github path (no /blob)', async () => {
  let data = await verify(
    {
      contractAddress: 'one1rcs4yy4kln53ux60qdeuhhvpygn2sutn500dhw',
      githubURL: 'Fake.sol',
      chainType: 'mainnet',
      solidityVersion: '0.4.17'
    }
  )
  expect(data.verified).toBe(false)    // Github.ts failure
})

test('Incorrect Github path (no Github)', async () => {
  let data = await verify(
    {
      contractAddress: 'one1rcs4yy4kln53ux60qdeuhhvpygn2sutn500dhw',
      githubURL: 'https://example.com/blob/Fake.sol',
      chainType: 'mainnet',
      solidityVersion: '0.4.17'
    }
  )
  expect(data.verified).toBe(false)    // Github.ts failure
})

test('Working contract with commit hash provided', async () => {
  let data = await verify(
    {
      contractAddress: 'one1rcs4yy4kln53ux60qdeuhhvpygn2sutn500dhw',
      githubURL: 'https://github.com/rachit2501/Lottery-System/blob/master/contracts/Lottery.sol',
      chainType: 'testnet',
      solidityVersion: '0.4.17',
      commitHash: '5807253cf94f3f6f3ae143a114f4d73a5b1473ff',
    }
  )
  expect(data.verified).toBe(true)    // will match, for Github.ts coverage with commithash provided
})

test('Create truffle config without solidity version', async () =>  {
    await expect(createConfiguration(undefined, 'Test'))
    .rejects
    .toThrow()
})

test('Split byte code not starting with 0x', async () => {
  let data = () => {
    splitByteCode('asdasd', '0.5.6' )
  }
  expect(data).toThrow(Error)    // will match given no solidityVersion supplied
})
