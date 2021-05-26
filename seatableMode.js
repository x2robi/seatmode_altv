const leftDoorHash = mp.game.joaat("v_ilev_csr_door_l");
const rightDoorHash = mp.game.joaat("v_ilev_csr_door_r");

const coord = {x: -39.436767578125, y: -1109.1448974609375, z: 26.437620162963867};

const leftDoorHandle = mp.game.object.getClosestObjectOfType(coord.x, coord.y, coord.z, 10, leftDoorHash, false, false, false);
const rightDoorHandle = mp.game.object.getClosestObjectOfType(coord.x, coord.y, coord.z, 10, rightDoorHash, false, false, false);

const leftDoorObject = mp.objects.newWeak(leftDoorHandle);
const rightDoorObject = mp.objects.newWeak(rightDoorHandle);

// def -20

mp.events.add({
	render: () => {
		const pv = mp.players.local.position;
		const dist = mp.game.system.vdist(...Object.values(pv), ...Object.values(coord));
		const r = (120 * ((15 - dist) / 15));

		if (leftDoorObject.handle !== 0 && rightDoorObject.handle !== 0) {
			leftDoorObject.setRotation(0, 0, -20 + r < -20 ? -20 : -20 + r, 1, true);
			rightDoorObject.setRotation(0, 0, -20 - r > -20 ? -20 : -20 - r, 1, true);
		}
	}
});

const anim = async (dict, anim, time, flag) => {
	mp.gui.chat.push(`anim start`)

	await new Promise((resolve) => {
        let interval = setInterval(() => {
            if (mp.game.streaming.hasAnimDictLoaded(dict)) {
                clearInterval(interval);
                resolve();
            } else {
            	mp.game.streaming.requestAnimDict(dict);
            }
        }, 0);
    });

	mp.players.local.taskPlayAnim(dict, anim, 8, 8, time, flag, 0, false, false, false);

	mp.gui.chat.push(`anim started`);
};

const degToRad = (deg) => {
	return (deg - 90) * (Math.PI / 180);
}

const chairHash = mp.game.joaat("prop_off_chair_05");

let chair;
let seatingTimeout;


mp.keys.bind(69, false, () => {
	if (seatingTimeout !== undefined)
		return;

	let pv = mp.players.local.position; 
	let plCoord;

	if (chair !== undefined) {		
		const chairCoord = chair.getCoords(true);

		plCoord = {
			x: chairCoord.x,
			y: chairCoord.y,
			z: chairCoord.z - .5
		};

		mp.players.local.setCoords(plCoord.x, plCoord.y, plCoord.z, false, false, false, false);

		anim("anim@amb@office@seating@male@var_e@base@", "exit", 2000, 0);

		seatingTimeout = setTimeout(() => {
			pv = mp.players.local.position; 
			plCoord = {
				x: chairCoord.x + .5 * Math.cos(degToRad(chair.getHeading())),
				y: chairCoord.y + .5 * Math.sin(degToRad(chair.getHeading())),
				z: chairCoord.z - .25
			};

			mp.players.local.setCoords(plCoord.x, plCoord.y, plCoord.z, false, false, false, false);

			mp.players.local.freezePosition(false);

			chair.freezePosition(false);
			chair = undefined;
			seatingTimeout = undefined;
		}, 2000);
	} else {
		const chairHandle = mp.game.object.getClosestObjectOfType(pv.x, pv.y, pv.z, 4, chairHash, false, false, false);

		if (chairHandle === 0 || chairHandle === undefined || chairHandle === null) {
			return mp.gui.chat.push("dont founded");
		}

		chair = mp.objects.newWeak(chairHandle);

		const chairRot = chair.getRotation(5);

		if (chairRot.x > 5 || chairRot.x < -5 || chairRot.y > 5 || chairRot.y < -5) {
			chair = undefined;
			return mp.gui.chat.push("chair krivoy " + chairRot.x + " " + chairRot.y);
		}

		const chairCoord = chair.getCoords(true);

		chair.freezePosition(true);

		plCoord = {
			x: chairCoord.x + .1 * Math.cos(degToRad(chair.getHeading())),
			y: chairCoord.y + .1 * Math.sin(degToRad(chair.getHeading())),
			z: chairCoord.z - .6
		};

		mp.players.local.freezePosition(true);
		mp.players.local.setCoords(plCoord.x, plCoord.y, plCoord.z, false, false, false, false);
		mp.players.local.setHeading(chair.getHeading() - 180);

		anim("anim@amb@office@seating@male@var_e@base@", "enter", 2000, 2);

		seatingTimeout = setTimeout(() => {
			anim("anim@amb@office@seating@male@var_e@base@", "base", -1, 1);
			seatingTimeout = undefined;
		}, 2000);
	}
});