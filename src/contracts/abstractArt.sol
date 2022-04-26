// Contract based on https://docs.openzeppelin.com/contracts/4.x/erc721
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Abstract is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    string public baseURI;
    string public baseExtension = ".json";

    constructor() ERC721("Test Contract 1", "JL") {
        mintNFT(msg.sender, 3);
    }

    function mintNFT(address recipient, uint256 _mintAmount) public onlyOwner {
        for (uint256 i = 0; i < _mintAmount; i++) {
            _tokenIds.increment();

            uint256 newItemId = _tokenIds.current();
            _mint(recipient, newItemId);
            _setTokenURI(
                newItemId,
                string(
                    bytes.concat(
                        bytes(
                            "ipfs://QmdbnwfBNE6ZekuppZnx9rk76sAmMDucnHP78UZzhwu4S3/metadata/"
                        ),
                        bytes(Strings.toString(i)),
                        bytes(".json")
                    )
                )
            );
        }
    }
}
