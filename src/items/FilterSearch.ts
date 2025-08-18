import { html, unsafeCSS } from "lit";
// @ts-ignore
import styles from "./FilterSearch.styles.css?inline";
import { customElement, property } from "lit/decorators.js";
import { FilterItem } from "./FilterItem";

@customElement("ilw-filter-search")
export default class FilterSearch extends FilterItem<string> {
    @property()
    placeholder = "";

    @property()
    hideLabel = false;

    @property({ reflect: true, useDefault: true })
    value: string | undefined = undefined;

    static get styles() {
        return unsafeCSS(styles);
    }

    constructor() {
        super();
    }

    protected inputListener = (event: InputEvent) => {
        const target = event.target as HTMLInputElement;
        this.setValue(target.value, false);
    }

    protected keydownListener = (event: KeyboardEvent) => {
        if (event.key == 'Enter') {
            this.submit();
        }
    };

    render() {
        return html`
            <div>
                <label class="${this.hideLabel ? 'hidden' : ''}" for=${this.id}>${this.label}</label>
                <input
                    id=${this.id}
                    type="search"
                    placeholder=${this.placeholder}
                    name=${this.name}
                    value=${this.value ?? ''}
                    @input=${this.inputListener}
                    @keydown=${this.keydownListener}
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
