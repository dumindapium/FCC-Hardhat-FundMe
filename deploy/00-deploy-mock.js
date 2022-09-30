//const { network } = require("hardhat");
const { developmentChains, DECIMALS, INITIAL_ANSWER } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    log("Chain id is:", chainId, "deployer:", deployer);
    // if (developmentChains.includes(chainId)) {
    if (chainId == 31337) {
        log("Development chain detected. Deploying mock...");

        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            args: [DECIMALS, INITIAL_ANSWER],
            log: true
        });

        log("Mocks deployed");
        log("-----------------------------------");
    }
}

module.exports.tags = ["all", "mocks"];