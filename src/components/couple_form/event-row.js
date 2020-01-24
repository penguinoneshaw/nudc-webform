const ToggleEventInEvents = (event_id) => new CustomEvent('fixEvent', {composed: true, detail: {event_id}});
import {
    LitElement,
    html,
    css
} from 'lit-element';
import {SharedStyles} from '../shared-styles';
import '@polymer/paper-checkbox';

class eventRow extends LitElement {
    static get styles() {
        return [
            SharedStyles,
            css `
                :host {
                    display: contents
                }

                paper-button {
                    border-color: var(--app-secondary-color, blue);
                }

                :host([selected]) paper-button {
                    background-color: var(--app-primary-color, blue);
                    color: var(--app-light-text-color, white);
                }

                td {
                    text-align: center;
                }

                td.event-title {
                    text-align: left;
                }
            `
        ];
    }

    static get properties() {
        return {
            event: {
                type: Object
            },
            selected: {
                type: Boolean
            }
        };
    }

    render() {
        return html `
            <tr>
                <td class="event-title">${this.event.category} ${this.event.name}</td>
                <td>
                    <paper-button raised @click=${this._handle_event_toggle}>${this.selected ? 'Deselect' : 'Select'}</paper-button>
                </td>
            </tr>
        `;
    }

    _handle_event_toggle(e){
        this.dispatchEvent(ToggleEventInEvents(this.event.id));
        this.update();
    }
}

export default eventRow;

window.customElements.define('event-row', eventRow);