// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/**
 * @title PriceConverter
 * @notice Convert between USD and ETH using Chainlink price feeds
 */
contract PriceConverter {

    AggregatorV3Interface public priceFeed;
    address public priceFeedAddress;

    /**
     * @notice Get current ETH/USD price from Chainlink
     */
    function getPrice() internal view returns (uint256) {
        (, int256 answer, , , ) = priceFeed.latestRoundData();
        return uint256(answer * 10000000000);
    }

    /**
     * @notice Convert USD amount to ETH
     * @param usdAmount Amount in USD (in cents)
     * @return Amount in Wei
     */
    function convertFromUSD(uint256 usdAmount) public view returns (uint256) {
        uint256 ethPrice = getPrice();
        uint256 ethAmountInWei = (usdAmount * 1000000000000000000) / ethPrice;
        return ethAmountInWei;
    }

    /**
     * @notice Convert ETH amount to USD
     * @param ethAmount Amount in Wei
     * @return Amount in USD (in cents)
     */
    function convertToUSD(uint256 ethAmount) public view returns (uint256) {
        uint256 ethPrice = getPrice();
        uint256 usdAmount = (ethAmount * ethPrice) / 1000000000000000000;
        return usdAmount;
    }

    /**
     * @notice Get current ETH/USD price (with 8 decimals)
     */
    function getPriceWithDecimals() public view returns (uint256) {
        (, int256 answer, , , ) = priceFeed.latestRoundData();
        return uint256(answer);
    }
}
