
import { _decorator, Component, Node, math, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraController')
export class CameraManager extends Component {

    private curPos = new Vec3();
    private tarPos = new Vec3();
    private actorPos = new Vec3();

    @property({ type: Node })
    actorFollow: Node | null = null;

    update(delta: number) {

        this.curPos = this.node.getWorldPosition();
        this.actorPos = this.actorFollow!.getWorldPosition();

        Vec3.lerp(this.tarPos, this.curPos, this.actorPos, 0.5);
        this.node.setPosition(this.tarPos);
    }
}

