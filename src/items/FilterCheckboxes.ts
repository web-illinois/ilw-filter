import { html, unsafeCSS } from "lit";
// @ts-ignore
import styles from "./FilterSearch.styles.css?inline";
import { customElement, property, queryAll } from "lit/decorators.js";
import { FilterItem } from "./FilterItem";

@customElement("ilw-filter-checkboxes")
export default class FilterCheckboxes extends FilterItem<string[]> {
    @property({
        reflect: true,
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
    value: string[] | undefined = undefined;

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
                console.log('value ' + value);
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

    valueUpdateListener = () => {
        let arr: string[] = [];
        Array.from(this.inputs.values()).forEach(element => {
            if (element.checked) {
                arr.push(element.value);
            }
        });
        this.setValue(arr);
   };

    renderCheckbox(textitem: string, i: number) {
        let isChecked = this.value?.includes(textitem);
        return html`
            <label for="${this.id + i}">${textitem}</label>
            <input
                type="checkbox"
                id="${this.id + i}"
                value="${textitem}"
                @input=${this.valueUpdateListener}
                ?checked=${isChecked}
            />
        `;
    }

    render() {
        return html`
            <div>
                <span>${this.label}</span>
                <div>
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
        "ilw-filter-checkboxes": FilterCheckboxes;
    }
}
