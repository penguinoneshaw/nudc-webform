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
  LitElement, html, css
} from 'lit-element';

// These are the shared styles needed by this element.
import {
  SharedStyles
} from './shared-styles.js';

class EventsList extends LitElement {
  static get styles() {
    return [
      SharedStyles,
      css`
        table {
          width: 100%;
          border-spacing: 0;
          border-collapse: collapse;
          border-top: var(--app-primary-color) 3px solid;
          border-bottom: var(--app-primary-color) 3px solid;
          padding: 2px;
        }

        tr:not(:last-child), thead {
          border-bottom: var(--app-primary-color) 1px solid;
        }

        td {
          padding: 5px;
        }

        tbody > tr[row-span]:nth-of-type(even) {
          background-color: var(--app-drawer-background-color);
          color: var(--app-drawer-text-color);
        }
      `
    ];
  }

  render() {
    return html `
    <h2>Events</h2>
    <h3>Individual Events</h3>
    <table>
    <thead><tr>
    <th style="width: 20%;">Eligibility</th>
                <th style="width: 20%;">Category</th>
                <th>Event</th>
            </tr></thead>
    <tbody>
    <tr>
    <td rowspan="12">Present Student<br><em>Defined in A.10 of NUDA Constitution</em>
    </td>
                <td rowspan="4">Beginners<br><em>Defined in A.12 of NUDA Constitution</em>
    </td>
                <td>1-dance Waltz</td>
            </tr>
    <tr>
    <td>1-dance Quickstep</td>
            </tr>
    <tr>
    <td>1-dance Cha-Cha</td>
            </tr>
    <tr>
    <td>1-dance Jive</td>
            </tr>
    <tr>
    <td rowspan="2">Novice</td>
                <td>2-dance Waltz &amp; Quickstep</td>
            </tr>
    <tr>
    <td>2-dance Cha-Cha &amp; Jive</td>
            </tr>
    <tr>
    <td rowspan="2">Intermediate</td>
                <td>3-dance Waltz, Tango &amp; Quickstep</td>
            </tr>
    <tr>
    <td>3-dance Cha-Cha, Rumba &amp; Jive</td>
            </tr>
    <tr>
    <td rowspan="2">Advanced</td>
                <td>3-dance Waltz, Tango &amp; Quickstep</td>
            </tr>
    <tr>
    <td>3-dance Cha-Cha, Rumba &amp; Jive</td>
            </tr>
    <tr>
    <td rowspan="2">Same-Sex</td>
                <td>2-dance Waltz &amp; Quickstep</td>
            </tr>
    <tr>
    <td>2-dance Cha-Cha &amp; Jive</td>
            </tr>
    <tr>
    <td rowspan="4">Ex-Student<br><em>Defined in A.11 of NUDA Constitution</em>
    </td>
                <td rowspan="2">Novice</td>
                <td>2-dance Waltz &amp; Quickstep</td>
            </tr>
    <tr>
    <td>2-dance Cha-Cha &amp; Jive</td>
            </tr>
    <tr>
    <td rowspan="2">Open</td>
                <td>2-dance Waltz &amp; Tango</td>
            </tr>
    <tr>
    <td>2-dance Cha-Cha &amp; Rumba</td>
            </tr>
    <tr>
    <td rowspan="5">Open</td>
                <td>Old-Time (Classical Sequence)</td>
                <td>1-dance Balmoral Blues</td>
            </tr>
    <tr>
    <td rowspan="2">Open Syllabus</td>
                <td>5-dance Ballroom</td>
            </tr>
    <tr>
    <td>5-dance Latin</td>
            </tr>
    <tr>
    <td rowspan="2">Rock 'n' Roll</td>
                <td>Non-Acrobatic Rock 'n' Roll</td>
            </tr>
    <tr>
    <td>Acrobatic Rock 'n' Roll</td>
            </tr>
    </tbody>
    </table>

    <h3>Team Events</h3>
    <table>
      <thead><tr>
      <th>Eligibility</th>
                  <th>Event</th>
              </tr></thead>
      <tbody>
      <tr>
      <td rowspan="2">Present Student</td>
                  <td>Team Match</td>
              </tr>
      <tr>
      <td>Team Knockout</td>
              </tr>
      <tr>
      <td>Open</td>
                  <td>Offbeat<br><em>Must be at least 50% Present Student</em>
      </td>
              </tr>
      </tbody>
      </table>
    `;
  }
}

window.customElements.define('events-list', EventsList);