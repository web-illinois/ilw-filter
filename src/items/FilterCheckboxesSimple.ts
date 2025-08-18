import { html, unsafeCSS } from "lit";
// @ts-ignore
import styles from "./FilterCheckboxesSimple.styles.css?inline";
import { customElement, property, query, queryAll } from "lit/decorators.js";
import { FilterItem } from "./FilterItem";
import { allValuesParse } from "../util";

/**
 * A simple filter item that allows selecting multiple checkboxes.
 *
 * See {@link allValuesParse} for the format of the `allValues` property.
 */
@customElement("ilw-filter-checkboxessimple")
export default class FilterCheckboxesSimple extends FilterItem<string> {
    @property({
        reflect: true,
        useDefault: true,
    })
    value: string | undefined = undefined;

    @property({
        useDefault: true,
        converter: {
            fromAttribute: allValuesParse("ilw-filter-checkboxessimple"),
        },
    })
    allValues: (string | [string, string])[] | undefined = undefined;

    @queryAll("input")
    inputs!: NodeListOf<HTMLInputElement>;

    @query("details")
    details!: HTMLDetailsElement;

    static get styles() {
        return unsafeCSS(styles);
    }

    constructor() {
        super();
    }

    isCollapsed() {
        return !this.details || !this.details.hasAttribute("open");
    }

    collapse() {
        if (this.details) {
            this.details.removeAttribute("open");
        }
    }

    expand() {
        if (this.details) {
            this.details.setAttribute("open", "open");
        }
    }

    valueUpdateListener = () => {
        let arr: string[] = [];
        Array.from(this.inputs.values()).forEach((element) => {
            if (element.checked) {
                arr.push(element.value);
            }
        });
        this.setValue(arr.join("[-]"));
    };

    renderCheckbox(textitem: string | [string, string], i: number) {
        const value = typeof textitem === "string" ? textitem : textitem[0];
        const label = typeof textitem === "string" ? textitem : textitem[1];
        let isChecked = !!this.value?.includes(value);
        return html`
            <div class="checkbox">
                <input
                    type="checkbox"
                    id="${this.id + i}"
                    value="${value}"
                    @input=${this.valueUpdateListener}
                    .checked=${isChecked}
                />
                <label for="${this.id + i}">${label}</label>
            </div>
        `;
    }

    renderChevron() {
        return html`<svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
        >
            <path
                d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"
            />
        </svg>`;
    }

    readonly toggleListener = () => {
        this.context?.triggerLayoutUpdate();
    }

    firstUpdated() {
        const details = this.renderRoot.querySelector("details");
        details?.addEventListener("toggle", this.toggleListener);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        const details = this.renderRoot.querySelector("details");
        details?.removeEventListener("toggle", this.toggleListener);
    }


    render() {
        if (this.compact) {
            return html`
                <details>
                    <summary>
                        <span id="${this.id + '-legend'}">${this.label} </span>${this.renderChevron()}
                    </summary>
                    <div class="group" role="group" aria-labelledby="${this.id + '-legend'}">
                        ${this.allValues?.map((item, i) => {
                            return this.renderCheckbox(item, i);
                        })}
                    </div>
                </details>
            `;
        }

        return html`
            <div>
                <div class="legend">
                    <span id="${this.id + '-legend'}">${this.label} </span>${this.renderChevron()}
                </div>
                <div role="group" aria-labelledby="${this.id + '-legend'}">
                    ${this.allValues?.map((item, i) => {
                        return this.renderCheckbox(item, i);
                    })}
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "ilw-filter-checkboxessimple": FilterCheckboxesSimple;
    }
}
