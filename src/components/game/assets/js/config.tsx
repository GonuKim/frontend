import Phaser from "phaser";
import GameScene from "./WelecomeScene";
import StageScene from "./StageScene";
import FoggyStageScene from "./FoggyStageScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "game_container",

  scale: {
    //   mode: Phaser.Scale.AUTO, // 스케일 모드 설정
    width: 1024,
    height: 600,
    // autoCenter: Phaser.Scale.CENTER_BOTH, // 화면 가운데 정렬
  },

  backgroundColor: 0xffffff,
  physics: {
    // 물리 시스템 활성화
    default: "arcade",
    arcade: {
      gravity: { y: 300 }, // Y축 중력 설정, 필요에 따라 조정 가능
      debug: false, // 디버깅 정보 표시 여부
    },
  },
  scene: [GameScene, StageScene, FoggyStageScene],
};

const createGame = () => {
  return new Phaser.Game(config);
};

export default createGame;
