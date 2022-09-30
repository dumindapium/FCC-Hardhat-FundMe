const { deployments, getNamedAccounts, ethers, network } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");
const { assert, expect } = require("chai");


!developmentChains.includes(network.name) ?
    describe.skip :
    describe("FundMe", async () => {
        let deployer;
        let fundMe;
        let mockV3Aggregator;
        const sendAmount = ethers.utils.parseEther("1");

        beforeEach(async () => {
            //deploy fundme contract
            //using Hardhat-deploy
            //
            deployer = (await getNamedAccounts()).deployer;
            await deployments.fixture(["all"]);


            //fundMe = await ethers.getContract("FundMe", deployer); // getContract doesn't work anymore
            //mockV3Aggregator = await ethers.getContractAt("MockV3Aggregator", deployer); // getContract doesn't work anymore

            const fundMeContractApi = await deployments.get("FundMe");
            fundMe = await ethers.getContractAt(fundMeContractApi.abi, fundMeContractApi.address);
            const aggrContractApi = await deployments.get("MockV3Aggregator");
            mockV3Aggregator = await ethers.getContractAt(aggrContractApi.abi, aggrContractApi.address);

        });

        describe("constructor", async () => {
            it("Set aggregator correctly", async () => {
                const fundmeAgg = await fundMe.getPriceFeed();
                assert.equal(fundmeAgg, mockV3Aggregator.address);
            });
        });

        describe("fund", async () => {
            it("Should fail for 0 ETH", async () => {
                await expect(fundMe.fund()).to.be.revertedWith("You need to spend more ETH!");
            });

            it("Updated the amount data structure", async () => {
                await fundMe.fund({ value: sendAmount });
                const response = await fundMe.getAddressToAmountFunded(deployer);

                assert.equal(response.toString(), sendAmount.toString());
            });

            it("Add funders to array", async () => {
                await fundMe.fund({ value: sendAmount });
                const response = await fundMe.getFunder(0);

                assert.equal(response, deployer);
            });
        });


        describe("withdraw", async () => {
            beforeEach(async () => {
                await fundMe.fund({ value: sendAmount });
            });

            it("Withdraw with owner funded", async () => {
                // in beforeEach the same deployer will funds to the contract and
                // and witdraw by him
                const startingFundmeBalance = await ethers.provider.getBalance(fundMe.address);
                const startingDeployerBalance = await ethers.provider.getBalance(deployer);

                const txResponse = await fundMe.withdraw();
                const txReceipt = await txResponse.wait();
                const { gasUsed, effectiveGasPrice } = txReceipt;

                const gasCost = gasUsed.mul(effectiveGasPrice);

                const endingFundmeBalance = await ethers.provider.getBalance(fundMe.address);
                const endingDeployerBalance = await ethers.provider.getBalance(deployer);

                assert.equal(endingFundmeBalance, 0);
                assert.equal(
                    startingDeployerBalance.add(startingFundmeBalance).toString(),
                    endingDeployerBalance.add(gasCost).toString()
                );
            });

            it("Cheap Withdraw with owner funded", async () => {
                // in beforeEach the same deployer will funds to the contract and
                // and witdraw by him
                const startingFundmeBalance = await ethers.provider.getBalance(fundMe.address);
                const startingDeployerBalance = await ethers.provider.getBalance(deployer);

                const txResponse = await fundMe.cheapWithdraw();
                const txReceipt = await txResponse.wait();
                const { gasUsed, effectiveGasPrice } = txReceipt;

                const gasCost = gasUsed.mul(effectiveGasPrice);

                const endingFundmeBalance = await ethers.provider.getBalance(fundMe.address);
                const endingDeployerBalance = await ethers.provider.getBalance(deployer);

                assert.equal(endingFundmeBalance, 0);
                assert.equal(
                    startingDeployerBalance.add(startingFundmeBalance).toString(),
                    endingDeployerBalance.add(gasCost).toString()
                );
            });

            it("Withdraw with multiple funders", async () => {
                //first to be funded by other users in the chain
                const accounts = await ethers.getSigners();
                for (let index = 1; index < 4; index++) { // ignore 0th index as the deployer has already funded in beforeEach
                    const account = accounts[index];
                    const fundmeConnectedContract = await fundMe.connect(account);
                    await fundmeConnectedContract.fund({ value: sendAmount });
                }

                const startingFundmeBalance = await ethers.provider.getBalance(fundMe.address);
                const startingDeployerBalance = await ethers.provider.getBalance(deployer);

                const txResponse = await fundMe.withdraw();
                const txReceipt = await txResponse.wait();
                const { gasUsed, effectiveGasPrice } = txReceipt;

                const gasCost = gasUsed.mul(effectiveGasPrice);

                const endingFundmeBalance = await ethers.provider.getBalance(fundMe.address);
                const endingDeployerBalance = await ethers.provider.getBalance(deployer);

                assert.equal(endingFundmeBalance, 0);
                assert.equal(
                    startingDeployerBalance.add(startingFundmeBalance).toString(),
                    endingDeployerBalance.add(gasCost).toString()
                );


                for (let index = 1; index < 4; index++) {
                    const account = accounts[index];
                    const finalValue = await fundMe.getAddressToAmountFunded(account.address);
                    assert.equal(finalValue, 0);
                }
            });
        })


    });