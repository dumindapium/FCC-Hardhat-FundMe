const { deployments, getNamedAccounts, ethers } = require('hardhat');

const main = async () => {

    const { deployer } = await getNamedAccounts();
    await deployments.fixture(["all"]);

    const fundMeContractApi = await deployments.get("FundMe");
    const fundMe = await ethers.getContractAt(fundMeContractApi.abi, fundMeContractApi.address);

    console.log(`Got fundme contract at ${fundMe.address}`);
    console.log(`Funding...`);
    const txResponse = await fundMe.fund({ value: ethers.utils.parseEther("0.05") });
    await txResponse.wait();
    console.log(`Funded...`);

}


main()
    .then(() => {
        process.exit(0);
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });