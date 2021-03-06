// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract FindMusicNFT is ERC721, ERC721Enumerable, ERC721URIStorage{

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct CreatorWhiteListData{
        address creator;
        string dataURL;
    }

    struct MusicNFTData{
        address creator;
        uint256 tokenID;
        string metaURL;
    }

    address private _contract_owner;

    mapping( address => MusicNFTData[] ) private _musicNFTData;
    // address => id => idx
    // _musicNFTDataIdx[ address ][ tokenID] => token Idx
    mapping( address => mapping( uint256 => uint256 ) ) private _musicNFTDataIdx;

    mapping( address => bool ) private _isCreatorWhiteList;
    CreatorWhiteListData[] private _creatorWhiteListData;
    mapping( address => uint256 ) private _creatorWhiteListDataIdx;

    event EventCreateMusicNFT( address owner, uint256 tokenID, string url );
    event EventAddWhiteList( address creator );
    event EventUpdateWhiteList( address creator, uint256 index, string url );

    constructor() ERC721("FindMusicNFT", "FMN") {
        _contract_owner = msg.sender;
        _isCreatorWhiteList[ msg.sender ] = true;
    }

    function getContractOwner() public view returns ( address ) {
        return _contract_owner;
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

    function getURLByTokenID( uint256 tokenID ) public view returns ( string memory ) {
        return tokenURI( tokenID);
    }

    function getOwnerByTokenID( uint256 tokenID ) public view returns ( address ){
        return ownerOf( tokenID );
    }

    function getTokenIDByOwnerIndex( address owner, uint256 index ) public view returns ( uint256 ) {
        return tokenOfOwnerByIndex( owner, index );
    }

    function getTotalTokenIDsByOwner( address owner ) public view returns ( uint256 ){
        return balanceOf( owner );
    }

    function getTotalTokenIDs() public view returns ( uint256 ) {
        return totalSupply();
    }

    function getWhiteListData() public view returns ( CreatorWhiteListData[] memory ){
        return _creatorWhiteListData;
    }

    function getTotalWhiteList() public view returns ( uint256 ){
        return _creatorWhiteListData.length;
    }

    function getCreatorData( address creator ) public view returns ( CreatorWhiteListData memory ) {
        require( creator != address(0), "fail address..!!" );
        uint256 idx = _creatorWhiteListDataIdx[ creator ];
        return _creatorWhiteListData[ idx ];
    }

    function addCreatorWhitelist( address creator ) public {
        require( _contract_owner == msg.sender, "you are not contract owner!!" );
        _isCreatorWhiteList[ creator ] = true;
        emit EventAddWhiteList( creator );
    }

    function setCreatorWhiteListData( string memory createURL ) public {

        require( _isCreatorWhiteList[ msg.sender ] == true, "you are not in the whitelist !!" );
        uint256 idx ;

        if( msg.sender == _contract_owner ){
            idx = 0;
        }else if( _creatorWhiteListDataIdx[ msg.sender ] == 0 ){
            idx = _creatorWhiteListData.length;
        }else{
            idx = _creatorWhiteListDataIdx[ msg.sender ];
        }
        
        updateCreatorWhiteListData( msg.sender, idx, createURL );
    }

    function updateCreatorWhiteListData( address creator, uint256 idx, string memory createURL ) internal {

        if( idx >= _creatorWhiteListData.length ){

            _creatorWhiteListDataIdx[ creator ] = _creatorWhiteListData.length;
            _creatorWhiteListData.push( CreatorWhiteListData( creator, createURL ) );

        }else{
            _creatorWhiteListData[ idx ].dataURL = createURL;
        }

        emit EventUpdateWhiteList( creator, _creatorWhiteListDataIdx[ creator ], createURL );
    }

    function createMusicNFT( string memory musicMetaURL ) public {

        require( _isCreatorWhiteList[ msg.sender ] == true, "you are not in whitelist!!" );

        _tokenIds.increment();
        uint256 tokenID = _tokenIds.current();

        _mint( msg.sender, tokenID );
        _setTokenURI( tokenID, musicMetaURL );

        _musicNFTDataIdx[ msg.sender ][ tokenID ] = _musicNFTData[ msg.sender ].length;
        _musicNFTData[ msg.sender ].push( MusicNFTData( msg.sender, tokenID, musicMetaURL ) );

        emit EventCreateMusicNFT( msg.sender, tokenID, musicMetaURL );
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
