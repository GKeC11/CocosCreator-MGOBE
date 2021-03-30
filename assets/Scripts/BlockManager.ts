
import { _decorator, Component, Collider2D, Contact2DType, IPhysics2DContact, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BlockManager')
export class BlockManager extends Component {

    collider: Collider2D | null = null;

    start() {

        this.collider = this.node.getComponent(Collider2D);
        this.collider?.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {

        this.schedule(this.blockDestory, 1);
    }

    blockDestory() {

        var a = this.node.getComponent(Sprite)!.color.a;
        a -= 100;
        if (a < 0) {
            a = 0;
            this.node.destroy();
        }
        this.node.getComponent(Sprite)!.color._set_a_unsafe(a);
    }
}
