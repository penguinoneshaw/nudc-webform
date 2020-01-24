/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import {
    UPDATE_PAGE,
    UPDATE_OFFLINE,
    OPEN_SNACKBAR,
    CLOSE_SNACKBAR,
    UPDATE_DRAWER_STATE,
    CHANGE_LEAD_FOLLOW
} from '../actions/app.js';
import { ADD_COUPLE } from '../actions/forms.js';

const INITIAL_STATE = {
    page: '',
    offline: false,
    drawerOpened: false,
    snackbarOpened: false,
    form_fields: {
        lead: null,
        follow: null
    }
};

const app = (state = INITIAL_STATE, action) => {
    switch (action.type) {
    case UPDATE_PAGE:
        return {
            ...state,
            page: action.page
        };
    case UPDATE_OFFLINE:
        return {
            ...state,
            offline: action.offline
        };
    case UPDATE_DRAWER_STATE:
        return {
            ...state,
            drawerOpened: action.opened
        };
    case OPEN_SNACKBAR:
        return {
            ...state,
            snackbarOpened: true
        };
    case CLOSE_SNACKBAR:
        return {
            ...state,
            snackbarOpened: false
        };
    default:
        return { ...state,
            form_fields: form_fields(state.form_fields, action),
        };
    }
};

const form_fields = (state, action) => {
    switch (action.type) {
    case ADD_COUPLE:
        return {
            ...state,
            lead: null,
            follow: null
        };
    case CHANGE_LEAD_FOLLOW:
        if (action.dancer === 'lead' && state.follow === action.competitor) {
            return {
                ...state,
                lead: action.competitor,
                follow: null
            };
        } else if (action.dancer === 'follow' && state.lead === action.competitor) {
            return {
                ...state,
                follow: action.competitor,
                lead: null
            };
        }
        return { ...state,
            [action.dancer]: action.competitor
        };
    default:
        return state;
    }
};

export const leadSelector = (state) => state.app.form_fields.lead;
export const followSelector = (state) => state.app.form_fields.follow;

export default app;