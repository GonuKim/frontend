import Phaser from "phaser";
import GameScene from "./WelecomeScene";
import StageScene from "./StageScene";
import FoggyStageScene from "./FoggyStageScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "game_container",

  scale: {
    // mode: Phaser.Scale.RESIZE, // 스케일 모드 설정
    width: "60%",
    height: "90%",
    // autoCenter: Phaser.Scale.CENTER_BOTH, // 화면 가운데 정렬
  },

  backgroundColor: 0xffffff,

  scene: [GameScene, StageScene, FoggyStageScene],
};

const createGame = () => {
  return new Phaser.Game(config);
};

export default createGame;
