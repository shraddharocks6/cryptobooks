import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import SideBar from "./SideBar";

function renderSoldItems(items) {
  return (
    <>
      {/* <h2>Sold</h2>
      <Row xs={1} md={2} lg={4} className="g-4 py-3">
        {items.map((item, idx) => (
          <Col key={idx} className="overflow-hidden">
            <Card>
              <Card.Img variant="top" src={item.image} />
              <Card.Footer>
                For {ethers.utils.formatEther(item.totalPrice)} ETH - Recieved{" "}
                {ethers.utils.formatEther(item.price)} ETH
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row> */}

      <div class="app-content sold-items">
        <div class="projects-section">
          <div class="projects-section-header">
            <p>Sold Items :</p>
            <p class="time">-</p>
          </div>

          <div class="project-boxes jsGridView">
            {items.map((item, idx) => (
              <div key={idx} class="project-box-wrapper">
                <div class="project-box">
                  <div class="project-box-header">
                    <span>Cormac McCarthy</span>
                  </div>
                  <div class="project-box-content-header">
                    <p class="box-content-header">The Road</p>
                  </div>
                  <div class="box-progress-wrapper">
                    <img src={item.image} className="bookimg" />
                  </div>
                  <div class="project-box-footer">
                    <Button variant="outline-dark">
                      {ethers.utils.formatEther(item.totalPrice)} ETH
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default function MyListedItems({ marketplace, nft, account }) {
  const [loading, setLoading] = useState(true);
  const [listedItems, setListedItems] = useState([]);
  const [soldItems, setSoldItems] = useState([]);
  const loadListedItems = async () => {
    // Load all sold items that the user listed
    const itemCount = await marketplace.itemCount();
    let listedItems = [];
    let soldItems = [];
    for (let indx = 1; indx <= itemCount; indx++) {
      const i = await marketplace.items(indx);
      if (i.seller.toLowerCase() === account) {
        // get uri url from nft contract
        const uri = await nft.tokenURI(i.tokenId);
        // use uri to fetch the nft metadata stored on ipfs
        const response = await fetch(uri);
        const metadata = await response.json();
        // get total price of item (item price + fee)
        const totalPrice = await marketplace.getTotalPrice(i.itemId);
        // define listed item object
        let item = {
          totalPrice,
          price: i.price,
          itemId: i.itemId,
          name: metadata.name,
          authorName: metadata.authorName,
          description: metadata.description,
          image: metadata.image,
        };
        listedItems.push(item);
        // Add listed item to sold items array if sold
        if (i.sold) soldItems.push(item);
      }
    }
    setLoading(false);
    setListedItems(listedItems);
    setSoldItems(soldItems);
  };
  useEffect(() => {
    loadListedItems();
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
          {listedItems.length > 0 ? (
            <>
              <div class="projects-section-header">
                <p>Listed Items :</p>
                <p class="time">-</p>
              </div>

              <div class="project-boxes jsGridView">
                {listedItems.map((item, idx) => (
                  <div class="project-box-wrapper">
                    <div class="project-box">
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
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div class="projects-section-header">
                <p>No Listed Items</p>
                <p class="time">-</p>
              </div>
              {/* <main style={{ padding: "1rem 0" }}>
                <h2>No listed assets</h2>
              </main> */}
            </>
          )}
        </div>
      </div>

      {soldItems.length > 0 && renderSoldItems(soldItems)}
    </div>
  );
}
