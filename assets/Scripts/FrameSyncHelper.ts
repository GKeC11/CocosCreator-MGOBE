import Global from "./Global";
import { GlobalManager } from "./GlobalManager";


export function sendFrameCmd(...paras: any[]) {

    var frame = {
        
        playerPos: paras[0],
    };

    const sendFramePara = {
        data: frame,
    }

    Global.room?.sendFrame(sendFramePara, event => {
        
    });
}

export function sendClientMsg(index: number) {

    var data = MGOBE.Player.id + ":" + index;

    var clientMsgPara: MGOBE.types.SendToClientPara = {

        msg: data,
        recvType: MGOBE.ENUM.RecvType.ROOM_ALL,
        recvPlayerList: [],
    }

    Global.room?.sendToClient(clientMsgPara);
}

export function isOnline(): Boolean{

    return (Global.room!.roomInfo.playerList.length > 1)
}

export default {

    sendFrameCmd,
    sendClientMsg,
    isOnline,
}