import { html, unsafeCSS } from "lit";
// @ts-ignore
import styles from "./FilterDropdownSimple.styles.css?inline";
import { customElement, property } from "lit/decorators.js";
import {ifDefined} from 'lit/directives/if-defined.js';
import { FilterItem } from "./FilterItem";
import { allValuesParse } from "../util";

/**
 * A simple filter item that allows selecting a single value from a dropdown.
 *
 * See {@link allValuesParse} for the format of the `allValues` property.
 */
@customElement("ilw-filter-dropdownsimple")
export default class FilterDropdownSimple extends FilterItem<string> {
    @property()
    placeholder = "";

    @property()
    hideLabel = false;

    @property({ reflect: true, useDefault: true })
    value: string | undefined = undefined;

    @property({
        useDefault: true,
        converter: {
            fromAttribute: allValuesParse("ilw-filter-dropdownsimple"),
        },
    })
    allValues: (string | [string, string])[] | undefined = undefined;

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

    renderPlaceholder(textitem: string) {
        console.log("renderPlaceholder", textitem);
        if (textitem === undefined || textitem === "") 
            return html``;
        return html`<option value="">${textitem}</option>`;
    }

    render() {
        return html`
            <div class="dropdown">
                <label class="${this.hideLabel ? 'hidden' : ''}" for=${this.id}>${this.label}</label>
                <select
                    id=${this.id}
                    name=${this.name}
                    @input=${this.valueUpdateListener}
                    value=${ifDefined(this.value)}>
                    ${this.renderPlaceholder(this.placeholder)}
                    ${this.allValues?.map(item => {
                        const value = typeof item === 'string' ? item : item[0];
                        const label = typeof item === 'string' ? item : item[1];
                        return html`<option value="${value}">${label}</option>`;
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
