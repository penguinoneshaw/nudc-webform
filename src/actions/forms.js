import { get, set } from 'idb-keyval';
import { readAsText } from '../utils/PromiseFileReader';
export const UPDATE_FORM = 'UPDATE_FORM';

export const ADD_COUPLE = 'ADD_COUPLE';
export const DELETE_COUPLE_FROM_EVENT = 'DELETE_COUPLE_FROM_EVENT';
export const TOGGLE_COMPETITOR_OFFBEAT = 'TOGGLE_COMPETITOR_OFFBEAT';
export const CHANGE_COMPETING_IN_OFFBEAT_STATUS = 'CHANGE_COMPETING_IN_OFFBEAT_STATUS';
export const TOGGLE_COMPETITOR_BEGINNER_STATUS = 'TOGGLE_BEGINNER_STATUS';
export const DELETE_COMPETITOR = 'DELETE_COMPETITOR';
export const LOAD_FROM_SAVE = 'LOAD_FROM_SAVE';
export const SAVE_FORM = 'SAVE_FORM';
export const FORM_SAVED = 'FORM_SAVED';
export const FORM_IMPORT_FROM_FILE = 'IMPORT_FROM_FILE';

export const save_form = () => (dispatch, getState) => {
    if (getState().form.save_state.saved) return;
    dispatch({
        type: SAVE_FORM
    });

    return set('form', getState().form).then(() => {
        dispatch({
            type: FORM_SAVED,
            success: true
        });
    }).catch(() => {
        dispatch({
            type: FORM_SAVED,
            success: false
        });
    });
};

export const import_form_from_file = (file_handle) => async (dispatch) => {
    const file = await readAsText(file_handle);
    const form_entry = JSON.parse(file);
    if (!form_entry.basic_information.university) return;
    set('comp_id', Object.keys(form_entry.competitors).pop);
    set('couple_id', Object.keys(form_entry.couples).pop);

    dispatch({
        type: FORM_IMPORT_FROM_FILE,
        basic_information: form_entry.basic_information,
        competitors: Object.values(form_entry.competitors).reduce(
            (prev, competitor) => {
                return Object.assign(prev, {[competitor.id]: {
                    id: competitor.id,
                    name: competitor.name,
                    student_status: competitor.student_status,
                    beginner: competitor.beginner,
                    offbeat: competitor.offbeat,
                    alien: competitor.alien,
                    release_from: competitor.release_from
                }});
            }
        , {}),
        couples: form_entry.couples,
        offbeat: {
            competing: form_entry.offbeat
        }
    });

    save_form();
};

export const load_from_save = () => async (dispatch) => {
    let form_data = await get('form');

    dispatch({
        type: LOAD_FROM_SAVE,
        data: form_data
    });
    
};

export const update_competitor = (competitor) => async (dispatch) =>  {
    let comp_id = await get('comp_id') || 0;
    if (!competitor.id) competitor.id = ++comp_id;
    set('comp_id', comp_id);
    return dispatch(update_form('competitors', comp_id, competitor));
};

export const delete_competitor = (competitor) => {
    return {
        type: DELETE_COMPETITOR,
        id: competitor
    };
};

export const delete_couple_from_event = (couple, event) => {
    return {
        type: DELETE_COUPLE_FROM_EVENT,
        id: couple,
        event
    };
};


export const update_couple = (lead, follow, events, id=null) => async (dispatch) => {
    let couple_id = await get('couple_id') || 0;
    if (!id) id = ++couple_id;
    set('couple_id', couple_id);
    return dispatch({
        type: ADD_COUPLE,
        id: couple_id,
        lead,
        follow,
        events
    });
};

export const update_form = (form_section, key, value) => {
    return {
        type: UPDATE_FORM,
        form_section,
        key,
        value
    };
};

export const toggle_competitor_offbeat = (id) => {
    return {
        type: TOGGLE_COMPETITOR_OFFBEAT,
        id
    };
};

export const toggle_competitor_beginner = (id) => {
    return {
        type: TOGGLE_COMPETITOR_BEGINNER_STATUS,
        id
    };
};

export const change_offbeat_competing_status = (new_state) => {
    return {
        type: CHANGE_COMPETING_IN_OFFBEAT_STATUS,
        offbeat_status: new_state
    };
};