const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FindMusicNFT", function () {
  it("test metadataURL is Right?", async function () {
    const FindMusicNFT = await ethers.getContractFactory("FindMusicNFT");
    const findmusicnft = await FindMusicNFT.deploy();
    await findmusicnft.deployed();

    const testURL = "http://123.456.789";

    const [ owner ] = await ethers.getSigners();

    const ori_nums = await findmusicnft.getTotalTokenIDsByOwner( owner.address );
    const ori_max_nums = await findmusicnft.getTotalTokenIDs();

    await findmusicnft.createMusicNFT( testURL );
    const tokenID = await findmusicnft.getTokenIDByOwnerIndex( owner.address, 0 );
    expect( await findmusicnft.getURLByTokenID( tokenID ) ).to.equal( testURL );
    expect( await findmusicnft.getTotalTokenIDsByOwner( owner.address ) ).to.equal( ori_nums + 1 );
    expect( await findmusicnft.getTotalTokenIDs() ).to.equal( ori_max_nums + 1 );

  });
});
