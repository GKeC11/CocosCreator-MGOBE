
import { _decorator, Node, Sprite, UITransform, Layers, SpriteFrame, resources, Vec3, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HoverSprite')
export class HoverSprite extends Sprite {

    public container: Node | null = null;
    public selectNode: Node | null = null;
    public isSelect = false;

    start() {

        this.node.on(Node.EventType.MOUSE_DOWN, this.clickSprite, this);
        this.node.on(Node.EventType.MOUSE_ENTER, this.hover, this);
        this.node.on(Node.EventType.MOUSE_LEAVE, this.unhover, this);
    }

    hover() {

        var rect = this.node.getComponent(UITransform)?.getBoundingBoxToWorld();
        this.container?.emit("Hover", rect);
    }

    unhover() {

        this.container?.emit("Unhover");
    }

    disableSelect() {
        
        if(this.selectNode){

            this.isSelect = false;
            this.selectNode!.destroy();
            this.selectNode = null;
        }
    }

    clickSprite() {

        this.isSelect = true;
        this.container?.emit("Select", this.node);

        if (this.selectNode == null) {
            this.selectNode = new Node();
            this.selectNode.layer = Layers.Enum.UI_2D;
            var sprite = this.selectNode.addComponent(Sprite);
            resources.load("Textures/btn_expand/spriteFrame", SpriteFrame, (err, spriteFrame) => {
                sprite.spriteFrame = spriteFrame;
            });

            var rect = this.node.getComponent(UITransform)!.getBoundingBoxToWorld();
            this.selectNode.getComponent(UITransform)?.setAnchorPoint(new Vec2(0.5, 0.5));
            this.selectNode.setPosition(new Vec3(0, -(rect.height / 2 + 10), 0));
            this.node.addChild(this.selectNode);
        }
    }
}
