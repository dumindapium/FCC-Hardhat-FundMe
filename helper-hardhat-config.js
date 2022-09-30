const networkConfig = {
    5: {
        name: "Goerli",
        ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e"
    },
    31337: {
        name: "localhost",
        ethUsdPriceFeed: ""
    }
};

const developmentChains = ["hardhat", "localhost", 31337];
const DECIMALS = 8;
const INITIAL_ANSWER = 150000000000;

module.exports = {
    networkConfig,
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER
};