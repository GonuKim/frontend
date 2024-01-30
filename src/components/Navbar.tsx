import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import logo from "../img/tamago.png";
import styles from "../css/nav.module.css";

const MainNavbar = () => {
  return (
    <Navbar className={styles.navbar} data-bs-theme="white">
      <Container className={styles.nav_container}>
        <Navbar.Brand className={styles.logo} href="#home">
          <img src={logo} alt="" />
        </Navbar.Brand>
        <Nav className={`${styles.nav_content} m-2`}>
          <Nav.Link href="#game">Game</Nav.Link>
          <Nav.Link href="#Commmunity">Commmunity</Nav.Link>
          <Nav.Link href="#Exam">Exam</Nav.Link>
          <Nav.Link href="#Sing In">Sign In</Nav.Link>
          <Nav.Link href="#Sing Up">Sign Up</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default MainNavbar;
