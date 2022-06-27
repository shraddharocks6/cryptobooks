import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Button } from "react-bootstrap";
import "./dashboard.css";
import SideBar from "./SideBar";

const Home = ({ marketplace, nft }) => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const loadMarketplaceItems = async () => {
    // Load all unsold items
    const itemCount = await marketplace.itemCount();
    let items = [];
    for (let i = 1; i <= itemCount; i++) {
      const item = await marketplace.items(i);
      if (!item.sold) {
        // get uri url from nft contract
        const uri = await nft.tokenURI(item.tokenId);
        // use uri to fetch the nft metadata stored on ipfs
        const response = await fetch(uri);
        const metadata = await response.json();
        // get total price of item (item price + fee)
        const totalPrice = await marketplace.getTotalPrice(item.itemId);
        // Add item to items array
        items.push({
          totalPrice,
          itemId: item.itemId,
          seller: item.seller,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
          authorName:metadata.authorName,
        });
      }
    }
    setLoading(false);
    setItems(items);
  };

  const buyMarketItem = async (item) => {
    await (
      await marketplace.purchaseItem(item.itemId, { value: item.totalPrice })
    ).wait();
    loadMarketplaceItems();
  };

  useEffect(() => {
    const script = document.createElement("script");

    script.src = "./dashboard.js";
    script.async = true;
    loadMarketplaceItems();
  }, []);
  if (loading)
    return (
      <main style={{ padding: "1rem 0" }}>
        <h2>Loading...</h2>
      </main>
    );

  return (
    <div>
      <div class="app-content">
        <SideBar />

        <div class="projects-section">
          <div class="projects-section-header">
            <p>Popular Books</p>
            <p class="time">-</p>
          </div>

          {items.length > 0 ? (
            <div class="project-boxes jsGridView">
              {items.map((item, idx) => (
                <div class="project-box-wrapper">
                  <div class="project-box">
                    {/* <div class="project-box-header">
                      <span>{item.authorName}</span>
                    </div> */}
                    <div class="project-box-content-header">
                      <p class="box-content-header">{item.authorName}</p>
                    </div>
                    <div class="box-progress-wrapper">
                      <img src={item.image} className="bookimg" />
                    </div>
                    <div class="project-box-footer">
                      <Button variant="outline-dark">
                        {ethers.utils.formatEther(item.totalPrice)} ETH
                      </Button>

                      <Button
                        variant="dark"
                        onClick={() => buyMarketItem(item)}
                      >
                        Buy Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <main style={{ padding: "1rem 0" }}>
              <h2>No listed assets</h2>
            </main>
          )}
        </div>
      </div>

      {/* <script src="./dashboard.js"></script> */}
    </div>
  );
};
export default Home;
