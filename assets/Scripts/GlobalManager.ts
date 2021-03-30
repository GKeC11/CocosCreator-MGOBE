
import { _decorator, Component, Node, game, Vec3, Layers, instantiate } from 'cc';
import Global from './Global';
const { ccclass, property } = _decorator;

@ccclass('GlobalManager')
export class GlobalManager extends Component {

    private static instance: GlobalManager;

    public static getInstance(): GlobalManager {

        if (!this.instance) {
            this.instance = new GlobalManager();
        }

        return this.instance;
    }

    public playerIndex: number = -1;
    public selectMonster: Node | null = null;
    public anoterSelect: Node | null = null;

    onLoad() {

        GlobalManager.instance = this;
    }

    start() {

        game.addPersistRootNode(this.node);
    }

    processSelectClientMsg(msg: string, monsterList: Node[]) {

        var list = msg.split(":");
        var index: number = Number.parseInt(list[1]);

        if (MGOBE.Player.id != list[0]) {
            this.anoterSelect = instantiate(monsterList[index]);
            this.anoterSelect!.layer = Layers.Enum.DEFAULT;
            this.anoterSelect?.setPosition(new Vec3(100, 0, 0));
        }

        console.log(this.anoterSelect);
    }

    getPlayerIndex(id: string): number {

        Global.room?.roomInfo.playerList.forEach((element, index) => {
            if (element.id == id) {
                return index;
            }
        })
        return -1;
    }
}

