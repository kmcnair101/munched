import Link from "next/link";
import "./NavBar.scss";
import {
  RiHome2Line,
  RiCalendar2Line,
  RiMedal2Line,
  RiUserLine,
} from "react-icons/ri";

const NavBar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar__list">
        <li className="navbar__item">
          <Link href="/">
            <RiHome2Line className="navbar__icon" />
            <p className="navbar__text">Search</p>
          </Link>
        </li>
        <li className="navbar__item">
          <Link href="/Reservations">
            <RiCalendar2Line className="navbar__icon" />
            <p className="navbar__text">Bookings</p>
          </Link>
        </li>
        <li className="navbar__item">
          <Link href="/rewards">
            <RiMedal2Line className="navbar__icon" />
            <p className="navbar__text">Rewards</p>
          </Link>
        </li>
        <li className="navbar__item">
          <Link href="/user">
            <RiUserLine className="navbar__icon" />
            <p className="navbar__text">Users</p>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
