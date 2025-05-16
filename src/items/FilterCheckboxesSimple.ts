import { html, unsafeCSS } from "lit";
// @ts-ignore
import styles from "./FilterCheckboxesSimple.styles.css?inline";
import { customElement, property, queryAll } from "lit/decorators.js";
import { FilterItem } from "./FilterItem";

@customElement("ilw-filter-checkboxessimple")
export default class FilterCheckboxesSimple extends FilterItem<string> {
    @property({
        reflect: true,
        useDefault: true,
        converter: {
            fromAttribute: (value: string): string => {
                if (!value) {
                    return "";
                }
                return value;
            },
            toAttribute(value): string {
                if (!value) {
                    return "";
                }
                return value.toString();
            },
        },
    })
    value: string | undefined = undefined;

    @property({
        useDefault: true,
        converter: {
            fromAttribute: (value: string): string[] => {
                if (!value) {
                    return [];
                }
                try {
                    return value.split("[-]");
                } catch (e) {
                    console.warn(
                        `ilw-filter-checkboxes: Failed to parse value ${value}, using empty object.`,
                        e,
                    );
                    return [];
                }
            },
            toAttribute(value): string {
                if (!value) {
                    return "";
                }
                return JSON.stringify(value);
            },
        },
    })
    allValues: string[] | undefined = undefined;

    @queryAll("input")
    inputs!: NodeListOf<HTMLInputElement>;

    static get styles() {
        return unsafeCSS(styles);
    }

    constructor() {
        super();
    }

    collapse() {
        let detail = this.shadowRoot?.querySelector('details');
        if (detail) {
            detail.removeAttribute("open");
        }
    }

    expand() {
        let detail = this.shadowRoot?.querySelector('details');
        if (detail) {
            detail.setAttribute("open", "open");
        }
    }

    valueUpdateListener = () => {
        let arr: string[] = [];
        Array.from(this.inputs.values()).forEach(element => {
            if (element.checked) {
                arr.push(element.value);
            }
        });
        this.setValue(arr.join("[-]"));
   };

    renderCheckbox(textitem: string, i: number) {
        let isChecked = this.value?.includes(textitem);
        return html`
            <div class="checkbox">
            <input
                type="checkbox"
                id="${this.id + i}"
                value="${textitem}"
                @input=${this.valueUpdateListener}
                ?checked=${isChecked}
            />
            <label for="${this.id + i}">${textitem}</label>
            </div>
        `;
    }

    renderChevron() {
      return html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
      <path
      d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z" />
      </svg>`;
    }

    render() {
        if (this.compact) {
            return html`
                <details>
                    <summary><span>${this.label} </span>${this.renderChevron()}</summary>
                    <fieldset>
                        <legend>${this.label}</legend>
                        ${this.allValues?.map((item, i) => {
                            return this.renderCheckbox(item, i);
                        })}
                    </fieldset>
                </details>
            `;
        }
        
        return html`
            <div>
                <fieldset>
                <legend>${this.label}</legend>
                <div>
                    ${this.allValues?.map((item, i) => {
                        return this.renderCheckbox(item, i);
                    })}
                </div>
                </fieldset>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "ilw-filter-checkboxessimple": FilterCheckboxesSimple;
    }
}
