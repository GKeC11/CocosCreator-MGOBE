
import { _decorator, Component, Node, Prefab, instantiate, Vec3, randomRange, Canvas, director, RigidBody2D } from 'cc';
import { CameraManager } from './CameraManager';
import Global from './Global';
import { GlobalManager } from './GlobalManager';
import { MonsterState } from './MonsterState';
import { PlayerController } from './PlayerController';
const { ccclass, property } = _decorator;

enum GameState {
    Start = 0,
    Gaming = 1,
    End = 2
}

class Block {

    height: number = 0;
    place_x: number = 0;

    constructor(h: number, x: number) {

        this.height = h;
        this.place_x = x;
    }
}

@ccclass('GameManager')
export class GameManager extends Component {

    private static instance: GameManager;
    public static getInstance(): GameManager {

        if (this.instance == null) {

            this.instance = new GameManager();
        }

        return this.instance;
    }

    count: number = 50;

    @property({ type: Prefab })
    blockPrefab: Prefab | null = null;

    @property({ type: Prefab })
    starPrefab: Prefab | null = null;

    @property({ type: Node })
    parentNode: Node | null = null;

    @property({ type: Canvas })
    gameCanvas: Canvas | null = null;

    @property({ type: Node })
    gameCameraNode: Node | null = null;

    private blockArr: Block[] = new Array();
    private generateHeight = 0;
    public gameState = 0;

    onLoad() {

        GameManager.instance = this;
    }

    start() {

        this.generateBlock();
        this.setMonsetr();

        Global.room!.onRecvFrame = event => {
            this.updateMonsterPos(event.data.frame);
        }
    }

    update() {

        GlobalManager.getInstance().anoterSelect!.getComponent(RigidBody2D)!.enabled = false;
    }

    generateBlock() {

        this.gameState = GameState.Gaming;

        for (var i = 0; i < this.count; i++) {
            var block = new Block(this.getRandomHeight(), this.getRandomPlaceX());
            this.blockArr.push(block);
        }

        this.blockArr.forEach((element, index, arr) => {
            var block = instantiate(this.blockPrefab!) as Node;
            block.setPosition(new Vec3(element.place_x, element.height, 0));
            this.parentNode?.addChild(block);

            if (index == (this.count - 1)) {
                element.height += 75;
                var star = this.generateStar(element);
                this.parentNode?.addChild(star);
            }
        });
    }

    generateStar(block: Block) {

        var star = instantiate(this.starPrefab!) as Node;
        star.setPosition(block.place_x, block.height);

        return star;
    }

    getRandomHeight() {

        this.generateHeight += randomRange(100, 200);
        return this.generateHeight;
    }

    getRandomPlaceX() {

        return randomRange(-500, 500);
    }

    gameOver() {

        this.gameState = GameState.End;
        this.gameCanvas?.node.emit("GameOver");
    }

    playerWin() {

        this.gameState = GameState.End;
        this.gameCanvas?.node.emit("Win");
    }

    static getGameState() {

        return GameState;
    }

    restart() {

        director.loadScene("Game");
        this.gameState = GameState.Start;
    }

    setMonsetr() {

        var playerNode = this.gameCanvas?.node.getChildByName("Player");

        if (GlobalManager.getInstance().selectMonster) {
            var monster = GlobalManager.getInstance().selectMonster;
            monster!.getComponent(RigidBody2D)!.gravityScale = 9.8;
            playerNode?.addChild(monster!);
            playerNode!.getComponent(PlayerController)!.actor = monster;
            playerNode!.getComponent(PlayerController)!.monsterState = monster!.getComponent(MonsterState);
            this.gameCameraNode!.getComponent(CameraManager)!.actorFollow = monster;
        }

        if(Global.room!.roomInfo.playerList.length > 1){

            console.log(GlobalManager.getInstance().selectMonster);
            console.log(GlobalManager.getInstance().anoterSelect);
            var ohterMonster = GlobalManager.getInstance().anoterSelect;
            this.gameCanvas?.node.addChild(ohterMonster!);
        }
    }

    updateMonsterPos(frame: MGOBE.types.Frame){

        var itemList = frame.items;
        itemList.forEach((element, index) => {
            var data = element.data as PosFrame;
            var pos: Vec3 = data.playerPos;
            console.log(element.playerId, MGOBE.Player.id, pos);
            if(element.playerId != MGOBE.Player.id){
                GlobalManager.getInstance().anoterSelect?.setPosition(pos);
            }
        })
    }
}

interface PosFrame {

    playerPos: Vec3;
}