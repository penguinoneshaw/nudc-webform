import {LitElement, html, css} from 'lit-element';
import {SharedStyles} from '../shared-styles';
import './event-row';

class EventsSelector extends LitElement {
    static get styles() {
        return [
            SharedStyles,
            css`
                :host {
                    display:none
                }

                :host([active]) {
                    display: contents
                }      
            `
        ];
    }

    static get properties() {
        return {
            events: {type: Array},
            chosen_events: {type: Object},
            active: {type: Boolean}
        };
    }

    render() {
        return html`
        <section>
        <h3>Assign couple events</h3>
        <table>
        <thead><tr><th>Event</th><th>Actions</th></tr></thead>
        <tbody>
        ${this.events.map((ev) => {
        return html`<event-row ?selected=${this.chosen_events[ev.id]} .event=${ev}></event-row>`;
    })}
        </tbody>
        </table>
        </section>
        `;
    }
}
export default EventsSelector;
window.customElements.define('events-selector', EventsSelector);