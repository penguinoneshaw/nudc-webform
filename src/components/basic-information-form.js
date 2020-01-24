import {
    html
} from 'lit-element';

import {
    SharedStyles
} from './shared-styles.js';

import '@polymer/paper-input/paper-input';
import '@polymer/paper-checkbox';
import './save_button';

import {
    store
} from '../store';
import {
    update_form,
    change_offbeat_competing_status
} from '../actions/forms';


import {
    connect
} from 'pwa-helpers/connect-mixin.js';
import {
    PageViewElement
} from './page-view-element.js';


class BasicInformationForm extends connect(store)(PageViewElement) {

    static get properties() {
        return {
            _inputs: {
                type: Object
            },
            _offbeat_status: {
                type: Boolean
            }
        };
    }

    static get styles() {
        return [
            SharedStyles
        ];
    }

    render() {
        return html `
        <section>
            <h2>Basic Information</h2>
            <save-button></save-button>
            <div>
            <paper-input required always-float-label name="university" label="University" @change="${this._updateInput}" value="${this._inputs.university || ''}"></paper-input>
            <paper-input required always-float-label name="team_captain" label="Team Captain(s)" @change="${this._updateInput}" value="${this._inputs.team_captain || ''}"></paper-input>
            <paper-input required always-float-label name="tc_email" label="Contact Email" @change="${this._updateInput}" value="${this._inputs.tc_email || ''}" type="email"></paper-input>
            <paper-input required always-float-label name="coaches_names" label="Coaches' Names - each university receives up to two free tickets." @change="${this._updateInput}" value="${this._inputs.coaches_names || ''}"></paper-input>
            <paper-checkbox ?checked=${this._offbeat_status||false} @change="${(e) => store.dispatch(change_offbeat_competing_status(e.target.checked))}">Competing in Offbeat?</paper-checkbox>
            </div>
        </section>
        `;
    }

    _updateInput(e) {
        store.dispatch(update_form('basic_information', e.target.name, e.target.value));
    }

    stateChanged(state) {
        this._inputs = state.form.basic_information;
        this._offbeat_status = state.form.offbeat.competing;
    }
}

window.customElements.define('basic-information-form', BasicInformationForm);