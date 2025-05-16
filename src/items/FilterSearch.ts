import { html, unsafeCSS } from "lit";
// @ts-ignore
import styles from "./FilterSearch.styles.css?inline";
import { customElement, property } from "lit/decorators.js";
import { FilterItem } from "./FilterItem";

@customElement("ilw-filter-search")
export default class FilterSearch extends FilterItem<string> {
    @property()
    placeholder = "";

    @property({ reflect: true, useDefault: true })
    value: string | undefined = undefined;

    static get styles() {
        return unsafeCSS(styles);
    }

    constructor() {
        super();
    }

    valueUpdateListener = (event: Event) => {
        const target = event.target as HTMLInputElement;
        this.setValue(target.value);
    };

    render() {
        return html`
            <div>
                <label for=${this.id}>${this.label}</label>
                <input
                    id=${this.id}
                    type="search"
                    placeholder=${this.placeholder}
                    name=${this.name}
                    @input=${this.valueUpdateListener}
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
