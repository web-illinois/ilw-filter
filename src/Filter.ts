import { LitElement, html, unsafeCSS, PropertyValues } from "lit";
// @ts-ignore
import styles from "./Filter.styles.css?inline";
import "./ilw-filter.css";
import { customElement, property } from "lit/decorators.js";
import { provide } from "@lit/context";
import { FilterContext, filterContext } from "./FilterContext";
import { FilterItem } from "./items/FilterItem";

@customElement("ilw-filter")
export default class Filter extends LitElement {
    @provide({ context: filterContext })
    context = new FilterContext();

    @property({ reflect: true })
    filters = "{}";

    @property({
        converter: {
            fromAttribute: (value: string) => {
                try {
                    return JSON.parse(value);
                } catch (err) {
                    console.error(
                        "Invalid JSON list for register given to ilw-filter",
                        err,
                    );
                    return [];
                }
            },
            toAttribute(value: string[]): string {
                return JSON.stringify(value);
            },
        },
    })
    register: string[] = [];

    @property({ type: Boolean })
    toggle = false;

    static get styles() {
        return unsafeCSS(styles);
    }

    constructor() {
        super();
    }

    protected itemUpdateListener = () => {
        const values = this.context.getValues();
        const jsonValue = JSON.stringify(values);
        if (this.filters !== jsonValue) {
            this.context.debug(
                "Filter itemUpdateListener",
                this.filters,
                jsonValue,
            );
            this.filters = jsonValue;
            this.dispatchEvent(
                new CustomEvent("filters", {
                    detail: values
                })
            );
        }
    };

    connectedCallback() {
        super.connectedCallback();
        this.context.addEventListener("item-update", this.itemUpdateListener);
        // If the filters value isn't the default value, update the context
        if (this.filters && this.filters !== "{}") {
            this.context.debug("Filter connected filters", this.filters);
            let filters: Record<string, any> | null = null;
            try {
                filters = JSON.parse(this.filters);
            } catch (e) {
                console.error(
                    "Invalid JSON given to ilw-filter when connected",
                    e,
                );
            }
            if (filters) {
                this.context.valueUpdated(filters);
            }
        }
    }

    disconnectedCallback() {
        this.context.removeEventListener(
            "item-update",
            this.itemUpdateListener,
        );
        super.disconnectedCallback();
    }

    protected updated(_changedProperties: PropertyValues) {
        super.updated(_changedProperties);
        if (
            _changedProperties.has("filters") &&
            _changedProperties.get("filters")
        ) {
            this.context.debug("Filter value updated", this.filters);
            let filters: Record<string, any> | null = null;
            try {
                filters = JSON.parse(this.filters);
            } catch (e) {
                console.error("Invalid JSON given to ilw-filter", e);
            }
            if (filters) {
                this.context.valueUpdated(filters);
            }
            const event = new CustomEvent('ilw-filter-update', {bubbles: true, composed: true, detail: {
                values: filters,
            }});
            this.dispatchEvent(event);
        }
        if (_changedProperties.has("register")) {
            this.context.debug("Filter register updated", this.register);
            for (const name of this.register) {
                const element = document.getElementById(name);
                if (element instanceof FilterItem) {
                    element.connect(this.context);
                } else {
                    this.context.debug(
                        "Filter register item not found",
                        name
                    );
                }
            }
        }
    }

    toggleListener = () => {
        let checked = <HTMLInputElement>this.shadowRoot?.querySelector('.slider input');
        this.querySelectorAll("ilw-filter-checkboxessimple").forEach((panel) => {
            checked.checked ? panel.expand() : panel.collapse();
        });
    };

    toggleResetAll() {
        window.location.href = window.location.origin + window.location.pathname;
    }

    renderToggle() {
        return html`<div class="slider">
                    <input type="checkbox" role="switch" @input=${this.toggleListener}><span>
                        <span class="container"></span>
                        <span aria-hidden="true" class="text-on">Collapse All</span>
                        <span aria-hidden="true" class="text-off">Expand All</span></span>
                </div>`
    }


    render() {
        return html`
            <div class="parent">
                <form id="ilw-filter-form" role="search" aria-labelledby="ilw-search-heading">
                    <div id="ilw-search-heading">
                        <slot name="heading"></slot>
                    </div>
                    ${this.toggle ? this.renderToggle() : ''}
                    <slot></slot>
                </form>
                <button @click=${this.toggleResetAll}>
                    Reset All
                </button>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "ilw-filter": Filter;
    }
}
