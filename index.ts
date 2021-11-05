import alt from "alt-client";
import native from "natives";

import Chair from "./chair";
import Util from "./util";

class SeatableManager {
    private KEY_E: number = 69;
    private SEAT_RADIUS: number = 4;

    public isSeating: boolean = false;

    public activeChair: Chair;

    constructor() {
        alt.on("keyup", (key) => key === this.KEY_E && (this.isSeating ? this._standHandle() : this._seatHandle()));
    }

    public getNearestChair(pos: alt.Vector3): [number, string] {
        let chairScriptID: number = 0;
        let chairModel: string = "";

        Chair.models.forEach((model) => {
            const newChairHandle: number = native.getClosestObjectOfType(pos.x, pos.y, pos.z, this.SEAT_RADIUS, alt.hash(model), false, false, false);

            if (newChairHandle !== 0 && (chairScriptID === 0 || (Util.calcDist(pos, native.getEntityCoords(newChairHandle, true)) > Util.calcDist(pos, native.getEntityCoords(chairScriptID, true))))) {
                chairScriptID = newChairHandle;
                chairModel = model;
            }
        });

        return [chairScriptID, chairModel];
    }

    private _attachToChair(player, chairScriptID): void {
        native.attachEntityToEntity(
            player.scriptID,
            chairScriptID,
            0,
            0, 0, 0.45,
            0, 0, 180,
            true, true,
            false, false,
            0, true
        );
    }

    private _seatHandle = (): void => {
        const [nearestChairHandle, nearestChairModel] = this.getNearestChair(alt.Player.local.pos);

        if (nearestChairHandle === 0) return alt.log(`Стул не найден`);

        this.activeChair = new Chair(nearestChairHandle);

        if (!this.activeChair.isValid()) return alt.log(`На стул невозможно сесть`);

        this.isSeating = true;

        const chairPos = this.activeChair.pos;

        native.taskStartScenarioAtPosition(
            alt.Player.local,
            "PROP_HUMAN_SEAT_BENCH",
            chairPos.x, chairPos.y, chairPos.z + 0.4,
            this.activeChair.heading + 180.0,
            0, true, false
        );

        this._attachToChair(alt.Player.local, this.activeChair.scriptID);
    }

    private _standHandle = (): void => {
        this.isSeating = false;

        native.detachEntity(alt.Player.local.scriptID, true, false);
        native.clearPedTasksImmediately(alt.Player.local.scriptID);
    }
}

new SeatableManager();