// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./PriceConverter.sol";
import "./PropertyShare.sol";

/**
 * @title HomeDAO
 * @notice Main contract managing fractional property ownership and dividend distribution
 */
contract HomeDAO is PriceConverter, Ownable, ReentrancyGuard {

    //--------------------------------------------------------------------
    // VARIABLES

    PropertyShare public propertyShareToken;
    address public daoGovernanceAddress;

    uint256 public propertyListingFee; // Fee to list new property
    uint256 public daoTreasuryPercentage = 500; // 5% to DAO treasury (in basis points)
    uint256 private _propertyIds;

    struct PropertyInfo {
        uint256 id;
        address creator;
        string name;
        string city;
        string latitude;
        string longitude;
        string description;
        string imageUrl;
        uint256 totalValuation; // in USD cents
        uint256 annualYieldPercentage; // in basis points (e.g., 500 = 5%)
        uint256 sharesOutstanding;
        uint256 maxShareSupply;
        bool isArtistHouse;
        uint256 createdAt;
        uint256 accumulatedDividends; // Total ready for distribution
    }

    struct Investment {
        address investor;
        uint256 propertyId;
        uint256 sharesHeld;
        uint256 costBasisUSD; // Total USD invested (in cents)
        uint256 dividendsClaimed;
        uint256 lastClaimTime;
    }

    struct DAOProposal {
        uint256 propertyId;
        string description;
        uint256 proposalType; // 0: maintenance, 1: refinance, 2: management, 3: other
        uint256 forVotes;
        uint256 againstVotes;
        uint256 proposedAt;
        uint256 deadline;
        bool executed;
        bool canceled;
    }

    PropertyInfo[] public properties;
    mapping(uint256 => Investment[]) public propertyInvestments;
    mapping(address => mapping(uint256 => uint256)) public investorShares;
    mapping(uint256 => DAOProposal) public daoProposals;
    mapping(uint256 => mapping(address => bool)) public hasVotedOnProposal;
    mapping(address => uint256) public treasuryBalance;

    uint256 private _proposalIds;

    //--------------------------------------------------------------------
    // EVENTS

    event PropertyListed(
        uint256 indexed propertyId,
        address indexed creator,
        string name,
        string city,
        uint256 valuation,
        bool isArtistHouse
    );

    event PropertyInvested(
        uint256 indexed propertyId,
        address indexed investor,
        uint256 sharesAcquired,
        uint256 amountUSD
    );

    event DividendDistributed(
        uint256 indexed propertyId,
        uint256 totalAmount,
        uint256 sharesOutstanding
    );

    event DividendClaimed(
        uint256 indexed propertyId,
        address indexed investor,
        uint256 amount
    );

    event DAOProposalCreated(
        uint256 indexed proposalId,
        uint256 indexed propertyId,
        string description,
        uint256 deadline
    );

    event DAOVoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        bool support,
        uint256 votingPower
    );

    event DAOProposalExecuted(
        uint256 indexed proposalId,
        bool approved
    );

    //--------------------------------------------------------------------
    // ERRORS

    error HomeDAO__InsufficientFee();
    error HomeDAO__InvalidPropertyId();
    error HomeDAO__InsufficientShares();
    error HomeDAO__InsufficientFunds();
    error HomeDAO__AlreadyVotedOnProposal();
    error HomeDAO__ProposalExpired();
    error HomeDAO__ProposalNotExecutable();
    error HomeDAO__TransferFailed();
    error HomeDAO__UnauthorizedGovernance();

    //--------------------------------------------------------------------
    // MODIFIERS

    modifier onlyGovernance() {
        if(msg.sender != daoGovernanceAddress) revert HomeDAO__UnauthorizedGovernance();
        _;
    }

    modifier validPropertyId(uint256 _propertyId) {
        if(_propertyId >= _propertyIds) revert HomeDAO__InvalidPropertyId();
        _;
    }

    //--------------------------------------------------------------------
    // CONSTRUCTOR

    constructor(
        address _propertyShareAddress,
        uint256 _listingFee,
        address _priceFeedAddress
    ) {
        propertyShareToken = PropertyShare(_propertyShareAddress);
        propertyListingFee = _listingFee;
        priceFeedAddress = _priceFeedAddress;
    }

    //--------------------------------------------------------------------
    // CORE FUNCTIONS

    /**
     * @notice List a new property for fractional investment
     * @param _name Property name
     * @param _city Location
     * @param _latitude Geographic latitude
     * @param _longitude Geographic longitude
     * @param _description Property details
     * @param _imageUrl IPFS/web3.storage image link
     * @param _valuationUSD Property valuation in USD (in cents)
     * @param _annualYieldPercentage Annual yield in basis points
     * @param _maxShares Maximum fractional shares
     * @param _isArtistHouse Is this an Artist House venue?
     */
    function listProperty(
        string memory _name,
        string memory _city,
        string memory _latitude,
        string memory _longitude,
        string memory _description,
        string memory _imageUrl,
        uint256 _valuationUSD,
        uint256 _annualYieldPercentage,
        uint256 _maxShares,
        bool _isArtistHouse
    ) external payable nonReentrant {
        if(msg.value != propertyListingFee) revert HomeDAO__InsufficientFee();

        uint256 _propertyId = _propertyIds;

        PropertyInfo memory _property = PropertyInfo(
            _propertyId,
            msg.sender,
            _name,
            _city,
            _latitude,
            _longitude,
            _description,
            _imageUrl,
            _valuationUSD,
            _annualYieldPercentage,
            0,
            _maxShares,
            _isArtistHouse,
            block.timestamp,
            0
        );

        properties.push(_property);
        _propertyIds++;

        // Distribute listing fee: 95% stays, 5% to DAO treasury
        uint256 daoShare = (msg.value * daoTreasuryPercentage) / 10000;
        treasuryBalance[address(this)] += daoShare;

        emit PropertyListed(
            _propertyId,
            msg.sender,
            _name,
            _city,
            _valuationUSD,
            _isArtistHouse
        );
    }

    /**
     * @notice Invest in a property by purchasing fractional shares
     * @param _propertyId Target property
     * @param _sharesDesired Number of shares to purchase
     */
    function investInProperty(
        uint256 _propertyId,
        uint256 _sharesDesired
    ) external payable validPropertyId(_propertyId) nonReentrant {

        PropertyInfo storage _property = properties[_propertyId];

        if(_property.sharesOutstanding + _sharesDesired > _property.maxShareSupply) {
            revert HomeDAO__InsufficientShares();
        }

        // Calculate price per share based on valuation
        uint256 pricePerShareUSD = _property.totalValuation / _property.maxShareSupply;
        uint256 totalUSD = pricePerShareUSD * _sharesDesired;

        // Convert required ETH amount
        uint256 requiredETH = convertFromUSD(totalUSD);
        if(msg.value < requiredETH) revert HomeDAO__InsufficientFunds();

        // Mint shares to investor
        propertyShareToken.mint(msg.sender, _propertyId, _sharesDesired, "");

        // Record investment
        investorShares[msg.sender][_propertyId] += _sharesDesired;
        _property.sharesOutstanding += _sharesDesired;

        // Track investment for dividend calculations
        Investment memory _investment = Investment(
            msg.sender,
            _propertyId,
            _sharesDesired,
            totalUSD,
            0,
            block.timestamp
        );
        propertyInvestments[_propertyId].push(_investment);

        // Distribute funds: 95% to property creator, 5% to DAO
        uint256 daoShare = (msg.value * daoTreasuryPercentage) / 10000;
        uint256 creatorShare = msg.value - daoShare;

        treasuryBalance[address(this)] += daoShare;

        (bool success,) = payable(_property.creator).call{value: creatorShare}("");
        if(!success) revert HomeDAO__TransferFailed();

        emit PropertyInvested(
            _propertyId,
            msg.sender,
            _sharesDesired,
            totalUSD
        );
    }

    /**
     * @notice Distribute accumulated dividends to all shareholders
     * @param _propertyId Target property
     * @param _dividendAmountETH Total dividend amount to distribute
     */
    function distributeDividends(
        uint256 _propertyId,
        uint256 _dividendAmountETH
    ) external payable validPropertyId(_propertyId) nonReentrant {

        PropertyInfo storage _property = properties[_propertyId];

        if(msg.value != _dividendAmountETH) revert HomeDAO__InsufficientFunds();
        if(_property.sharesOutstanding == 0) revert HomeDAO__InsufficientShares();

        // Distribute pro-rata to all shareholders
        uint256 dividendPerShare = _dividendAmountETH / _property.sharesOutstanding;
        _property.accumulatedDividends += _dividendAmountETH;

        emit DividendDistributed(
            _propertyId,
            _dividendAmountETH,
            _property.sharesOutstanding
        );
    }

    /**
     * @notice Claim accrued dividends for a property
     * @param _propertyId Target property
     */
    function claimDividends(
        uint256 _propertyId
    ) external nonReentrant {

        if(investorShares[msg.sender][_propertyId] == 0) revert HomeDAO__InsufficientShares();

        PropertyInfo storage _property = properties[_propertyId];
        uint256 sharesHeld = investorShares[msg.sender][_propertyId];

        // Calculate dividend per share
        uint256 dividendPerShare = _property.accumulatedDividends / _property.sharesOutstanding;
        uint256 claimableAmount = sharesHeld * dividendPerShare;

        if(claimableAmount == 0) revert HomeDAO__InsufficientFunds();

        // Reduce accumulated dividends
        _property.accumulatedDividends -= claimableAmount;

        // Transfer to investor
        (bool success,) = payable(msg.sender).call{value: claimableAmount}("");
        if(!success) revert HomeDAO__TransferFailed();

        emit DividendClaimed(_propertyId, msg.sender, claimableAmount);
    }

    //--------------------------------------------------------------------
    // DAO GOVERNANCE FUNCTIONS

    /**
     * @notice Initiate a DAO vote on a property decision
     * @param _propertyId Target property
     * @param _description Vote description
     * @param _proposalType Type of proposal (0-3)
     */
    function initiateDAOVote(
        uint256 _propertyId,
        string memory _description,
        uint256 _proposalType
    ) external validPropertyId(_propertyId) returns (uint256) {

        uint256 _proposalId = _proposalIds;
        uint256 votingPeriod = 7 days;

        DAOProposal memory _proposal = DAOProposal(
            _propertyId,
            _description,
            _proposalType,
            0,
            0,
            block.timestamp,
            block.timestamp + votingPeriod,
            false,
            false
        );

        daoProposals[_proposalId] = _proposal;
        _proposalIds++;

        emit DAOProposalCreated(
            _proposalId,
            _propertyId,
            _description,
            block.timestamp + votingPeriod
        );

        return _proposalId;
    }

    /**
     * @notice Cast a DAO vote on a proposal
     * @param _proposalId Proposal ID
     * @param _support Vote direction (true = yes, false = no)
     * @param _votingPower BEZY tokens delegated for voting
     */
    function castDAOVote(
        uint256 _proposalId,
        bool _support,
        uint256 _votingPower
    ) external {

        DAOProposal storage _proposal = daoProposals[_proposalId];

        if(block.timestamp > _proposal.deadline) revert HomeDAO__ProposalExpired();
        if(hasVotedOnProposal[_proposalId][msg.sender]) revert HomeDAO__AlreadyVotedOnProposal();

        hasVotedOnProposal[_proposalId][msg.sender] = true;

        if(_support) {
            _proposal.forVotes += _votingPower;
        } else {
            _proposal.againstVotes += _votingPower;
        }

        emit DAOVoteCast(_proposalId, msg.sender, _support, _votingPower);
    }

    /**
     * @notice Execute a DAO proposal after voting period closes
     * @param _proposalId Proposal ID to execute
     */
    function executeDAOProposal(
        uint256 _proposalId
    ) external onlyGovernance {

        DAOProposal storage _proposal = daoProposals[_proposalId];

        if(block.timestamp <= _proposal.deadline) revert HomeDAO__ProposalNotExecutable();
        if(_proposal.executed || _proposal.canceled) revert HomeDAO__ProposalNotExecutable();

        bool approved = _proposal.forVotes > _proposal.againstVotes;
        _proposal.executed = true;

        emit DAOProposalExecuted(_proposalId, approved);
    }

    //--------------------------------------------------------------------
    // ADMIN FUNCTIONS

    function setDAOGovernanceAddress(address _governanceAddress) external onlyOwner {
        daoGovernanceAddress = _governanceAddress;
    }

    function updateListingFee(uint256 _newFee) external onlyOwner {
        propertyListingFee = _newFee;
    }

    function updateDAOTreasuryPercentage(uint256 _newPercentage) external onlyOwner {
        daoTreasuryPercentage = _newPercentage;
    }

    function withdrawTreasury(uint256 _amount) external onlyOwner nonReentrant {
        if(_amount > treasuryBalance[address(this)]) revert HomeDAO__InsufficientFunds();

        treasuryBalance[address(this)] -= _amount;

        (bool success,) = payable(owner()).call{value: _amount}("");
        if(!success) revert HomeDAO__TransferFailed();
    }

    //--------------------------------------------------------------------
    // VIEW FUNCTIONS

    function getProperty(uint256 _propertyId)
        external
        view
        validPropertyId(_propertyId)
        returns (PropertyInfo memory)
    {
        return properties[_propertyId];
    }

    function getAllProperties() external view returns (PropertyInfo[] memory) {
        return properties;
    }

    function getPropertyInvestments(uint256 _propertyId)
        external
        view
        validPropertyId(_propertyId)
        returns (Investment[] memory)
    {
        return propertyInvestments[_propertyId];
    }

    function getInvestorShares(address _investor, uint256 _propertyId)
        external
        view
        returns (uint256)
    {
        return investorShares[_investor][_propertyId];
    }

    function getDAOProposal(uint256 _proposalId)
        external
        view
        returns (DAOProposal memory)
    {
        return daoProposals[_proposalId];
    }

    function getTreasuryBalance() external view returns (uint256) {
        return treasuryBalance[address(this)];
    }

    function getPropertyCount() external view returns (uint256) {
        return _propertyIds;
    }
}
