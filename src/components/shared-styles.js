/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { css } from 'lit-element';

export const SharedStyles = css`
  :host {
    display: block;
    box-sizing: border-box;
  }

  section {
    padding: 24px;
    background: var(--app-section-odd-color);
  }

  section > * {
    max-width: 600px;
    margin-right: auto;
    margin-left: auto;
  }
  
  .wider > * {
    max-width: calc(100vw - 200px);
  }

  section:nth-of-type(even) {
    background: var(--app-section-even-color);
  }

  section:nth-of-type(1) {
    position: relative;
    background: none;
  }

  section:nth-of-type(1)::after {
    content: " ";
    background: url('images/logo.svg') no-repeat center;
    background-size: 40%;
    background-position-y: top;
    opacity: 0.2;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    position: absolute;
    z-index: -1;   
  }

  section.hideable:not([active]) {
    display: none
  }

  paper-button.add {
    background: var(--app-primary-color);
    color: white;
  }

  paper-button.delete {
    background: var(--app-secondary-color);
    color: white;
  }

  h2 {
    font-size: 24px;
    text-align: center;
    color: var(--app-dark-text-color);
  }

  h3 {
    font-size: 20px;
    text-align: center;
    color: var(--app-dark-text-color);
  }

  @media (min-width: 460px) {
    h2 {
      font-size: 36px;
    }

    h3 {
      font-size: 24px;
    }
  }

  @media print {
    section {
      page-break-before: always;
      min-height: 100%;
    }

    paper-button {
      display: none;
      visibility: hidden;
      
    }
  }

  .circle {
    display: block;
    width: 64px;
    height: 64px;
    margin: 0 auto;
    text-align: center;
    border-radius: 50%;
    background: var(--app-primary-color);
    color: var(--app-light-text-color);
    font-size: 30px;
    line-height: 64px;
  }

  table {
    width: 100%;
    border-spacing: 0;
    border-collapse: collapse;
    border-top: var(--app-primary-color) 3px solid;
    border-bottom: var(--app-primary-color) 3px solid;
    padding: 2px;
    background-color: white;
  }

  tr:not(:last-child), thead {
    border-bottom: var(--app-primary-color) 1px solid;
  }

  td {
    padding: 5px;
  }

`;
