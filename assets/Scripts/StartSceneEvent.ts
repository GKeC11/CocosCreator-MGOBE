
import { _decorator, Component, Node, Scene, director, ScrollView, Prefab, instantiate, UITransform, math, Vec3, Layers, Button } from 'cc';
import Config, { GAMING, START } from './Config';
import { DebugHelper } from './DebugHelper';
import FrameSyncHelper from './FrameSyncHelper';
import Global from './Global';
import { GlobalManager } from './GlobalManager';
import { HoverSprite } from './HoverSprite';
import { OnlineUI } from './OnlineUI';
const { ccclass, property } = _decorator;

@ccclass('StartSceneEvent')
export class StartSceneEvent extends Component {

    @property({ type: Scene })
    GameScene: Scene | null = null;

    @property({ type: ScrollView })
    MonsterList: ScrollView | null = null;

    @property({ type: Prefab })
    MonsterTypeList: Prefab[] | null = new Array();

    @property({ type: Prefab })
    onlineUIPrefab: Prefab | null = null;

    @property({ type: DebugHelper })
    debug: DebugHelper | null = null;

    @property({ type: Button })
    onlineButton: Button | null = null;

    onlineUI: Node | null = null;

    monsterInstanceList: Node[] | null = new Array();
    isStart = false;

    start() {

        this.initialMonsterList();
        this.node.on("Hover", this.monsterHover, this);
        this.node.on("Unhover", this.monsterUnhover, this);
        this.node.on("Select", this.setMonsterSelect, this);
        this.onlineButton?.node.on(Node.EventType.TOUCH_START, this.initSDK);

        Global.room = new MGOBE.Room();
        Global.room!.onUpdate = event => {
            if (Global.room?.roomInfo.customProperties == "") {
                this.createOnlineUI();
            }

        }
        Global.room!.onJoinRoom = event => console.log("新玩家加入：" + event.data.joinPlayerId);
        // 接受客户端消息广播
        Global.room.onRecvFromClient = event => {
            console.log(event.data.msg);
            GlobalManager.getInstance().processSelectClientMsg(event.data.msg, this.monsterInstanceList!);
        }
    }

    initialMonsterList() {

        var listStart = 100;
        var contentWidth = 0;
        this.MonsterTypeList?.forEach((element, index) => {

            var monster = instantiate(element);
            monster.setPosition(listStart + index * 100, 0, 0);
            contentWidth = listStart + index * 100;
            monster.getComponent(HoverSprite)!.container = this.node;
            monster.layer = Layers.Enum.UI_2D;
            this.MonsterList?.content?.addChild(monster);
            this.monsterInstanceList?.push(monster);
        });

        this.MonsterList!.content!.getComponent(UITransform)!.width = contentWidth + 120;
    }

    startGame() {

        if (Global.isInit > 0) {
            console.log("更改房间类型");
            const changeRoomPara: MGOBE.types.ChangeRoomPara = {

                customProperties: GAMING,
            }
            Global.room?.changeRoom(changeRoomPara);

            this.isStart = true;
            //开始帧同步
            Global.room?.startFrameSync({}, event => {

                console.log("帧同步开始");
            })
        }

        director.loadScene(this.GameScene!.name);
    }

    monsterHover(rect: math.Rect) {

        this.debug?.drawDebugRect(rect);
    }

    monsterUnhover() {

        this.debug?.clear();
    }

    // 选择角色
    setMonsterSelect(monster: Node) {

        var selectIndex: number = 0;
        this.monsterInstanceList?.forEach((element, index) => {
            element.getComponent(HoverSprite)?.disableSelect();
            if (element == monster) {
                selectIndex = index;
            }
        });

        if (Global.isInit > 0) {
            //发送客户端消息
            FrameSyncHelper.sendClientMsg(selectIndex);
        }

        GlobalManager.getInstance().selectMonster = instantiate(monster);
        GlobalManager.getInstance().selectMonster!.layer = Layers.Enum.DEFAULT;
        GlobalManager.getInstance().selectMonster?.setPosition(new Vec3(0, 0, 0));
    }

    // 初始化并匹配
    initSDK() {

        if (Global.isInit == 0) {
            const gameInfoPara: MGOBE.types.GameInfoPara = {

                gameId: Config.gameId,
                openId: Config.openId,
                secretKey: Config.secretKey,
            }

            const configPara: MGOBE.types.ConfigPara = {

                url: Config.url,
                isAutoRequestFrame: true,
                cacertNativeUrl: "",
            }

            MGOBE.Listener.init(gameInfoPara, configPara, event => {

                if (event.code == MGOBE.ErrCode.EC_OK) {

                    MGOBE.Listener.add(Global.room!);
                    Global.isInit++;

                    //回调 onUpdate 
                    Global.room?.changeRoom({});

                    const playerInfo: MGOBE.types.PlayerInfoPara = {

                        name: Config.openId,
                        customPlayerStatus: 1,
                        customProfile: "",
                    }

                    const roomPara: MGOBE.types.MatchRoomPara = {

                        playerInfo,
                        maxPlayers: 2,
                        roomType: START,
                    };

                    Global.room?.matchRoom(roomPara, event => {
                        if (event.code == MGOBE.ErrCode.EC_OK) {
                            console.log("匹配成功 ID:" + event.data?.roomInfo.id);
                            console.log("当前房间玩家列表：" + event.data?.roomInfo.playerList);
                            GlobalManager.getInstance().playerIndex = GlobalManager.getInstance().getPlayerIndex(MGOBE.Player.id);
                        }
                    })
                }
            });
        }
    }

    createOnlineUI() {

        console.log(Global.room?.roomInfo);
        if (Global.room?.roomInfo.id && !this.isStart) {
            if (!this.onlineUI) {
                this.onlineUI = instantiate(this.onlineUIPrefab) as unknown as Node;
                this.onlineUI.getComponent(OnlineUI);
                var x = this.onlineButton?.node.position.x;
                var y = this.onlineUI.getComponent(UITransform)!.width + 75;
                this.onlineUI.setPosition(new Vec3(x, y, 0));
                this.node.addChild(this.onlineUI);
            }
            this.onlineUI.getComponent(OnlineUI)?.appendCotent(Global.room!.roomInfo.playerList);
        }
    }
}