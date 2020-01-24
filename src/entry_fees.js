export const entry_fee = (competitor, offbeat = true) => {
    competitor.events = competitor.events || [];
    if (competitor.events.length == 0 && competitor.offbeat && offbeat ||
        (competitor.events.includes('onarr') || competitor.events.includes('oarr')) && competitor.events.length == 1 ||
        (competitor.events.includes('onarr') && competitor.events.includes('oarr') && competitor.events.length == 2)) {
        return 15;
    } else if (competitor.events.length == 0 && !(competitor.offbeat && offbeat)) {
        return 4;
    } else {
        return 20;
    }
};

export const total_entry_fee = (competitors) => {
    return Object.values(competitors).reduce((prev, competitor) => prev + entry_fee(competitor), 0);
};