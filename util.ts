import alt from "alt-client";
import natives from "natives";

export default class Util {
    public static calcDist(v1: alt.Vector3, v2: alt.Vector3): number {
        const x = Math.pow((v2.x - v1.x), 2);
        const y = Math.pow((v2.y - v1.y), 2);
        const z = Math.pow((v2.z - v1.z), 2);
        const sqrt = Math.sqrt(x + y + z);

        return Math.abs(sqrt);
    }
}