// @flow

import { idb } from "../../db";
import { g } from "../../util";

const draftOne = async (): Promise<number | void> => {
    const allStars = await idb.cache.allStars.get(g.season);

    if (allStars.finalized) {
        return;
    }

    const teamInd = allStars.teams[0].length > allStars.teams[1].length ? 1 : 0;

    const remaining = allStars.remaining.filter(p => !p.injured);

    const r = Math.random();
    let pick;
    if (r < 0.4 || remaining.length === 1) {
        pick = remaining[0];
    } else if (r < 0.7 || remaining.length === 2) {
        pick = remaining[1];
    } else if (r < 0.9 || remaining.length === 3) {
        pick = remaining[2];
    } else {
        pick = remaining[3];
    }
    console.log(remaining.length, pick);

    if (!pick) {
        throw new Error("No player found");
    }

    allStars.teams[teamInd].push(pick);
    allStars.remaining = allStars.remaining.filter(p => p.pid !== pick.pid);

    if (allStars.remaining.every(({ injured }) => injured)) {
        allStars.finalized = true;
    }

    await idb.cache.allStars.put(allStars);

    return pick.pid;
};

export default draftOne;