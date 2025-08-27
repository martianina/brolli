//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "base64-sol/base64.sol";

contract BrolliLicenseSimple is ERC721Enumerable, Ownable {
	using Counters for Counters.Counter;

	Counters.Counter private _tokenIds;

	struct Meta {
		string patentName;
		string imageUri; // PNG URL or ipfs://CID
		string provenanceCid; // IPFS CID for provenance file (or Patent NFT contract hash)
	}

	mapping(uint256 => Meta) public metadataByTokenId;

	constructor() ERC721("Brolli License (Simple)", "BROLLI-S") {}

	function mint(
		string memory patentName,
		string memory imageUri,
		string memory provenanceCid
	) public returns (uint256) {
		_tokenIds.increment();
		uint256 tokenId = _tokenIds.current();
		_safeMint(msg.sender, tokenId);
		metadataByTokenId[tokenId] = Meta({ patentName: patentName, imageUri: imageUri, provenanceCid: provenanceCid });
		return tokenId;
	}

	function tokenURI(uint256 tokenId) public view override returns (string memory) {
		require(_exists(tokenId), "Token does not exist");
		Meta storage m = metadataByTokenId[tokenId];

		bytes memory json = abi.encodePacked(
			"{",
			'"name":"Brolli for BUIDLers ', m.patentName, '",',
			'"description":"Legal IP cover for developers of decentralized systems",',
			'"image":"', m.imageUri, '",',
			'"attributes":[',
			'{"trait_type":"Provenance CID","value":"', m.provenanceCid, '"}',
			'],',
			'"resources":{',
			'"provenance":"', m.provenanceCid, '"}',
			"}"
		);

		return string(
			abi.encodePacked(
				"data:application/json;base64,",
				Base64.encode(json)
			)
		);
	}
} 