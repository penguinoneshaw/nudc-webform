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
    LitElement,
    html,
    css
} from 'lit-element';
import {
    setPassiveTouchGestures
} from '@polymer/polymer/lib/utils/settings.js';
import {
    connect
} from 'pwa-helpers/connect-mixin.js';
import {
    installMediaQueryWatcher
} from 'pwa-helpers/media-query.js';
import {
    installOfflineWatcher
} from 'pwa-helpers/network.js';
import {
    installRouter
} from 'pwa-helpers/router.js';
import {
    updateMetadata
} from 'pwa-helpers/metadata.js';

// This element is connected to the Redux store.
import {
    store
} from '../store.js';

// These are the actions needed by this element.
import {
    navigate,
    updateOffline,
    updateDrawerState
} from '../actions/app.js';

// These are the elements needed by this element.
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-scroll-effects/effects/waterfall.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import {
    menuIcon
} from './my-icons.js';
import './snack-bar.js';
import { load_from_save } from '../actions/forms.js';



class MyApp extends connect(store)(LitElement) {
    static get properties() {
        return {
            appTitle: {
                type: String
            },
            _page: {
                type: String
            },
            _drawerOpened: {
                type: Boolean
            },
            _snackbarOpened: {
                type: Boolean
            },
            _offline: {
                type: Boolean
            }
        };
    }

    static get styles() {
        return [
            css `
        :host {
          display: block;

          --app-drawer-width: 256px;

          --app-primary-color: #004205;
          --app-secondary-color: #5c366a;
          --app-dark-text-color: var(--app-secondary-color);
          --app-light-text-color: white;
          --app-section-even-color: #f7f7f7;
          --app-section-odd-color: white;

          --app-header-background-color: white;
          --app-header-text-color: var(--app-dark-text-color);
          --app-header-selected-color: var(--app-primary-color);

          --app-drawer-background-color: var(--app-secondary-color);
          --app-drawer-text-color: var(--app-light-text-color);
          --app-drawer-selected-color: #78909C;
        }

        app-header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          text-align: center;
          background-color: var(--app-header-background-color);
          color: var(--app-header-text-color);
          border-bottom: 1px solid #eee;
        }


        app-drawer {
          z-index: 100
        }

        app-drawer * {
          z-index: 101
        }

        .toolbar-top {
          background-color: var(--app-header-background-color);
        }

        [main-title] {
          font-family: 'Palatino Linotype';
          font-variant-caps: small-caps;
          /* In the narrow layout, the toolbar is offset by the width of the
          drawer button, and the text looks not centered. Add a padding to
          match that button */
          padding-right: 44px;
        }

        .toolbar-list {
          display: none;
        }

        .toolbar-list > a {
          display: inline-block;
          color: var(--app-header-text-color);
          text-decoration: none;
          line-height: 30px;
          padding: 4px 24px;
        }

        .toolbar-list > a[selected] {
          color: var(--app-header-selected-color);
          border-bottom: 4px solid var(--app-header-selected-color);
        }

        .menu-btn {
          background: none;
          border: none;
          fill: var(--app-header-text-color);
          cursor: pointer;
          height: 44px;
          width: 44px;
        }

        .drawer-list {
          box-sizing: border-box;
          width: 100%;
          height: 100%;
          padding: 24px;
          background: var(--app-drawer-background-color);
          position: relative;
        }

        .drawer-list > a {
          display: block;
          text-decoration: none;
          color: var(--app-drawer-text-color);
          line-height: 40px;
          padding: 0 24px;
        }

        .drawer-list > a[selected] {
          color: var(--app-drawer-selected-color);
        }

        /* Workaround for IE11 displaying <main> as inline */
        main {
          display: block;
        }

        .main-content {
          padding-top: 64px;
          min-height: calc(100vh - 42px - 64px - 80px);
        }

        .page {
          display: none;
        }

        .page[active] {
          display: block;
        }

        footer {
          box-sizing: border-box;
          background: var(--app-drawer-background-color);
          color: var(--app-drawer-text-color);
          text-align: center;
          vertical-align: middle;

          min-height: 80px;
          display: flex;
          flex-direction: row;
          align-content: center;
          justify-content: center;
          align-items: center;
        }

        footer p {
          padding: 1ex 1em;
        }

        footer a {
          color: var(--app-drawer-text-color);
        }

        /* Wide layout: when the viewport width is bigger than 460px, layout
        changes to a wide layout */
        @media (min-width: 460px) {
          .toolbar-list {
            display: block;
          }

          .menu-btn {
            display: none;
          }

          .main-content {
            padding-top: 107px;
          }

          /* The drawer button isn't shown in the wide layout, so we don't
          need to offset the title */
          [main-title] {
            font-size: 30px;
            padding-right: 0px;
          }
        }


        @media print {
          app-header{
            position: absolute !important;
            transform: translate3d(0px, 0px, 0px) !important;
            margin-bottom: 2ex !import;
          }

          .toolbar-list, footer {
            display: none
          }

          .main-content {
            padding-top: 2ex;
          }
        }
      `
        ];
    }

