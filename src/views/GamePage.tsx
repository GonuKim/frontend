import Game from "../components/game/assets/js/main.tsx";
import styles from "../css/GamePage.module.css";
import Navbar from "../components/Navbar.tsx";
const GamePage = () => {
  return (
    <div>
      <Navbar />
      <div className={styles.title_wrap}>Word Of World</div>
      <div className={styles.game_wrap} id="game_container">
        <Game />
      </div>
    </div>
  );
};

export default GamePage;
