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
    html, css
} from 'lit-element';
import {
    PageViewElement
} from './page-view-element.js';
import './events-list';

import {store} from '../store';

import '@polymer/paper-button';

// These are the shared styles needed by this element.
import {
    SharedStyles
} from './shared-styles.js';
import { save_form, import_form_from_file } from '../actions/forms.js';
import { connect } from 'pwa-helpers/connect-mixin';

class MyHome extends connect(store)(PageViewElement) {
    static get styles() {
        return [
            SharedStyles
        ];
    }

    constructor() {
        super();
        this.addEventListener('drop', (evt) => {
            evt.preventDefault();
            store.dispatch(import_form_from_file(evt.dataTransfer.files[0]));
        });
        this.addEventListener('dragover', (evt) => {
            evt.preventDefault();
        });
    }

    static get properties() {
        return {
            _saved: {
                type: Boolean
            }
        };
    }

    render() {
        return html `
      <section>
        <h2>Entry Form</h2>
        <p>This is the Team Captains' entry form for NUDC 2019.</p>
        <p>It will generate the required spreadsheets for you, along with calculating your entry fees (which will be manually checked and invoiced before the competition).</p>
        <p>There is no information sent to the server, everything is processed locally.</p>
        <p>You can navigate around the form using the tabs at the top of the page, all information will be carried across.</p>
        <p>You can save the form by using the button at the top of each page. It will save for the current web browser in use on this computer (it uses indexeddb internally!).</p>
        <p>If you have problems, please don't hesitate to contact webmaster@eubds.co.uk for assistance, though you should make sure that the browser you are using is up to date first.</p>
        </section>
      <section>
        <events-list></events-list>
      </section>
    `;
    }
}

window.customElements.define('my-home', MyHome);