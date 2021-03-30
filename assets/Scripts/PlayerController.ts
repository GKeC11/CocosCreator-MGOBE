
import { _decorator, Component, Vec3, systemEvent, macro, SystemEventType, EventKeyboard, Node } from 'cc';
import FrameSyncHelper from './FrameSyncHelper';
import { MonsterState } from './MonsterState';
const { ccclass, property } = _decorator;

class KeyMapNode {
    keyCode: number = 0;
    isPress: boolean = false;

    constructor(keyCode: number, isPress: boolean) {
        this.keyCode = keyCode;
        this.isPress = isPress;
    }
}

@ccclass('PlayerController')
export class PlayerController extends Component {

    private curPos: Vec3 = new Vec3();
    private moveSpeed: number = 500;
    private deltaPos: Vec3 = new Vec3();
    private direction: Vec3 = new Vec3();
    private keyArr: KeyMapNode[] = new Array();

    @property({ type: Node })
    actor: Node | null = null;

    @property({ type: MonsterState })
    monsterState: MonsterState | null = null;

    onLoad() {

        systemEvent.on(SystemEventType.KEY_DOWN, this.onKeyDown, this);
        systemEvent.on(SystemEventType.KEY_UP, this.onKeyRelease, this);
    }

    start() {

    }

    onDestroy() {

    }

    onKeyDown(event: EventKeyboard) {

        console.log("按下" + event.keyCode);
        this.ProcessInput(event);
    }

    onKeyRelease(event: EventKeyboard) {

        console.log("松开" + event.keyCode);
        this.ReleaseInput(event);
    }

    ProcessInput(event: EventKeyboard) {

        var hasPress = this.keyArr.some(function (e, i, a) {
            return e.keyCode == event.keyCode;
        });

        if (!hasPress) {
            this.keyArr.push(new KeyMapNode(event.keyCode, true));
        }
    }

    ReleaseInput(event: EventKeyboard) {

        this.keyArr.forEach((element, index) => {
            if (element.keyCode == event.keyCode) {
                this.keyArr.splice(index, 1);
                return;
            }
        });

        switch (event.keyCode) {
            case macro.KEY.d:
            case macro.KEY.a:
            case macro.KEY.w:
            case macro.KEY.s:
                this.ResetDirection();
                break;
        }
    }

    DoInput() {

        this.keyArr.forEach(element => {
            if (element.isPress == true) {
                this.SetDirection(element.keyCode);
                this.DoJumpOrDown(element.keyCode);
            }
        });
    }

    ResetDirection() {

        this.direction.set(0, 0, 0);
    }

    SetDirection(key: number) {

        switch (key) {
            case macro.KEY.d:
                this.direction.x = 1;
                break;

            case macro.KEY.a:
                this.direction.x = -1;
                break;
        }
    }

    DoJumpOrDown(key: number) {

        switch (key) {
            case macro.KEY.space:
                this.monsterState?.Jump();
                break;
        }
    }

    update(deltaTime: number) {

        this.DoInput();

        this.curPos = this.actor!.getPosition();
        this.deltaPos = this.direction.multiplyScalar(this.moveSpeed * deltaTime);
        this.curPos.add(this.deltaPos);

        this.actor?.setPosition(this.curPos);

        if (FrameSyncHelper.isOnline()) {
            FrameSyncHelper.sendFrameCmd(this.actor?.getPosition());
        }

    }
}