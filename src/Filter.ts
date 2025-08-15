import { html, LitElement, PropertyValues, unsafeCSS } from "lit";
// @ts-ignore
import styles from "./Filter.styles.css?inline";
import "./ilw-filter.css";
import { customElement, property, query, state } from "lit/decorators.js";
import { provide } from "@lit/context";
import { debounce, FilterContext, filterContext } from "./FilterContext";
import { FilterItem } from "./items/FilterItem";
import FilterCheckboxesSimple from "./items/FilterCheckboxesSimple";

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

    @query(".slider-button")
    toggleElement!: HTMLInputElement;

    @state()
    protected allExpanded = false;

    static get styles() {
        return unsafeCSS(styles);
    }

    constructor() {
        super();
    }

    protected itemUpdateListener = () => {
        this.dispatchValues("filters");
    };

    protected autosubmitListener = () => {
        this.dispatchValues("autosubmit");
    };

    protected submitListener = () => {
        this.dispatchValues("submit");
        this.dispatchValues("autosubmit");
    }

    protected dispatchValues(eventName: string) {
        const values = this.context.getValues();
        const jsonValue = JSON.stringify(values);
        if (this.filters !== jsonValue) {
            this.context.debug("Filter " + eventName, this.filters, jsonValue);
            this.filters = jsonValue;
        }
        this.dispatchEvent(
            new CustomEvent(eventName, {
                detail: {
                    values
                },
            }),
        );
    }

    protected layoutUpdateListener = debounce(() => {
        setTimeout(() => {
            const list = this.querySelectorAll<FilterCheckboxesSimple>(
                "ilw-filter-checkboxessimple",
            );
            const checkboxesExpanded = list?.length
                ? Array.from(list).map((checkbox) => {
                      return !checkbox.compact || !checkbox.isCollapsed();
                  })
                : [false];

            if (!this.allExpanded && checkboxesExpanded.every((it) => it)) {
                this.allExpanded = true;
            } else if (
                this.allExpanded &&
                checkboxesExpanded.every((it) => !it)
            ) {
                this.allExpanded = false;
            }
        });
    }, 50);

    connectedCallback() {
        super.connectedCallback();
        this.context.addEventListener("item-update", this.itemUpdateListener);
        this.context.addEventListener("autosubmit", this.autosubmitListener);
        this.context.addEventListener("submit", this.submitListener);
        this.context.addEventListener(
            "layout-update",
            this.layoutUpdateListener,
        );
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
        this.allExpanded = !!this.toggleElement?.checked;
    }

    disconnectedCallback() {
        this.context.removeEventListener(
            "item-update",
            this.itemUpdateListener,
        );
        this.context.removeEventListener("autosubmit", this.autosubmitListener);
        this.context.removeEventListener("submit", this.submitListener);
        this.context.addEventListener(
            "layout-update",
            this.layoutUpdateListener,
        );
        super.disconnectedCallback();
    }

    protected updated(_changedProperties: PropertyValues) {
        super.updated(_changedProperties);
        if (_changedProperties.has("register")) {
            this.context.debug("Filter register updated", this.register);
            for (const name of this.register) {
                const element = document.getElementById(name);
                if (element instanceof FilterItem) {
                    element.connect(this.context);
                } else {
                    this.context.debug("Filter register item not found", name);
                }
            }
        }
    }

    toggleListener = (ev: PointerEvent) => {
        const target = <HTMLElement>ev.target;
        const button = target.closest("button");
        const checked = button?.getAttribute("aria-expanded") !== "true";
        this.allExpanded = checked;
        this.querySelectorAll("ilw-filter-checkboxessimple").forEach(
            (panel) => {
                checked ? panel.expand() : panel.collapse();
            },
        );
    };

    toggleResetAll() {
        window.location.href =
            window.location.origin + window.location.pathname;
    }

    renderToggle() {
        return html`<div class="slider">
            <button
                type="button"
                class="slider-button ${this.allExpanded
                    ? "expanded"
                    : "collapsed"}"
                aria-expanded=${this.allExpanded ? "true" : "false"}
                @click=${this.toggleListener}
            >
                <span class="slider-box" aria-hidden="true">
                    <span class="slider-toggle"></span>
                </span>
                <span class="text">
                    ${this.allExpanded ? "Collapse All" : "Expand All"}
                </span>
            </button>
        </div>`;
    }

    render() {
        return html`
            <div class="parent">
                <form
                    id="ilw-filter-form"
                    role="search"
                    aria-labelledby="ilw-search-heading"
                >
                    <div id="ilw-search-heading">
                        <slot name="heading"></slot>
                    </div>
                    ${this.toggle ? this.renderToggle() : ""}
                    <div role="presentation" class="line"></div>
                    <slot></slot>
                </form>
                <button @click=${this.toggleResetAll}>Reset All</button>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "ilw-filter": Filter;
    }
}
