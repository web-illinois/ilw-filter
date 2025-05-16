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

    render() {
        return html`
            <div class="parent">
                <form id="ilw-filter-form" role="search" aria-labelledby="ilw-search-heading">
                    <div id="ilw-search-heading">
                        <slot name="heading"></slot>
                    </div>
                    <slot></slot>
                </form>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "ilw-filter": Filter;
    }
}