    render() {
        // Anything that's related to rendering should be done in here.
        return html `
      <!-- Header -->
      <app-header condenses reveals effects="waterfall">
        <app-toolbar class="toolbar-top">
          <button class="menu-btn" title="Menu" @click="${this._menuButtonClicked}">${menuIcon}</button>
          <div main-title>${this.appTitle}</div>
        </app-toolbar>

        <!-- This gets hidden on a small screen-->
        <nav class="toolbar-list">
          <a ?selected="${this._page === 'home'}" href="/home">Home</a>
          <a ?selected="${this._page === 'basic-information'}" href="/basic-information">Basic Information</a>
          <a ?selected="${this._page === 'competitors'}" href="/competitors">Competitors</a>
          <a ?selected="${this._page === 'couples'}" href="/couples">Couples</a>
          <a ?selected="${this._page === 'summary-and-save'}" href="/summary-and-save">Summary and Save</a>
        </nav>
      </app-header>

      <!-- Drawer content -->
      <app-drawer
          .opened="${this._drawerOpened}"
          @opened-changed="${this._drawerOpenedChanged}">
        <nav class="drawer-list">
          <a ?selected="${this._page === 'home'}" href="/home">Home</a>
          <a ?selected="${this._page === 'basic-information'}" href="/basic-information">Basic Information</a>
          <a ?selected="${this._page === 'competitors'}" href="/competitors">Competitors</a>
          <a ?selected="${this._page === 'couples'}" href="/couples">Couples</a>
          <a ?selected="${this._page === 'summary-and-save'}" href="/summary-and-save">Summary and Save</a>
        </nav>
      </app-drawer>

      <!-- Main content -->
      <main role="main" class="main-content">
        <my-home class="page" ?active="${this._page === 'home'}"></my-home>
        <basic-information-form class="page" ?active="${this._page === 'basic-information'}"></basic-information-form>
        <competitors-form class="page" ?active="${this._page === 'competitors'}"></competitors-form>
        <couples-form class="page" ?active="${this._page === 'couples'}"></couples-form>
        <summary-and-save class="page" id="summary" ?active="${this._page === 'summary-and-save'}"></summary-and-save>
      </main>

      <footer>
        <p>Made with &hearts; by Edinburgh University Ballroom Dancing Society, using the <a href="https://pwa-starter-kit.polymer-project.org">PWA Starter Kit</a> from the Google Polymer team.</p>
      </footer>

      <snack-bar ?active="${this._snackbarOpened}">
        You are now ${this._offline ? 'offline' : 'online'}.
      </snack-bar>
    `;
    }

    constructor() {
        super();
        // To force all event listeners for gestures to be passive.
        // See https://www.polymer-project.org/3.0/docs/devguide/settings#setting-passive-touch-gestures
        setPassiveTouchGestures(true);
    }

    firstUpdated() {
        installRouter((location) => store.dispatch(navigate(decodeURIComponent(location.pathname))));
        installOfflineWatcher((offline) => store.dispatch(updateOffline(offline)));
        installMediaQueryWatcher('(min-width: 460px)',
            () => store.dispatch(updateDrawerState(false)));
        store.dispatch(load_from_save());
    }

    updated(changedProps) {
        if (changedProps.has('_page')) {
            const pageTitle = this.appTitle + ' - ' + this._page;
            updateMetadata({
                title: pageTitle,
                description: pageTitle
                // This object also takes an image property, that points to an img src.
            });
        }
    }

    _menuButtonClicked() {
        store.dispatch(updateDrawerState(true));
    }

    _drawerOpenedChanged(e) {
        store.dispatch(updateDrawerState(e.target.opened));
    }

    stateChanged(state) {
        this._page = state.app.page;
        this._offline = state.app.offline;
        this._snackbarOpened = state.app.snackbarOpened;
        this._drawerOpened = state.app.drawerOpened;
    }
}

window.customElements.define('my-app', MyApp);