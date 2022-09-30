const { deployments, getNamedAccounts, ethers, getChainId } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");
const { assert, expect } = require("chai");

developmentChains.includes(network.name) ?
    describe.skip :
    describe("FundMe", async () => {
        let deployer;
        let fundMe;
        //let mockV3Aggregator;
        const sendAmount = ethers.utils.parseEther("0.09");

        beforeEach(async () => {
            //deploy fundme contract
            //using Hardhat-deploy
            //
            deployer = (await getNamedAccounts()).deployer;
            //await deployments.fixture(["all"]);

            const fundMeContractApi = await deployments.get("FundMe");
            fundMe = await ethers.getContractAt(fundMeContractApi.abi, fundMeContractApi.address);

        });


        it("should allow people to fund and witdraw", async () => {
            await fundMe.fund({ value: sendAmount });
            await fundMe.withdraw();

            const contractBalance = await ethers.provider.getBalance(fundMe.address);
            assert.equal(contractBalance, 0);
        });

    });