const { run } = require("hardhat");

const verify = async (contractAddress, args) => {
    console.log("Verify started...");

    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args
        });

    }
    catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already verified");
        } else {
            console.error("Verify errors: ", e);
        }
    }
}

module.exports = { verify };