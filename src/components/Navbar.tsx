import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import logo from "../img/tamago_logo.png";
import styles from "../css/nav.module.css";
import { useAuth } from "../contexts/AuthContext";
import instance from "../api/axios";
import { Link } from "react-router-dom";

const MainNavbar: React.FC = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  // const api = axios.create({
  //   baseURL: "http://localhost:8000/",
  //   withXSRFToken: true,
  //   withCredentials: true,
  // });

  const handleLogout = async () => {
    const confirmed = window.confirm("로그아웃 하시겠습니까?");
    const accessToken = sessionStorage.getItem("accessToken");

    if (confirmed) {
      if (accessToken) {
        const accessToken = sessionStorage.getItem("accessToken");

        try {
          await instance.post(
            "/api/logout",
            {},
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          sessionStorage.removeItem("accessToken");
          sessionStorage.removeItem("refreshToken");

          setIsLoggedIn(false);
        } catch (error) {
          console.error("Logout error", error);
          // 에러 처리 로직
        }
      }
    }
  };

  return (
    <Navbar className={styles.navbar} data-bs-theme="white">
      <Container className={styles.nav_container}>
        <Navbar.Brand className={styles.logo_container}>
          <Link to="/">
            <img className={styles.logo} src={logo} alt="" />
          </Link>
        </Navbar.Brand>
        <Nav className={styles.nav_content}>
          <NavDropdown title="학습" id="basic-nav-dropdown">
            <NavDropdown.Item
              className={styles.dropdown_item}
              as={Link}
              to="/Pronunciation"
            >
              발음평가
            </NavDropdown.Item>
            <NavDropdown.Item className={styles.dropdown_item}>
              문제풀기
            </NavDropdown.Item>

            <NavDropdown.Item
              className={styles.dropdown_item}
              as={Link}
              to="/Grammar"
            >
              문법
            </NavDropdown.Item>
          </NavDropdown>

          <NavDropdown title="단어" id="basic-nav-dropdown">
            <NavDropdown.Item
              className={styles.dropdown_item}
              as={Link}
              to="/CreateWord"
            >
              단어장 만들기
            </NavDropdown.Item>
            <NavDropdown.Item
              className={styles.dropdown_item}
              as={Link}
              to="/MySet"
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
              as={Link}
              to="/community"
            >
              단어창고
            </NavDropdown.Item>
          </NavDropdown>

          <NavDropdown title="게임" id="basic-nav-dropdown">
            <NavDropdown.Item
              className={styles.dropdown_item}
              as={Link}
              to="/game"
            >
              Word of World
            </NavDropdown.Item>
            <NavDropdown.Item
              className={styles.dropdown_item}
              as={Link}
              to="/FlipWord"
            >
              단어 뒤집기
            </NavDropdown.Item>
            <NavDropdown.Item
              className={styles.dropdown_item}
              as={Link}
              to="/Typing"
            >
              일어 타자 연습
            </NavDropdown.Item>
          </NavDropdown>

          {isLoggedIn ? (
            <Nav.Link className={styles.logout_link} onClick={handleLogout}>
              로그아웃
            </Nav.Link>
          ) : (
            <>
              <Nav.Link as={Link} to="/SignIn">
                로그인
              </Nav.Link>
              <Nav.Link as={Link} to="/SignUp">
                회원가입
              </Nav.Link>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default MainNavbar;
