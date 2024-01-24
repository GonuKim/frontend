import MainNavbar from "../components/Navbar";
import styles from "../css/Main.module.css";
const Main = () => {
  return (
    <div>
      <div className={styles.nav_wrap}>
        <MainNavbar />
      </div>
    </div>
  );
};

export default Main;
