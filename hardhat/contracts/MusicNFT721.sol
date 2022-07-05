// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract JasonFinleyMusicNFT is ERC721, ERC721Enumerable, ERC721URIStorage{

    using Counters for Counters.Counter;

    struct MusicNFTData{
        address creator;
        uint256 tokenID;
        string metaURL;
    }

    Counters.Counter private _tokenIDs;

    address private _contract_owner;
    mapping( address => bool ) private _isCreatorWhiteList;
    mapping( address => MusicNFTData[] ) private _musicNFTData;
    // address => id => idx
    // _musicNFTDataIdx[ address ][ tokenID] => token Idx
    mapping( address => mapping( uint256 => uint256 ) ) private _musicNFTDataIdx;

    event EventCreateMusicNFT( address owner, uint256 tokenID, string url );

    constructor() ERC721("Jason Finley Music NFT", "JFMN") {
        _contract_owner = msg.sender;
        _isCreatorWhiteList[ msg.sender ] = true;
    }

    function getMusicNFTByOwner( address owner ) public view returns( MusicNFTData[] memory ) {
        return _musicNFTData[ owner ];
    }

    function getMusicNFTByOwnerIdx( address owner, uint256 index ) public view returns ( MusicNFTData memory ) {

        require( index < _musicNFTData[ owner ].length , "fail!! idx too more !!" );

        return _musicNFTData[ owner ][ index ];
    }

    function getMusicNFTByTokenID( uint256 tokenID ) public view returns ( MusicNFTData memory ){
        MusicNFTData memory data;
        data.tokenID = tokenID;
        data.creator = getOwnerByTokenID( tokenID );
        data.metaURL = getURLByTokenID( tokenID);
        return data;
    }

    function getURLByTokenID( uint256 tokenID ) internal view returns ( string memory ) {
        return tokenURI( tokenID);
    }

    function getOwnerByTokenID( uint256 tokenID ) internal view returns ( address ){
        return ownerOf( tokenID );
    }

    function getTokenIDByOwnerIndex( address owner, uint256 index ) internal view returns ( uint256 ) {
        return tokenOfOwnerByIndex( owner, index );
    }

    function getTotalTokenIDsByOwner( address owner ) public view returns ( uint256 ){
        return balanceOf( owner );
    }

    function getTotalTokenIDs() internal view returns ( uint256 ) {
        return totalSupply();
    }

    function setWhitelist( address creator ) public {
        require( _contract_owner == msg.sender, "you are not contract owner!!" );
        _isCreatorWhiteList[ creator ] = true;
    }

    function createMusicNFT( string memory musicMetaURL ) public returns ( uint256 ) {
        uint256 tokenID;

        require( _isCreatorWhiteList[ msg.sender ] == true, "you are not in whitelist!!" );

        tokenID = _tokenIDs.current();

        _mint( msg.sender, tokenID );
        _setTokenURI( tokenID, musicMetaURL );

        _musicNFTDataIdx[ msg.sender ][ tokenID ] = _musicNFTData[ msg.sender ].length;
        _musicNFTData[ msg.sender ].push( MusicNFTData( msg.sender, tokenID, musicMetaURL ) );

        _tokenIDs.increment();
        emit EventCreateMusicNFT( msg.sender, tokenID, musicMetaURL );
        
        return tokenID;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "";
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
