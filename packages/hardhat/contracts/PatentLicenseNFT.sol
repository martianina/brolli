//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "base64-sol/base64.sol";

contract PatentLicenseNFT is ERC721Enumerable, Ownable {
	using Counters for Counters.Counter;
	using Strings for uint256;

	Counters.Counter private _tokenIds;

	struct LicenseTerms {
		string licensorName;
		string patentNumber;
		string patentTitle;
		string governingLaw;
		string provenanceHash;
	}

	mapping(uint256 => LicenseTerms) public licenseByTokenId;

	constructor() ERC721("Brolli Patent License", "BROLLI") {}

	function mintLicense(
		string memory licensorName,
		string memory patentNumber,
		string memory patentTitle,
		string memory governingLaw,
		string memory provenanceHash
	) public returns (uint256) {
		_tokenIds.increment();
		uint256 tokenId = _tokenIds.current();
		_safeMint(msg.sender, tokenId);

		licenseByTokenId[tokenId] = LicenseTerms({
			licensorName: licensorName,
			patentNumber: patentNumber,
			patentTitle: patentTitle,
			governingLaw: governingLaw,
			provenanceHash: provenanceHash
		});

		return tokenId;
	}

	function tokenURI(uint256 tokenId) public view override returns (string memory) {
		require(_exists(tokenId), "Token does not exist");
		LicenseTerms storage t = licenseByTokenId[tokenId];

		string memory name = string(
			abi.encodePacked("Patent License NFT - ", t.patentTitle)
		);

		string memory description = string(
			abi.encodePacked(
				"Brolli NFT represents a non-transferable, non-exclusive, worldwide, perpetual, single-use license under U.S. Patent No. ",
				t.patentNumber,
				". License rights transfer automatically with the NFT. Full legal terms attached."
			)
		);

		bytes memory json = abi.encodePacked(
			"{",
			'"name":"', name, '",',
			'"description":"', description, '",',
			'"license_terms":{',
			'"licensor":"', t.licensorName, '",',
			'"patent":{',
			'"number":"', t.patentNumber, '",',
			'"title":"', t.patentTitle, '"},',
			'"rights":{',
			'"scope":"Non-exclusive, worldwide, perpetual, single-use",',
			'"transferable":false},',
			'"governing_law":"', t.governingLaw, '",',
			'"warranties":"none"},',
			'"resources":{',
			'"provenance_hash":"', t.provenanceHash, '"}'
		);

		return string(
			abi.encodePacked(
				"data:application/json;base64,",
				Base64.encode(
					abi.encodePacked(
						json,
						"}"
					)
				)
			)
		);
	}
} 