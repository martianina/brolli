//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "base64-sol/base64.sol";

contract BrolliLicenseSimple is ERC721Enumerable, Ownable, ReentrancyGuard {
	using Counters for Counters.Counter;

	Counters.Counter private _tokenIds;

	struct Meta {
		string patentName;
		string imageUri; // PNG URL or ipfs://CID
		string provenanceCid; // IPFS CID for provenance file (or Patent NFT contract hash)
	}

	mapping(uint256 => Meta) public metadataByTokenId;
	mapping(address => bool) public hasLicense; // Track if address already has a license
	
	uint256 public constant MAX_SUPPLY = 50; // Maximum number of licenses that can be issued

	constructor() ERC721("Brolli License (Simple)", "BROLLI-S") {}

	function mint(
		string memory patentName,
		string memory imageUri,
		string memory provenanceCid
	) public nonReentrant returns (uint256) {
		require(!hasLicense[msg.sender], "Address already has a license");
		require(_tokenIds.current() < MAX_SUPPLY, "Maximum supply reached");
		
		// Set hasLicense BEFORE minting to prevent reentrancy exploits
		hasLicense[msg.sender] = true;
		
		_tokenIds.increment();
		uint256 tokenId = _tokenIds.current();
		_safeMint(msg.sender, tokenId);
		metadataByTokenId[tokenId] = Meta({ patentName: patentName, imageUri: imageUri, provenanceCid: provenanceCid });
		
		return tokenId;
	}

	// Get current supply and remaining licenses
	function currentSupply() public view returns (uint256) {
		return _tokenIds.current();
	}

	function remainingSupply() public view returns (uint256) {
		uint256 current = _tokenIds.current();
		return current >= MAX_SUPPLY ? 0 : MAX_SUPPLY - current;
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

	// Make the token non-transferable (soulbound)
	function _beforeTokenTransfer(
		address from,
		address to,
		uint256 tokenId,
		uint256 batchSize
	) internal override {
		require(from == address(0) || to == address(0), "Token is non-transferable");
		super._beforeTokenTransfer(from, to, tokenId, batchSize);
	}

	// Override approve functions to prevent approvals
	function approve(address, uint256) public pure override(ERC721, IERC721) {
		revert("Token is non-transferable");
	}

	function setApprovalForAll(address, bool) public pure override(ERC721, IERC721) {
		revert("Token is non-transferable");
	}

	// Explicit supportsInterface override to silence compiler warnings
	function supportsInterface(bytes4 interfaceId) public view override(ERC721Enumerable) returns (bool) {
		return super.supportsInterface(interfaceId);
	}
} 