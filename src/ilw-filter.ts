import { LitElement, html, unsafeCSS } from "lit";
// @ts-ignore
import styles from './ilw-filter.styles.css?inline';
import './ilw-filter.css';
import { customElement, property } from "lit/decorators.js";

@customElement("ilw-filter")
export default class Filter extends LitElement {

    @property()
    theme = "";

    static get styles() {
        return unsafeCSS(styles);
    }

    constructor() {
        super();
    }

    render() {
        return html`
            <div>
                <slot></slot>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "ilw-filter": Filter;
    }
}
