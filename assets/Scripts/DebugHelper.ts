
import { _decorator, Component, Node, Graphics, math } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DebugHelper')
export class DebugHelper extends Graphics {

    drawDebugRect(rect: math.Rect){

        this.rect(rect.xMin, rect.yMin, rect.width, rect.height);
        this.stroke();
    }
}