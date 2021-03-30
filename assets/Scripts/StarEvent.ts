
import { _decorator, Component, Collider2D, Contact2DType, IPhysics2DContact } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('StarEvent')
export class StarEVent extends Component {

    private collider: Collider2D | null = null;

    start() {

        this.collider = this.node.getComponent(Collider2D);
        this.collider?.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {

        this.collider!.enabled = false;
        GameManager.getInstance().playerWin();
    }
}
