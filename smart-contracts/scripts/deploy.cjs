const hre = require("hardhat");

async function main() {
    const TaskJournal = await hre.ethers.getContractFactory("TaskJournal");
    const taskJournal = await TaskJournal.deploy();

    await taskJournal.waitForDeployment();

    console.log("TaskJournal deployed to:", await taskJournal.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
