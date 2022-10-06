const { deployments, getNamedAccounts, ethers } = require('hardhat');

const main = async () => {

    const { deployer } = await getNamedAccounts();
    await deployments.fixture(["all"]);

    const fundMeContractApi = await deployments.get("FundMe");
    const fundMe = await ethers.getContractAt(fundMeContractApi.abi, fundMeContractApi.address);

    console.log("FundMe at: " + fundMe.address);

    const fundMeBalance = await ethers.provider.getBalance(fundMe.address);
    console.log("FundMe balance: " + fundMeBalance);

};

main().then(() => process.exit(0))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });