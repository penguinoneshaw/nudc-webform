import {html, css, LitElement} from 'lit-element';
import { connect } from 'pwa-helpers/connect-mixin';
import { store } from '../store';
import { save_form } from '../actions/forms';
import { SharedStyles } from './shared-styles';
import '@polymer/paper-button';
export class SaveButton extends connect(store)(LitElement) {
    render() {
        return html`<paper-button ?disabled=${this._saved} ?active=${!this._saved} @click=${()=>store.dispatch(save_form())}>Save</paper-button>`;
    }

    static get styles() {
        return [
            SharedStyles,
            css`
            :host {
                display:block;
                margin: 1ex 0;
            }

            paper-button {
                display:block;
                background-color: #ccc;
                color: #eee;
            }
            paper-button[active] {
                background-color: var(--app-primary-color);
                color: white;
            }

            `
        ];
    }

    static get properties() {
        return {
            _saved: {
                type: Boolean
            }
        };
    }

    stateChanged(state) {
        this._saved = state.form.save_state.saved;
    }
    
}

window.customElements.define('save-button', SaveButton);