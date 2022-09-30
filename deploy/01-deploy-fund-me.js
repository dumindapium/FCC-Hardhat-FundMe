//import
//main function
//calling main function

const env = require("hardhat");
const { networkConfig, developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    const chainId = network.config.chainId;

    log("Chain id is:", chainId, "deployer:", deployer);
    // getting pricefeed address from Mock contrack or actual
    let ethUsdPricefeedAddress;
    //if (chainId == 31337) {
    if (developmentChains.includes(chainId)) {
        const mockContract = await deployments.get("MockV3Aggregator");
        ethUsdPricefeedAddress = mockContract.address;
    } else {
        ethUsdPricefeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
    }

    log("Selected pricefeed address: ", ethUsdPricefeedAddress);

    const args = [ethUsdPricefeedAddress];
    if (ethUsdPricefeedAddress) {
        const fundMe = await deploy("FundMe", {
            from: deployer,
            args: args,
            log: true,
            waitConfirmations: network.config.blockConfirmations || 1
        });

        log("Fundme deployed");
        log("-----------------------------------");

        if (!developmentChains.includes(chainId) && process.env.ETHERSCAN_API_KEY) {
            await verify(fundMe.address, args);
        }
    }
}

module.exports.tags = ["all", "fundme"];