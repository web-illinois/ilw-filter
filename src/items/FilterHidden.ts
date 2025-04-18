import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { FilterItem } from "./FilterItem";

@customElement("ilw-filter-hidden")
export default class FilterHidden extends FilterItem<string> {

    constructor() {
        super();
    }

    valueUpdateListener = (event: Event) => {
        const target = event.target as HTMLInputElement;
        this.setValue(target.value);
    };

    render() {
        return html`
            <input type="hidden" name=${this.name} value=${this.value}
                   @change=${this.valueUpdateListener} />
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "ilw-filter-hidden": FilterHidden;
    }
}
