import { useState } from "react";
import { ethers } from "ethers";
import { Row, Form, Button } from "react-bootstrap";
import { create as ipfsHttpClient } from "ipfs-http-client";
import SideBar from "./SideBar";
const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

const Create = ({ marketplace, nft }) => {
  const [image, setImage] = useState("");
  const [book, setBook] = useState("");
  const [price, setPrice] = useState(null);
  const [name, setName] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [description, setDescription] = useState("");
  const uploadToIPFS1 = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (typeof file !== "undefined") {
      try {
        const result = await client.add(file);
        console.log(result);
        setImage(`https://ipfs.infura.io/ipfs/${result.path}`);
      } catch (error) {
        console.log("ipfs image upload error: ", error);
      }
    }
  };
  const uploadToIPFS2 = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (typeof file !== "undefined") {
      try {
        const result = await client.add(file);
        console.log(result);
        setBook(`https://ipfs.infura.io/ipfs/${result.path}`);
      } catch (error) {
        console.log("ipfs book upload error: ", error);
      }
    }
  };
  const createNFT = async () => {
    console.log("I was called");
    console.log(price,authorName,name,description);

    if (!image || !book || !price || !authorName || !name || !description)
      return;
    try {
      const result = await client.add(
        JSON.stringify({ image, book, price,authorName, name, description })
      );
      mintThenList(result);
    } catch (error) {
      console.log("ipfs uri upload error: ", error);
    }
  };
  const mintThenList = async (result) => {
    const uri = `https://ipfs.infura.io/ipfs/${result.path}`;
    // mint nft
    await (await nft.mint(uri)).wait();
    // get tokenId of new nft
    const id = await nft.tokenCount();
    // approve marketplace to spend nft
    await (await nft.setApprovalForAll(marketplace.address, true)).wait();
    // add nft to marketplace
    const listingPrice = ethers.utils.parseEther(price.toString());
    await (await marketplace.makeItem(nft.address, id, listingPrice)).wait();
  };
  return (
    <div class="app-content">
      <SideBar />

      <div class="projects-section">
        <div class="projects-section-header">
          <p>Create a new Book NFT</p>
        </div>

        <div className="container mt-5">
          <div className="row">
            <main
              role="main"
              className="col-lg-12 mx-auto"
              style={{ maxWidth: "1000px" }}
            >
              <div className="content mx-auto">
                <Row className="g-4">
                  <Form.Control
                    onChange={(e) => setName(e.target.value)}
                    size="lg"
                    required
                    type="text"
                    placeholder="Book Title"
                  />

                  <Form.Control
                    onChange={(e) => setAuthorName(e.target.value)}
                    size="lg"
                    required
                    type="text"
                    placeholder="Author (You should place your own name. You can also choose a pseudo name)"
                  />

                  <h5> Upload Book Cover</h5>

                  <Form.Control
                    type="file"
                    required
                    name="file"
                    onChange={uploadToIPFS1}
                  />

                  <h5> Upload your book in .pdf format</h5>

                  <Form.Control
                    type="file"
                    required
                    name="file2"
                    onChange={uploadToIPFS2}
                  />

                  <Form.Control
                    onChange={(e) => setDescription(e.target.value)}
                    size="lg"
                    required
                    as="textarea"
                    placeholder="Description"
                  />
                  <Form.Control
                    onChange={(e) => setPrice(e.target.value)}
                    size="lg"
                    required
                    type="number"
                    placeholder="Price in ETH"
                  />
                  <div className="d-grid px-0">
                    <Button onClick={createNFT} variant="dark" size="lg">
                      Create & List NFT!
                    </Button>
                  </div>
                </Row>

                <br />
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
