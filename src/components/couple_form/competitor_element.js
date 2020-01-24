import {
    LitElement,
    html,
    css
} from 'lit-element';

import '@polymer/paper-button';

class competitorRow extends LitElement {
    static get styles() {
        return [
            css `
                :host {
                    display: contents
                }

                :host([couple_status='lead']) paper-button[name='lead'] {
                    background-color: var(--app-primary-color, blue);
                    color: var(--app-light-text-color, white)
                }
                :host([couple_status='follow']) paper-button[name='follow'] {
                    background-color: var(--app-secondary-color, blue);
                    color: var(--app-light-text-color, white)
                }

                td {
                    text-align: center
                }
            `
        ];
    }

    static get properties() {
        return {
            competitor: {
                type: Object,
                reflect: true
            },
            couple_status: {
                type: String,
                reflect: true
            }
        };
    }

    render() {
        return html `
            <tr>
                <td>${this.competitor.name}</td>
                <td>
                    <paper-button raised name="lead" @click=${this._handle_couple_change}>Lead</paper-button>
                    <paper-button raised name="follow" @click=${this._handle_couple_change}>Follow</paper-button>
                </td>
            </tr>
        `;
    }

    _handle_couple_change(e){
        if (e.target.attributes.name.value === 'lead' && !this.couple_status) {
            this.dispatchEvent(new Event('change-to-lead'));
        } else if (e.target.attributes.name.value === 'follow' && !this.couple_status) {
            this.dispatchEvent(new Event('change-to-follow'));
        } else {
            this.dispatchEvent(new Event('change-to-null'));
        }
    }
}

export default competitorRow;

window.customElements.define('competitor-row', competitorRow);