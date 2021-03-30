
import { _decorator, Component, Button, Animation, AnimationClip, Sprite, director, SpriteFrame, UITransform } from 'cc';
import { GameManager } from './GameManager';
import Global from './Global';
const { ccclass, property } = _decorator;

@ccclass('GameUIEvent')
export class GameUIEvent extends Component {

    @property({ type: Button })
    restartButton: Button | null = null;

    @property({ type: AnimationClip })
    restartButtonAnimation: AnimationClip[] | null = new Array();

    @property({ type: Sprite })
    mask: Sprite | null = null;

    @property({ type: Sprite })
    endGameTip: Sprite | null = null;

    @property({ type: AnimationClip })
    maskAnim: AnimationClip | null = null;

    @property({ type: AnimationClip })
    GameEndAnimation: AnimationClip | null = null;

    @property({type: Sprite})
    winTip: Sprite|null = null;


    start() {

        this.node.on("GameOver", this.gameOver, this);
        this.node.on("Win", this.playerWin, this)
    }

    restart() {

        var anim = this.restartButton!.getComponent(Animation);
        anim?.play(this.restartButtonAnimation![0].name);
        GameManager.getInstance().restart();
    }

    gameOver() {

        this.mask?.getComponent(Animation)?.play(this.maskAnim!.name);
        this.endGameTip?.getComponent(Animation)?.play(this.GameEndAnimation!.name);

        this.restartButton!.getComponent(UITransform)!.priority = 10;
        this.restartButton?.getComponent(Animation)?.play(this.restartButtonAnimation![1].name);
    }

    playerWin(){
        
        this.mask?.getComponent(Animation)?.play(this.maskAnim!.name);
        this.winTip?.getComponent(Animation)?.play(this.GameEndAnimation!.name);

        this.restartButton!.getComponent(UITransform)!.priority = 10;
        this.restartButton?.getComponent(Animation)?.play(this.restartButtonAnimation![1].name);
    }

    backToMenu(){

        director.loadScene("Start");
        Global.room?.stopFrameSync({}, event => {
            console.log("停止帧同步");
        })
    }
}

