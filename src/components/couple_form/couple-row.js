import {
    LitElement,
    html,
    css
} from 'lit-element';
import {
    SharedStyles
} from '../shared-styles';
import '@polymer/paper-button';
import '@polymer/iron-icons';

const RemoveCoupleFromEvent = (couple, event) => new CustomEvent('removeEventCouple', {composed: true, detail: {couple, event}, bubbles:false, cancelable: true});
class coupleRow extends LitElement {
    static get styles() {
        return [
            SharedStyles,
            css `
                :host {
                    display: contents
                }

                td {
                    text-align: center;
                }

                td.competitor_name {
                    text-align: left;
                }
                
                paper-button {
                    height: 1em;
                }
            `
        ];
    }

    static get properties() {
        return {
            couple: {
                type: Number
            },
            lead: {
                type: Object
            },
            follow: {
                type: Object
            },
            events: {
                type: Array
            },
            editable: {
                type: Boolean
            }
        };
    }

    render() {
        return html `
        ${this.events.map((ev, index) => {
        return html`<tr>
                ${ index == 0 ? html`
                <td rowspan=${this.events.length} class="couple-name">${this.lead.name}</td>
                <td rowspan=${this.events.length} class="couple-name">${this.follow.name}</td>` : html``}
                <td>${ev.category} ${ev.name} </td> ${this.editable ? html`<td><paper-button class="delete" @click=${e => {
                    e.preventDefault();
                    this.dispatchEvent(RemoveCoupleFromEvent(this.couple, ev.id));
                }}><iron-icon icon="delete"></iron-icon></paper-button> </td>` : ''}</tr>`;
        })}`;
    }
}

export default coupleRow;

window.customElements.define('couple-row', coupleRow);