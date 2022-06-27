import { useState, useEffect } from "react";
import { ethers } from "ethers";

import { Button } from "react-bootstrap";
import ReadBookModal from "./Modals/ReadBookModal"
import "./dashboard.css";
import SideBar from "./SideBar";

export default function MyPurchases({ marketplace, nft, account }) {
  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState([]);
  const [open, setOpen] = useState(false);
  const [bookToShow, setBookToShow] = useState("");

  const loadPurchasedItems = async () => {
    // Fetch purchased items from marketplace by quering Offered events with the buyer set as the user
    const filter = marketplace.filters.Bought(
      null,
      null,
      null,
      null,
      null,
      account
    );
    const results = await marketplace.queryFilter(filter);
    //Fetch metadata of each nft and add that to listedItem object.
    const purchases = await Promise.all(
      results.map(async (i) => {
        // fetch arguments from each result
        i = i.args;
        // get uri url from nft contract
        const uri = await nft.tokenURI(i.tokenId);
        // use uri to fetch the nft metadata stored on ipfs
        const response = await fetch(uri);
        const metadata = await response.json();
        // get total price of item (item price + fee)
        const totalPrice = await marketplace.getTotalPrice(i.itemId);
        // define listed item object
        let purchasedItem = {
          totalPrice,
          price: i.price,
          itemId: i.itemId,
          name: metadata.name,
          book: metadata.book,
          authorName:metadata.authorName,
          description: metadata.description,
          image: metadata.image,
        };
        return purchasedItem;
      })
    );
    setLoading(false);
    setPurchases(purchases);
  };

  const handleShowBook = (book) => {
    setBookToShow(book);
    setOpen(true);
  };

  useEffect(() => {
    loadPurchasedItems();
  }, []);
  if (loading)
    return (
      <main style={{ padding: "1rem 0" }}>
        <h2>Loading...</h2>
      </main>
    );
  return (
    <>
      <div class="app-content">
        <SideBar />

        <div class="projects-section">
          <div class="projects-section-header">
            <p>Bought Books</p>
            <p class="time">-</p>
          </div>

          {purchases.length > 0 ? (
            <div class="project-boxes jsGridView">
              {purchases.map((item, idx) => (
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
                        onClick={() => handleShowBook(item)}
                      >
                        Read
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <main style={{ padding: "1rem 0" }}>
              <h2>
                No books bought. Head over to cryptobooks home and browse the
                availiable books.
              </h2>
            </main>
          )}
        </div>
        
        {open ? (
          <ReadBookModal open={open} setOpen={setOpen} book={bookToShow} />
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
