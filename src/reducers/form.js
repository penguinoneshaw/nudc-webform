import {
    UPDATE_FORM,
    ADD_COUPLE,
    CHANGE_COMPETING_IN_OFFBEAT_STATUS,
    TOGGLE_COMPETITOR_OFFBEAT,
    TOGGLE_COMPETITOR_BEGINNER_STATUS,
    DELETE_COMPETITOR,
    DELETE_COUPLE_FROM_EVENT,
    LOAD_FROM_SAVE,
    SAVE_FORM,
    FORM_SAVED,
    FORM_IMPORT_FROM_FILE
} from '../actions/forms';
import {
    individual
} from '../data/events';
import {
    createSelector
} from 'reselect';
import {
    leadSelector,
    followSelector
} from './app';

const INITIAL_STATE = {
    save_state: {},
    basic_information: {},
    competitors: {},
    couples: {},
    offbeat: {
        competing: false
    },
    events: individual
};


const form = (state = INITIAL_STATE, action) => {
    switch (action.type) {
    case FORM_IMPORT_FROM_FILE:
        return {
            save_state: {
                saving: false,
                saved: false,
            },
            events: state.events,
            couples: action.couples,
            basic_information: action.basic_information,
            competitors: action.competitors,
            offbeat: action.offbeat
        };
    case CHANGE_COMPETING_IN_OFFBEAT_STATUS:
        return {
            ...state,
            offbeat: offbeat(state.offbeat, action)
        };
    case DELETE_COMPETITOR:
    {
        let new_state = { ...state,
            save_state: {
                saving: false,
                saved: false,
            },
            competitors: Object.keys(state.competitors)
                .filter((comp_id) => comp_id != action.id)
                .reduce((prev, next) => {
                    return { ...prev,
                        [next]: state.competitors[next]
                    };
                }, {}),
            couples: Object.keys(state.couples)
                .filter((cpl_id) => state.couples[cpl_id].lead != action.id && state.couples[cpl_id].follow != action.id)
                .reduce((prev, next) => {
                    return { ...prev,
                        [next]: state.couples[next]
                    };
                }, {})
        };

        return new_state;
    }
    case DELETE_COUPLE_FROM_EVENT:
    {
        let new_state = { ...state,
            save_state: {
                saving: false,
                saved: false,
            },
        };
        if (!(new_state.couples[action.id] && new_state.couples[action.id].events)) return new_state;
        new_state.couples[action.id].events = new_state.couples[action.id].events.filter(v => v != action.event);
        new_state.couples = Object.keys(new_state.couples)
            .filter((cpl_id) => state.couples[cpl_id].events.length != 0)
            .reduce((prev, next) => {
                return { ...prev,
                    [next]: state.couples[next]
                };
            }, {});
        return new_state;
    }
    case ADD_COUPLE:
    {
        let prev_entry = Object.values(state.couples).filter(({
            lead,
            follow
        }) => lead == action.lead && follow == action.follow);
        const couple = prev_entry.length == 0 ? {
            [action.id]: {
                id: action.id,
                lead: action.lead,
                follow: action.follow,
                events: [...new Set(action.events)]
            }
        } : {
            [prev_entry[0].id]: {
                ...prev_entry[0],
                events: [...new Set([...prev_entry[0].events, ...action.events])]
            }
        };
        return {
            ...state,
            save_state: {
                saving: false,
                saved: false
            },
            couples: {
                ...state.couples,
                ...couple
            },
            events: events(state.events, action)
        };
    }
    case UPDATE_FORM:
    {
        return {
            ...state,
            save_state: {
                saving: false,
                saved: false
            },
            [action.form_section]: {
                ...state[action.form_section],
                [action.key]: action.value
            },
            offbeat: offbeat(state.offbeat, action)
        };
    }
    case TOGGLE_COMPETITOR_OFFBEAT:
    {
        return {
            ...state,
            save_state: {
                saving: false,
                saved: false
            },
            competitors: {
                ...state.competitors,
                [action.id]: {
                    ...state.competitors[action.id],
                    offbeat: !state.competitors[action.id].offbeat
                }
            }
        };
    }
    case TOGGLE_COMPETITOR_BEGINNER_STATUS:
    {
        return {
            ...state,
            save_state: {
                saving: false,
                saved: false
            },
            competitors: {
                ...state.competitors,
                [action.id]: {
                    ...state.competitors[action.id],
                    beginner: !state.competitors[action.id].beginner
                }
            }
        };
    }
    case LOAD_FROM_SAVE: {
        return {...state, ...action.data, save_state: {
            saving: false,
            saved: true
        }};
    }
    case SAVE_FORM: {
        return {
            ...state,
            save_state: {
                saving: true,
                saved: false
            },
        };
    }
    case FORM_SAVED: {
        return {
            ...state,
            save_state: {
                saving: false,
                saved: action.success
            },
        };
    }
    default:
        return state;
    }
};

