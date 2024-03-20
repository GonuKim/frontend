import { HashLoader } from "react-spinners";
import styles from "../css/LoadingBar.module.css";
const LoadingBar = () => {
  return (
    <div className={styles.loadingContainer}>
      <HashLoader color="#ff5e5e" size={60} />
    </div>
  );
};

export default LoadingBar;
