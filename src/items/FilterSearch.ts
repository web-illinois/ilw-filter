import { LitElement, html, unsafeCSS } from "lit";
// @ts-ignore
import styles from "./FilterSearch.styles.css?inline";
import { customElement, property } from "lit/decorators.js";
import { FilterItem } from "./FilterItem";

@customElement("ilw-filter-search")
export default class FilterSearch extends FilterItem<string> {
    @property()
    placeholder = "";

    static get styles() {
        return unsafeCSS(styles);
    }

    constructor() {
        super();
    }

    valueUpdateListener = (event: Event) => {
        const target = event.target as HTMLInputElement;
        this.value = target.value;
        this.context!.itemUpdated(this.name, this.value);
    };

    render() {
        return html`
            <div>
                <label for=${this.name}>${this.label}</label>
                <input
                    id=${this.name}
                    type="search"
                    placeholder="Search..."
                    name=${this.name}
                    @change=${this.valueUpdateListener}
                    value=${this.value}
                />
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "ilw-filter-search": FilterSearch;
    }
}
