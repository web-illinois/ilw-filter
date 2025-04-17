import { LitElement, html, unsafeCSS, PropertyValues } from "lit";
// @ts-ignore
import styles from './Filter.styles.css?inline';
import './ilw-filter.css';
import { customElement, property } from "lit/decorators.js";
import { provide } from "@lit/context";
import { FilterContext, filterContext } from "./FilterContext";

@customElement("ilw-filter")
export default class Filter extends LitElement {
    @provide({ context: filterContext })
    private context = new FilterContext();

    @property({ reflect: true, useDefault: true })
    filters = "{}";

    static get styles() {
        return unsafeCSS(styles);
    }

    constructor() {
        super();
    }

    protected itemUpdateListener = () => {
        const jsonValue = JSON.stringify(this.context.getValues());
        if (this.filters != jsonValue) {
            this.filters = jsonValue;
            this.dispatchEvent(
                new CustomEvent("filters", {
                    detail: this.filters,
                    composed: true,
                }),
            );
        }
    };

    connectedCallback() {
        this.context.addEventListener("item-update", this.itemUpdateListener);
        if (this.filters != "{}") {
            console.log("Connected filters", this.filters);
            this.context.valueUpdated(JSON.parse(this.filters));
        }
    }

    disconnectedCallback() {
        this.context.removeEventListener(
            "item-update",
            this.itemUpdateListener,
        );
    }

    protected updated(_changedProperties: PropertyValues) {
        super.updated(_changedProperties);
        if (_changedProperties.has("filters")) {
            console.log("filters", _changedProperties.get("filters"), this.filters);
            this.context.valueUpdated(JSON.parse(_changedProperties.get("filters")!));
        }
    }

    render() {
        return html`
            <form>
                <slot></slot>
            </form>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "ilw-filter": Filter;
    }
}
