import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import logo from "../img/tamago.png";
import styles from "../css/nav.module.css";

const MainNavbar = () => {
  return (
    <Navbar className={styles.navbar} data-bs-theme="white">
      <Container className={styles.nav_container}>
        <Navbar.Brand className={styles.logo} href="/">
          <img src={logo} alt="" />
        </Navbar.Brand>
        <Nav className={styles.nav_content}>
          <NavDropdown title="학습" id="basic-nav-dropdown">
            <NavDropdown.Item
              className={styles.dropdown_item}
              href="#action/3.1"
            >
              발음평가
            </NavDropdown.Item>
            <NavDropdown.Item
              className={styles.dropdown_item}
              href="#action/3.2"
            >
              문제풀기
            </NavDropdown.Item>
          </NavDropdown>

          <NavDropdown title="단어" id="basic-nav-dropdown">
            <NavDropdown.Item
              className={styles.dropdown_item}
              href="#action/3.1"
            >
              단어장 만들기
            </NavDropdown.Item>
            <NavDropdown.Item
              className={styles.dropdown_item}
              href="#action/3.2"
            >
              내가 만든 단어장
            </NavDropdown.Item>
            <NavDropdown.Item
              className={styles.dropdown_item}
              href="#action/3.2"
            >
              오답노트
            </NavDropdown.Item>
            <NavDropdown.Item
              className={styles.dropdown_item}
              href="#action/3.2"
            >
              단어창고
            </NavDropdown.Item>
          </NavDropdown>

          <NavDropdown title="게임" id="basic-nav-dropdown">
            <NavDropdown.Item className={styles.dropdown_item} href="/game">
              Word of World
            </NavDropdown.Item>
            <NavDropdown.Item
              className={styles.dropdown_item}
              href="#action/3.2"
            >
              단어 뒤집기
            </NavDropdown.Item>
            
            <NavDropdown.Item
              className={styles.dropdown_item}
              href="/Typing"
            >
              일어 타자 연습
            </NavDropdown.Item>
          </NavDropdown>

          <Nav.Link href="/SignIn">Sign In</Nav.Link>
          <Nav.Link href="/SignUp">Sign Up</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default MainNavbar;
