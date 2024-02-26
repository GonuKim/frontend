import { useEffect, useRef } from "react";
import createGame from "./config";

const Game = () => {
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const gameInstance = createGame();

    return () => {
      // 게임 인스턴스 정리
      gameInstance.destroy(true);
    };
  }, []);

  return <div ref={gameRef} id="game-container"></div>;
};

export default Game;
