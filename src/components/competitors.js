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
    update_competitor, toggle_competitor_offbeat, toggle_competitor_beginner, delete_competitor
} from '../actions/forms';
import './save_button';

import {
    store
} from '../store.js';

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

const contents = css `
    td.hideable, th.hideable {
        display: none
    }
    td.hideable[active], th.hideable[active] {
        display: table-cell
    }
    
    .swappable {
        cursor: pointer;
        border: 2px white solid;
        border-radius: 25%;
    }

    .swappable[icon="check"] {
        background-color: var(--app-primary-color);
        color: white;
    }
    .swappable[icon="clear"] {
        background-color: var(--app-secondary-color);
        color: white;
    }
    `;

const competitor_row = (offbeat) => (competitor) => {
    return html `
        <tr data-id="${competitor.id}">
        <td>${competitor.name}</td>
        <td>${competitor.student_status}</td>
        <td><iron-icon class="swappable" icon=${competitor.beginner ? 'check' : 'clear'} @click=${() => store.dispatch(toggle_competitor_beginner(competitor.id))}></iron-icon></td>
        <td class="hideable" ?active=${offbeat||false}>
            <iron-icon class="swappable" icon=${competitor.offbeat ? 'check' : 'clear'} @click=${() => store.dispatch(toggle_competitor_offbeat(competitor.id))}></iron-icon>
        </td>
        <td>${competitor.alien ? html`<iron-icon icon="check"></iron-icon>` : html`<iron-icon icon="clear"></iron-icon>`}</td>
        <td>${competitor.alien ? competitor.release_from : ''}</td>
        <td><paper-button @click=${() => store.dispatch(delete_competitor(competitor.id))} class="delete"><iron-icon icon="delete"></iron-icon> Delete</paper-button></td>
        </tr>
    `;
};

class CompetitorsView extends connect(store)(PageViewElement) {
    static get properties() {
        return {
            _competitors: {
                type: Array
            },
            _alien: {
                type: Boolean,
                value: false,
            },
            _beginner: {
                type: Boolean,
                value: false
            },
            _name: {
                type: String,
                value: '',
            },
            _release_from: {
                type: String,
                value: ''
            },
            _student_status: {
                type: String
            },
            _offbeat_enabled: {
                type: Boolean
            },
            _offbeat: {
                type: Boolean
            }
        };
    }

    constructor() {
        super();
        this._name = '';
        this._release_from = '';
        this._student_status = '';
        this._competitors = {};
        this._offbeat_enabled = false;
        this._offbeat = false;
    }

    static get styles() {
        return [
            SharedStyles,
            css `
                tr > td {
                    text-align: center
                }

            `,
            contents
        ];
    }

    render() {
        return html `
      <section class="wider">
        <h2>Competitors</h2>
        <save-button></save-button>

        <table>
        <thead>
        <tr>
            <th>Name</th>
            <th>Student Status</th>
            <th>Beginner?</th>
            <th class="hideable" ?active=${this._offbeat_enabled||false}>Offbeat</th>
            <th>Alien?</th>
            <th>Released From (if applicable)</th>
            <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        ${this._competitors.map(competitor_row(this._offbeat_enabled))}
        <tr id="add-form" class="entry">
            <td><paper-input label="Name" name="name" required value="${this._name}" @change="${(e) => this._name = e.target.value}"></paper-input></td>
            <td><paper-dropdown-menu label="Student Status" required name="student_status" value="${this._student_status}" @value-changed="${(e) => this._student_status = e.target.value}">
            <paper-listbox slot="dropdown-content">
            <paper-item>Present Student</paper-item>
            <paper-item>Ex-student</paper-item>
            <paper-item>Non Student</paper-item>
            </paper-listbox>
            </paper-dropdown-menu></td>
            <td><paper-checkbox name="beginner" ?checked="${this._beginner}" @change="${(e) => this._beginner = e.target.checked}"></paper-checkbox></td>
            <td class="hideable" ?active=${this._offbeat_enabled}><paper-checkbox name="offbeat" ?checked="${this._offbeat}" @change="${(e) => this._offbeat = e.target.checked}"></paper-checkbox></td>
            <td><paper-checkbox name="alien" ?checked="${this._alien}" @change="${(e) => this._alien = e.target.checked}"></paper-checkbox></td>
            <td><paper-input label="Released From" ?disabled=${!this._alien} tabindex="${this._alien? 0 : -1}" name="release_from" value="${this._release_from}" @change="${(e) => this._release_from = e.target.value}"></paper-input></td>
            <td><paper-button class="add" @click="${this._add_to_list}" ?disabled=${!(this._name !== '' && this._student_status !== '')}><iron-icon icon="done"></iron-icon> Confirm</paper-button></td>
        </tr>
        </tbody>
        </table>
        <p>Entries in the 'beginner' ${ this._offbeat_enabled ? 'and \'offbeat\' columns' : 'column'} may be clicked to change the value. Deleting a competitor deletes all couples which they are a member of.</p>
      </section>
      <section>
      <h2>Clarifications</h2>
      <ul>
      <li>In order to classify as a <em>beginner</em>, a competitor must have started dancing since IVDC 2018 (as defined in A.12 of NUDA Constitution).</li>
      <li>A <em>Non-Student</em> is somebody who has never studied at a UK university; for example, those who completed their studies abroad or have never studied at degree level (or some equivalents defined by IVDA).</li>
      <li>An <em>Alien Student</em> is a Present Student from a different UK university, regardless of whether or not that university has its own team. All of these should have already had a case raised with the IVDA Standing Committee.</li>
      </ul>
    `;
    }

    _add_to_list(e) {
        store.dispatch(update_competitor({
            name: this._name,
            beginner: this._beginner || false,
            alien: this._alien || false,
            release_from: this._alien ? this._release_from : '',
            student_status: this._student_status,
            offbeat: this._offbeat || false
        }));
        this._name = '';
        e.target.closest('tr > td > *:first-child').focus();
    }


    // This is called every time something is updated in the store.
    stateChanged(state) {
        console.log(Object.values(state.form.competitors));
        this._competitors = Object.values(state.form.competitors);
        this._offbeat_enabled = state.form.offbeat.competing;
    }
}

window.customElements.define('competitors-form', CompetitorsView);