const offbeat = (state, action) => {
    switch (action.type) {
    case CHANGE_COMPETING_IN_OFFBEAT_STATUS:
        return {
            ...state,
            competing: action.offbeat_status
        };
    default:
        return state;
    }
};

const events = (state, action) => {
    switch (action.type) {
    default:
        return state;
    }
};

export default form;

export const competitorSelector = (state) => state.form.competitors;

export const couplesSelector = (state) => state.form.couples;

export const eventsSelector = (state) => state.form.events;

export const offbeatSelector = (state) => state.form.offbeat;

export const basicInformationSelector = (state) => state.form.basic_information;

export const allowedEventsListSelector = createSelector(
    eventsSelector,
    competitorSelector,
    leadSelector,
    followSelector,
    (events, competitors, lead, follow) => {

        let eventsList = Object.values(events);

        let competitor_1 = competitors[lead];
        let competitor_2 = competitors[follow];

        if (!competitor_1 || !competitor_2) {
            return [];
        }

        return eventsList.filter((evt) => {
            switch (evt.eligibility) {
            case 'Present Student':
            {
                let both_students = competitor_1.student_status === 'Present Student' && competitor_2.student_status === 'Present Student';
                if (evt.category === 'Beginner\'s') {
                    return competitor_1.beginner && competitor_2.beginner && both_students;
                }
                return both_students;
            }
            case 'Ex-student':
                return competitor_1.student_status === 'Ex-student' || competitor_2.student_status === 'Ex-student';
            default:
                return true;
            }
        });
    }
);

export const competitorsWithEventsSelector = createSelector(
    competitorSelector,
    couplesSelector,
    (competitors, couples) => {
        let new_competitors = Object.keys(competitors).map(comp_id => {
            return {
                comp_id,
                events: Object.values(couples).filter(cpl => cpl.lead == comp_id || cpl.follow == comp_id).reduce((prev, cpl) => [...new Set([...prev, ...cpl.events])], [])
            };
        }).reduce((prev, {
            comp_id,
            events
        }) => Object.assign(prev, {
            [comp_id]: { ...competitors[comp_id],
                events
            }
        }), {});
        return new_competitors;
    }
);

export const CoupleEventsSelector = (state) => state.form.couples;

export const EventsWithCouplesSelector = createSelector(
    eventsSelector,
    couplesSelector,
    (events, couples) => {
        let result = Object.keys(events).map(
            (evt) => {
                let event_couples = Object.values(couples).filter(couple => (couple.events || []).includes(evt)).map(couple => couple.id);
                return {
                    evt: evt,
                    competing_couples: event_couples || []
                };
            }
        ).reduce((prev, {
            evt,
            competing_couples
        } = {}) => Object.assign(prev, {
            [evt]: { ...events[evt],
                competing_couples
            }
        }), {});
        return result;
    }
);

export const OffbeatTeamSelector = createSelector(
    competitorSelector,
    (competitors) => {
        return [].concat(Object.values(competitors).filter(element => element.offbeat));
    }
);