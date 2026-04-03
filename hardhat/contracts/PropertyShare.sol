// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";

/**
 * @title PropertyShare
 * @notice ERC1155 token representing fractional ownership of properties
 */
contract PropertyShare is ERC1155URIStorage, Ownable {

    address public homeDAOContract;

    struct ShareMetadata {
        uint256 propertyId;
        uint256 totalSupply;
        uint256 costBasisPerShare; // in USD cents
        uint256 createdAt;
    }

    mapping(uint256 => ShareMetadata) public shareMetadata;
    mapping(uint256 => uint256) private _shareIds;

    event PropertyShareMinted(
        uint256 indexed tokenId,
        uint256 indexed propertyId,
        address indexed to,
        uint256 amount
    );

    event PropertyShareBurned(
        uint256 indexed tokenId,
        address indexed from,
        uint256 amount
    );

    modifier onlyHomeDAO() {
        require(msg.sender == homeDAOContract, "Only HomeDAO can call");
        _;
    }

    constructor() ERC1155("") {
        // Contract will be initialized with HomeDAO address
    }

    /**
     * @notice Set the HomeDAO contract address
     */
    function setHomeDAOContract(address _homeDAOAddress) external onlyOwner {
        homeDAOContract = _homeDAOAddress;
    }

    /**
     * @notice Mint property share tokens
     * @param _to Recipient address
     * @param _propertyId Associated property ID
     * @param _amount Number of shares to mint
     * @param _data Optional data
     */
    function mint(
        address _to,
        uint256 _propertyId,
        uint256 _amount,
        bytes memory _data
    ) external onlyHomeDAO {

        uint256 tokenId = _propertyId;

        // Initialize metadata on first mint for this property
        if(shareMetadata[tokenId].createdAt == 0) {
            shareMetadata[tokenId] = ShareMetadata(
                _propertyId,
                _amount,
                0,
                block.timestamp
            );
        } else {
            shareMetadata[tokenId].totalSupply += _amount;
        }

        _mint(_to, tokenId, _amount, _data);

        emit PropertyShareMinted(tokenId, _propertyId, _to, _amount);
    }

    /**
     * @notice Burn property share tokens
     * @param _from Token holder
     * @param _propertyId Associated property ID
     * @param _amount Shares to burn
     */
    function burn(
        address _from,
        uint256 _propertyId,
        uint256 _amount
    ) external {

        require(
            msg.sender == _from || isApprovedForAll(_from, msg.sender),
            "Unauthorized burn"
        );

        uint256 tokenId = _propertyId;
        _burn(_from, tokenId, _amount);

        if(shareMetadata[tokenId].totalSupply >= _amount) {
            shareMetadata[tokenId].totalSupply -= _amount;
        }

        emit PropertyShareBurned(tokenId, _from, _amount);
    }

    /**
     * @notice Get share metadata for a property
     */
    function getShareMetadata(uint256 _propertyId)
        external
        view
        returns (ShareMetadata memory)
    {
        return shareMetadata[_propertyId];
    }

    /**
     * @notice Get total supply of shares for a property
     */
    function getTotalSupply(uint256 _propertyId)
        external
        view
        returns (uint256)
    {
        return shareMetadata[_propertyId].totalSupply;
    }

    /**
     * @notice Get investor's share balance for a property
     */
    function getInvestorBalance(address _investor, uint256 _propertyId)
        external
        view
        returns (uint256)
    {
        return balanceOf(_investor, _propertyId);
    }

    /**
     * @notice Set URI for property share metadata
     */
    function setURI(uint256 _tokenId, string memory _uri)
        external
        onlyOwner
    {
        _setURI(_tokenId, _uri);
    }
}
