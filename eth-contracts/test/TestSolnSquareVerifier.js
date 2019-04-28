// Test if a new solution can be added for contract - SolnSquareVerifier
var SolnSquareVerifier = artifacts.require('SolnSquareVerifier');

contract('SolnSquareVerifier', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    let proof = {
        "proof": {
            "a": ["0x06c7baa07954ecc5ec08bb483bcb1cfe28b8221e6e0ceba4dd703b24c34a8f84", "0x2500e7f04974ebc316bc7215a238112a3f710eceb70f63549c1fabd9fc54cf6b"],
            "b": [["0x00d67678819a86896c53adca673aa5d62a1e644ce622f8bdc67c78de25a0033f", "0x16d009fbfbd988b26708ccbdbbc430b5dabe5034bfeaee513cd02cb27ca6433b"], ["0x2aa63f5de1714c003feae8d0b675758487bc8bf0aadd5dd044a07b025aa60de0", "0x2b7d43cab98767892fc53244f7cb42ef4ad1e6a26499e6ad59cb29f590a5eb67"]],
            "c": ["0x2575c84774463f2a03b372836ed43a9c580a39811d6be9d1f4a33f93619bde80", "0x14b7b0918f74d878fb783f5251c6c660bfbfdb305b6b121a1330ccc40bb9e6a2"]
        },
        "correctInputs": ["0x0000000000000000000000000000000000000000000000000000000000000010", "0x0000000000000000000000000000000000000000000000000000000000000001"]
    };

    describe('Test - SolnSquareVerifier', function () {
        beforeEach(async function () {
            this.contract = await SolnSquareVerifier.new({ from: account_one });
        })

        it('Test if a new solution can be added for contract', async function () {
            const { proof: { a, b, c }, correctInputs: input } = proof;
            
            bytes32 key = keccak256(abi.encodePacked(a, b, c, input));
            let result = await this.contract.addSolution(2, account_two, key);

            // Test event is emitted
            assert.equal(result.logs.length, 1, "No events were triggered.");
        })

        // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
        it('Test if an ERC721 token can be minted for contract', async function () {
            const { proof: { a, b, c }, correctInputs: input } = proof;
            
            let totalSupply = await this.contract.totalSupply().call();

            let isCorrect = await this.contract.mint(account_two, 2, a, b, c, input)

            let newTotalSupply = await this.contract.totalSupply().call();

            assert.equal(totalSupply + 1, newTotalSupply, "Invalid proof result");
        })

    });
})