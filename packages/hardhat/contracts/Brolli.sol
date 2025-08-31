//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "base64-sol/base64.sol";

contract Brolli is ERC721Enumerable, Ownable, ReentrancyGuard {
	using Counters for Counters.Counter;

	Counters.Counter private _tokenIds;

	struct Meta {
		string name;
		string imageUri;
		string provenanceCid;
	}

	// Events
	event DefaultImageUriUpdated(string newImageUri);
	event DefaultProvenanceCidUpdated(string newProvenanceCid);

	mapping(uint256 => Meta) public metadataByTokenId;
	mapping(address => bool) public hasLicense; // Track if address already has a license

	uint256 public constant MAX_SUPPLY = 50; // Maximum number of licenses that can be issued

	// Default URIs for new mints
	string public defaultImageUri = "https://tan-everyday-mite-419.mypinata.cloud/ipfs/bafkreialme2ca3b36nzq5rqqdqaw3k2le4uvgrdxtdj33t2j4sn44amisi";
	string public defaultProvenanceCid = "https://tan-everyday-mite-419.mypinata.cloud/ipfs/bafkreidc7qbkdsfirbetsu5owm56oeqkhwhqlxpfgjio4qy3xexigod2nq";

	constructor() ERC721("Brolli", "BROLLI") {}

	function mint(
		string memory name,
		string memory imageUri,
		string memory provenanceCid
	) public nonReentrant returns (uint256) {
		require(!hasLicense[msg.sender], "Address already has Brolli");
		require(_tokenIds.current() < MAX_SUPPLY, "Maximum supply reached");

		// Set hasLicense BEFORE minting to prevent reentrancy exploits
		hasLicense[msg.sender] = true;

		_tokenIds.increment();
		uint256 tokenId = _tokenIds.current();
		_safeMint(msg.sender, tokenId);

		// Use default URIs if empty strings provided
		string memory finalImageUri = bytes(imageUri).length == 0 ? defaultImageUri : imageUri;
		string memory finalProvenanceCid = bytes(provenanceCid).length == 0 ? defaultProvenanceCid : provenanceCid;

		metadataByTokenId[tokenId] = Meta({
			name: name,
			imageUri: finalImageUri,
			provenanceCid: finalProvenanceCid
		});

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

	// Owner-only functions to update default URIs
	function updateDefaultImageUri(string memory newImageUri) public onlyOwner {
		defaultImageUri = newImageUri;
		emit DefaultImageUriUpdated(newImageUri);
	}

	function updateDefaultProvenanceCid(string memory newProvenanceCid) public onlyOwner {
		defaultProvenanceCid = newProvenanceCid;
		emit DefaultProvenanceCidUpdated(newProvenanceCid);
	}

	function tokenURI(uint256 tokenId) public view override returns (string memory) {
		require(_exists(tokenId), "Token does not exist");
		Meta storage m = metadataByTokenId[tokenId];

		bytes memory json = abi.encodePacked(
			"{",
			'"name":"Brolli ', m.name, '",',
			'"description":"for BUIDLers",',
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