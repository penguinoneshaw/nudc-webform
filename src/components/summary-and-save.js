import {css, html} from 'lit-element';
import {connect} from 'pwa-helpers/connect-mixin.js';

import {competitorsWithEventsSelector, couplesSelector, EventsWithCouplesSelector, OffbeatTeamSelector} from '../reducers/form';
import {store} from '../store.js';

import {PageViewElement} from './page-view-element.js';

import {total_entry_fee, entry_fee} from '../entry_fees';

import './couple_form/index';

// This element is connected to the Redux store.
import '@polymer/paper-button';
import '@polymer/iron-icons';


import {SharedStyles} from './shared-styles.js';

import saveFile from '../save_files';


class SummaryAndSave extends connect(store)(PageViewElement) {
    static get properties() {
        return {
            _competitors: {type: Object},
            _couples: {type: Array},
            _events: {type: Array},
            _offbeat: {type: Boolean},
            _basic_information: {type: Object},
            _offbeat_team: {type: Array},
            _total_entry_fee: {type: Number}
        };
    }

    static get styles() {
        return [
            css`
                tr > td {
                    text-align: center
                }
                paper-button.add {
                    background: var(--app-primary-color);
                    color: white;
                  }

                paper-button[disabled] {
                    background: grey
                }

                .submit {
                    background: var(--app-primary-color);
                    color: white;
                    display: block;
                    margin: 0 auto;
                }

                h4 {
                    font-weight: bold;
                    font-variant-caps: small-caps;
                }

                dd::before {
                    margin-left: 0;
                }
            `,
            SharedStyles
        ];
    }

    render() {
        return html`

        <section>
        <h2>Summary</h2>

        <p>This page summarises all of the previous information entered. 
        Once happy with it, please push the button below to save everything as a zip file. 
        Once this is done, please email it to <a href="mailto:nudc-entries@eubds.co.uk?subject=${
    encodeURIComponent(
        this._basic_information.university +
            ' - entries')}">nudc-entries@eubds.co.uk</a>${
    !this._basic_information.university ? '' :
        html` with the subject being '${
            this._basic_information.university} - entries'`}. We also recommend that you print (or save as a PDF) this page for your records, just in case something goes wrong!</p>
        <p>Since the 30th January deadline for entry has now passed, the entry fees have increased to the 'late entry' levels as stated in the team captains' pack. This is a surcharge of £5 per competitor.</p>
        <paper-button ?disabled=${
    !this._basic_information.university} class="submit" @click=${
    () => saveFile({
        basic_information: this._basic_information,
        couples: this._couples,
        competitors: this._competitors,
        events: this._events,
        offbeat: this._offbeat,
        offbeat_team: this._offbeat_team,
        total_entry: this._total_entry_fee
    })}><iron-icon icon="done-all"></iron-icon> Finish and Save Zip File</paper-button>
        </section>
        <section class="hideable" ?active=${this._basic_information.university}>
        <h3>Basic Information</h3>
            ${
    this._basic_information.university ? html`<h4>University</h4>
            <p>${this._basic_information.university}</p>` :
        ''}
            ${
    this._basic_information.team_captain ? html`<h4>Team Captain(s)</h4>
            <p>${this._basic_information.team_captain}${
    this._basic_information.tc_email ?
        ' <' + this._basic_information.tc_email + '>' :
        ''}</p>` :
        ''}
            ${
    this._basic_information.coaches_names ? html`<h4>Coach(es)</h4>
            <p>${this._basic_information.coaches_names}</p>` :
        ''}
            ${
    this._total_entry_fee != 0 ? html`<h4>Estimated Total Entry Fee</h4>
            <p>£${this._total_entry_fee}</p>` :
        ''}
        </section>
        <section class="hideable" ?active=${
    Object.values(this._competitors).length != 0}>
        <h3>Competitors</h3>
        <table>
        <thead>
        <tr>
            <th>Name</th>
            <th>Student Status</th>
            <th>Beginner?</th>
            <th>Alien?</th>
            <th>Released From</th>
            <th>Entry Fee</th>
        </tr>
        </thead>
        <tbody>
        ${
    Object.values(this._competitors).sort((a, b) => (a.name > b.name) ? 1 : -1)
        .map((comp) => this.competitor_row(comp))}
        </tbody>
        </table>
        </section>
        <section class="hideable" ?active=${
    Object.values(this._couples).length != 0}>
        <h3>Couples</h3>
        <table>
        <thead>
        <tr>
        <th>Lead</th><th>Follow</th><th>Events</th>
        </tr>
        </thead>
        <tbody>
        ${Object.values(this._couples).sort(this.sortCouples.bind(this)).map((couple) => {
        let events = couple.events.map((ev) => {
            return this._events[ev];
        });
        return html`<couple-row .lead=${this._competitors[couple.lead]} .follow=${
            this._competitors[couple.follow]} .events=${events}></couple-row>`;
    })}
        </tbody>
        </table>
      </section>
      <section class="hideable" ?active=${
    this._offbeat && this._offbeat_team.length != 0}>
      <h3>Offbeat Team</h3>
      <ul>
      ${this._offbeat_team.sort((a, b) => a.name > b.name ? 1 : -1).map((member) => html`<li>${member.name}</li>`)}
      </ul>
      </section>

    `;
    }


    // This is called every time something is updated in the store.
    stateChanged(state) {
        this._competitors = competitorsWithEventsSelector(state);
        this._couples = couplesSelector(state);
        this._events = EventsWithCouplesSelector(state);
        this._offbeat = state.form.offbeat.competing;
        this._offbeat_team = OffbeatTeamSelector(state);
        this._basic_information = state.form.basic_information;
        this._form = state.form;
        this._total_entry_fee = total_entry_fee(this._competitors);
    }

    competitor_row(competitor) {
        return html`
            <tr data-id="${competitor.id}">
            <td>${competitor.name}</td>
            <td>${competitor.student_status}</td>
            <td>${
    competitor.beginner ? html`<iron-icon icon="check"></iron-icon>` :
        html`<iron-icon icon="clear"></iron-icon>`}</td>
            <td>${
    competitor.alien ? html`<iron-icon icon="check"></iron-icon>` :
        html`<iron-icon icon="clear"></iron-icon>`}</td>
            <td>${competitor.alien ? competitor.release_from : ''}</td>
            <td>£${entry_fee(competitor, this._offbeat)}</td>
            </tr>
        `;
    }

    sortCouples(a, b) {
        if (this._competitors[a.lead].name > this._competitors[b.lead].name){
            return 1;
        } else if (this._competitors[a.lead].name == this._competitors[b.lead].name && this._competitors[a.follow].name > this._competitors[b.follow].name) {
            return 0; 
        } else {
            return -1;
        }
    }
}


window.customElements.define('summary-and-save', SummaryAndSave);
