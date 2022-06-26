import { Link } from "react-router-dom";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import market from "./market.png";
import "./dashboard.css";

const Navigation = ({ web3Handler, account }) => {
  return (
    <div>
      <div className="app-header">
        <div className="app-header-left">
          <span className="app-icon"></span>
          <p className="app-name">CryptoBooks</p>
          <div className="search-wrapper">
            <input className="search-input" type="text" placeholder="Search" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              className="feather feather-search"
              viewBox="0 0 24 24"
            >
              <defs></defs>
              <circle cx="11" cy="11" r="8"></circle>
              <path d="M21 21l-4.35-4.35"></path>
            </svg>
          </div>
        </div>
        <div className="app-header-right">
          <button className="mode-switch" title="Switch Theme">
            <svg
              className="moon"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <defs></defs>
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
            </svg>
          </button>

          <Nav>
            {account ? (
              <Nav.Link
                href={`https://etherscan.io/address/${account}`}
                target="_blank"
                rel="noopener noreferrer"
                className="button nav-button btn-sm mx-4"
              >
                <Button variant="dark">
                  {account.slice(0, 5) + "..." + account.slice(38, 42)}
                </Button>
              </Nav.Link>
            ) : (
              <Button variant="dark" onClick={web3Handler}>
                Connect Wallet
              </Button>
            )}
          </Nav>
        </div>
        <button className="messages-btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="feather feather-message-circle"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        </button>
      </div>

      {/* <Navbar expand="lg" bg="secondary" variant="dark">
        <Container>
          <Navbar.Brand href="http://www.dappuniversity.com/bootcamp">
            <img src={market} width="40" height="40" className="" alt="" />
            &nbsp; CryptoBooks
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/create">
                Create
              </Nav.Link>
              <Nav.Link as={Link} to="/my-listed-items">
                My Listed Items
              </Nav.Link>
              <Nav.Link as={Link} to="/my-purchases">
                My Purchases
              </Nav.Link>
            </Nav>
            <Nav>
              {account ? (
                <Nav.Link
                  href={`https://etherscan.io/address/${account}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button nav-button btn-sm mx-4"
                >
                  <Button variant="outline-light">
                    {account.slice(0, 5) + "..." + account.slice(38, 42)}
                  </Button>
                </Nav.Link>
              ) : (
                <Button onClick={web3Handler} variant="outline-light">
                  Connect Wallet
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar> */}
    </div>
  );
};

export default Navigation;
