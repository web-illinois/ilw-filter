import { html, unsafeCSS } from "lit";
// @ts-ignore
import styles from "./FilterSearch.styles.css?inline";
import { customElement, property } from "lit/decorators.js";
import {ifDefined} from 'lit/directives/if-defined.js';
import { FilterItem } from "./FilterItem";

@customElement("ilw-filter-dropdownsimple")
export default class FilterDropdownSimple extends FilterItem<string> {
    @property()
    placeholder = "";

    @property({ reflect: true, useDefault: true })
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
                <select
                    id=${this.id}
                    name=${this.name}
                    @input=${this.valueUpdateListener}
                    value=${ifDefined(this.value)}>
                    <option value="">${this.placeholder}</option>
                    ${this.allValues?.map(item => {
                        return html`<option value="${item}">${item}</option>`;
                    })}
                </select>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "ilw-filter-dropdownsimple": FilterDropdownSimple;
    }
}
