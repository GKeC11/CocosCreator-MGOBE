
import { _decorator, Component, Node, Prefab, instantiate, Label, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('OnlineUI')
export class OnlineUI extends Component {

    @property({ type: Node })
    content: Node | null = null;

    @property({ type: Prefab })
    playerItemPrefab: Prefab | null = null;

    start() {

    }

    appendCotent(playerList: MGOBE.types.PlayerInfo[]) {

        console.log("OnLineUI 获得了数据");
        console.log(playerList);
        
        playerList.forEach((element, index) => {
            var player = instantiate(this.playerItemPrefab) as unknown as Node;
            player.children[0].getComponent(Label)!.string = element.name;
            var y = -(player.getComponent(UITransform)!.height * index);
            var x = player.getPosition().x;
            player.setPosition(new Vec3(x, y, 0));
            this.content?.addChild(player);
        });
    }
}