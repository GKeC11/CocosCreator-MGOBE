
import { _decorator, Component, CCInteger, Collider2D, Contact2DType, Vec2, RigidBody2D, IPhysics2DContact, PhysicsSystem2D, ERaycast2DType, rect, math, Graphics, PolygonCollider2D, UITransform, Sprite } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('MonsterState')
export class MonsterState extends Component {

    public jumpDur = 1.0;
    public jumpTime = 1.0;
    public collider: Collider2D | null = null;
    public ridigBody: RigidBody2D | null = null;
    private deathHeight = -100;

    @property({ type: CCInteger })
    JumpPower: number = 0;

    @property({ type: Graphics })
    DebugGraphics: Graphics | null = null;

    onLoad() {

    }

    start() {

        this.JumpPower = 300;
        this.collider = this.node.getComponent(Collider2D);
        this.collider?.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        this.ridigBody = this.node.getComponent(RigidBody2D);
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {

        var rect = new math.Rect();
        rect = otherCollider.worldAABB.clone();
        rect.yMin += 10;
        var results = PhysicsSystem2D.instance.testAABB(rect);

        this.DebugGraphics?.rect(rect.xMin, rect.yMin, rect.width, rect.height);
        this.DebugGraphics?.stroke();

        if (results.length > 1) {
            console.log(results);
            this.jumpTime += 1;
        }
    }

    Jump() {

        if (this.jumpTime >= this.jumpDur) {
            this.ridigBody?.applyLinearImpulseToCenter(new Vec2(0, this.JumpPower), true);
            this.jumpTime = 0.0;
        }
    }


    update(delta: number) {

        if (this.jumpTime <= this.jumpDur) {
            this.jumpTime += delta;
        }

        if (GameManager.getInstance().gameState == GameManager.getGameState().Gaming) {
            if (this.deathHeight > this.node.getWorldPosition().y) {

                console.log(this.node.getWorldPosition().y);
                GameManager.getInstance().gameOver();
            }
        }

        var test = this.node.getComponent(UITransform)?.getBoundingBoxToWorld();
        this.DebugGraphics?.rect(test!.xMin, test!.yMin, test!.width, test!.height);
        this.DebugGraphics?.stroke();
    }
}
