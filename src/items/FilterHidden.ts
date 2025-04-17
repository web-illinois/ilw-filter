import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { FilterItem } from "./FilterItem";

@customElement("ilw-filter-hidden")
export default class FilterHidden extends FilterItem<string> {

    constructor() {
        super();
    }

    render() {
        return html`
            <input type="hidden" name=${this.name} value=${this.value} />
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "ilw-filter-hidden": FilterHidden;
    }
}
