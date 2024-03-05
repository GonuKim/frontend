import Game from "../components/game/assets/js/main.tsx";
import styles from "../css/GamePage.module.css";
const GamePage = () => {
  return (
    <div>
      <div className={styles.title_wrap}>Word Of World</div>
      <div className={styles.game_wrap} id="game_container">
        <Game />
      </div>
    </div>
  );
};

export default GamePage;
