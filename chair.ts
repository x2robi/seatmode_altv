import alt from "alt-client";
import natives from "natives";

export default class Chair {
    public static models: Array<string> = ["prop_off_chair_05"];

    private readonly _entity: number;

    constructor(scriptID: number) {
        this._entity = scriptID;
    }

    public get pos(): alt.Vector3 {
        return natives.getEntityCoords(this._entity, true);
    }

    public get rotation(): alt.Vector3 {
        return natives.getEntityRotation(this._entity, 2);
    }

    public get heading(): number {
        return natives.getEntityHeading(this._entity);
    }

    public get scriptID(): number {
        return this._entity;
    }

    isValid(): boolean {
        const rot = this.rotation;

        return this.scriptID !== 0 && (rot.x > -1 && rot.x < 1) && (rot.y > -1 && rot.y < 1);
    }
}