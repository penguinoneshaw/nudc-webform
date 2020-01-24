import {
    html,
    css
} from 'lit-element';
import {
    PageViewElement
} from './page-view-element.js';
import {
    connect
} from 'pwa-helpers/connect-mixin.js';

import {
    update_couple, delete_couple_from_event
} from '../actions/forms';

import {allowedEventsListSelector, CoupleEventsSelector} from '../reducers/form';

import {
    store
} from '../store.js';
import './save_button';

import './couple_form/index';

// This element is connected to the Redux store.
import '@polymer/paper-input/paper-input';
import '@polymer/paper-checkbox';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu';
import '@polymer/paper-item/paper-item';
import '@polymer/paper-listbox/paper-listbox';
import '@polymer/paper-button';
import '@polymer/iron-icons';


import {
    SharedStyles
} from './shared-styles.js';
import { changeLeadFollow } from '../actions/app.js';


class CouplesView extends connect(store)(PageViewElement) {
    static get properties() {
        return {
            _competitors: {
                type: Object
            },
            _couples: {
                type: Array
            },
            _follow: {
                type: String
            },
            _lead: {
                type: String
            },
            _chosen_events: {
                type: Object
            },
            _events: {
                type: Array
            },
            _all_events: {
                type: Object
            }
        };
    }

    constructor() {
        super();
        this._lead = '';
        this._follow = '';
        this._competitors = {};
        this._events = [];
        this._chosen_events = {};
        this._all_events = {};
    }

    static get styles() {
        return [
            SharedStyles,
            css `
                tr > td {
                    text-align: center
                }
                paper-button.add {
                    background: var(--app-primary-color);
                    color: white;
                  }
                section.hideable:not([active]) {
                    display: none
                }

                .submit {
                    background: var(--app-primary-color);
                    color: white;
                    display: block;
                    margin: 0 auto;
                }
            `
        ];
    }

    _selected_events_as_array() {
        return Object.keys(this._chosen_events).filter((k) => this._chosen_events[k]);
    }

    _summary_section() {
        if (this._lead && this._follow && this._chosen_events.length != 0) {
            return html`<section>
            <h3>${this._competitors[this._lead].name} &amp; ${this._competitors[this._follow].name}</h3>
            <ul>
                ${this._selected_events_as_array().map((id) => {
        return html`<li>${this._all_events[id].category} ${this._all_events[id].name}</li>`;
    })}
            </ul>
            <paper-button class="submit" @click=${this._add_couple}><iron-icon icon="check"></iron-icon> Submit</paper-button>

            </section>`;
        } else {
            return;
        }
    }

    render() {
        return html `
      <section>
        <h2>Couples</h2>
        <save-button></save-button>

        <p>For each of your couples, select one lead and one follow, and the events which they will be dancing.</p>
        <ul>
        <li>In order to compete in the beginners' dances, both members of the couple must be beginners.</li>
        <li>In order to dance in the ex-student categories, a couple must be made up of at least one ex-student.</li>
        <li>In order to dance in the Present Student events, both members of a couple must be students.</li>
         </ul>
         </section>
         <section>
        <h3>Add a Couple</h3>
        <table>
        <thead>
        <th>Name</th><th>Set as Lead/Follow</th>
        </thead>
        <tbody>
        ${Object.values(this._competitors).map((competitor) => {
        return html`
            <competitor-row 
                .couple_status=${(()=> {if (this._lead == competitor.id) {return 'lead';} else if (this._follow == competitor.id) {return 'follow';} else {return null;}})()} 
                @change-to-lead=${this._handle_couple_change} 
                @change-to-follow=${this._handle_couple_change} 
                @change-to-null=${this._handle_couple_change} 
                .competitor=${competitor}></competitor-row>`;
    })}
        </tbody>
        </table>
        </section>
        <section>
        <events-selector ?active=${this._lead && this._follow} @fixEvent=${this._event_list_admin} .events=${this._events} .chosen_events=${this._chosen_events}></events-selector>
        </section>
        ${this._summary_section()}
        
        <section>
        <h3>Current List</h3>
        <table>
        <thead>
        <tr>
        <th>Lead</th><th>Follow</th><th>Events</th>
        </tr>
        </thead>
        <tbody>
        ${Object.values(this._couples).map((couple) => {
        let events = couple.events.map((ev) => {
            return this._all_events[ev];
        });
        return html`<couple-row @removeEventCouple=${this._remove_couple_from_event} .editable=${true} .lead=${this._competitors[couple.lead]} .follow=${this._competitors[couple.follow]} .events=${events} .couple=${couple.id}></couple-row>`;
    })}
        </tbody>
        </table>
      </section>

    `;
    }

    _event_list_admin(e) {
        let toggledEvent = e.detail.event_id;
        this._chosen_events = {...this._chosen_events,
            [toggledEvent]: !this._chosen_events[toggledEvent]
        };
    }

    _remove_couple_from_event(e) {
        store.dispatch(delete_couple_from_event(e.detail.couple, e.detail.event));
    }

    _handle_couple_change(e) {
        let target_element = e.target;
        if (e.type === 'change-to-lead') {
            store.dispatch(changeLeadFollow('lead', target_element.competitor.id));
        } else if (e.type === 'change-to-follow') {
            store.dispatch(changeLeadFollow('follow', target_element.competitor.id));
        } else if (e.type === 'change-to-null') {
            store.dispatch(changeLeadFollow(target_element.couple_status, null));
        }

        this._chosen_events = [];
    }

    _add_couple() {
        store.dispatch(update_couple(this._lead, this._follow, this._selected_events_as_array()));
        this._chosen_events = [];
    }


    // This is called every time something is updated in the store.
    stateChanged(state) {
        this._competitors = state.form.competitors;
        this._couples = CoupleEventsSelector(state);
        this._events = allowedEventsListSelector(state);
        this._all_events = state.form.events;
        this._lead = state.app.form_fields.lead;
        this._follow = state.app.form_fields.follow;
    }
}

window.customElements.define('couples-form', CouplesView);