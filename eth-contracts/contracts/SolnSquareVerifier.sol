pragma solidity >=0.4.21 <0.6.0;

import './ERC721Mintable.sol';
import './Verifier.sol';

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
contract SquareVerifier is Verifier {
    // function verifyTx(
    //             uint[2] memory a,
    //             uint[2][2] memory b,
    //             uint[2] memory c,
    //             uint[2] memory input
    //         ) public returns (bool r);
}


// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is ERC721Mintable
{

SquareVerifier verifier;

constructor(address verifierAddress) public{
    verifier = SquareVerifier(verifierAddress);
}

// TODO define a solutions struct that can hold an index & an address
struct Solution{
    uint256 index;
    address addr;
}


// TODO define an array of the above struct
Solution[] solutions;

// TODO define a mapping to store unique solutions submitted
mapping (bytes32 => address) uniqueSolutions;


// TODO Create an event to emit when a solution is added
event solutionAdded(uint index, address addr);


// TODO Create a function to add the solutions to the array and emit the event
function addSolution(uint index, address addr, bytes32 key) public {
    Solution memory sol = Solution({
        index: index,
        addr: addr
    });
    solutions.push(sol);
    uniqueSolutions[key] = addr;
    emit solutionAdded(index, addr);
}


// TODO Create a function to mint new NFT only after the solution has been verified
//  - make sure the solution is unique (has not been used before)
//  - make sure you handle metadata as well as tokenSuplly
function mint(address to, uint256 tokenId, uint[2] memory a,
            uint[2][2] memory b, uint[2] memory c, uint[2] memory input)
            public
{
    bytes32 key = keccak256(abi.encodePacked(a, b, c, input));
    require(uniqueSolutions[key] == address(0), "Solution must be unique to mint a token.");
    require(verifier.verifyTx(a,b,c,input), "Solution must be unique to mint a token.");
    addSolution(tokenId, to, key);
    super.mint(to, tokenId);
}

}
