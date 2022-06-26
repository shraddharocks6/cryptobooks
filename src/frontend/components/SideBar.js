import { Link } from "react-router-dom";

const SideBar = () => {
  return (
    <div class="app-sidebar">
      <Link as={Link} to="/">
        <img src="./assets/home.png" className="small-icons"></img>
      </Link>
      <Link as={Link} to="/create">
        <img src="./assets/plus.png" className="small-icons"></img>
      </Link>
      <Link as={Link} to="/my-listed-items">
        <img src="./assets/list.png" className="small-icons"></img>
      </Link>
      <Link as={Link} to="/my-purchases">
        <img src="./assets/yourStuff.png" className="small-icons"></img>
      </Link>
    </div>
  );
};

export default SideBar;
