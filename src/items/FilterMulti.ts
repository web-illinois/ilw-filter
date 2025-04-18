import { html, unsafeCSS } from "lit";
// @ts-ignore
import styles from "./FilterSearch.styles.css?inline";
import { customElement, property, queryAll } from "lit/decorators.js";
import { FilterItem } from "./FilterItem";

@customElement("ilw-filter-multi")
export default class FilterMulti extends FilterItem<Record<string, string>> {
    @property({
        reflect: true,
        useDefault: true,
        converter: {
            fromAttribute: (value: string): Record<string, string> => {
                if (!value) {
                    return {};
                }
                try {
                    return JSON.parse(value);
                } catch (e) {
                    console.warn(
                        `ilw-filter-multi: Failed to parse value ${value}, using empty object.`,
                        e,
                    );
                    return {};
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
    value: Record<string, string> | undefined = undefined;

    @property()
    placeholder = "";

    @queryAll("input")
    inputs!: NodeListOf<HTMLInputElement>;

    static get styles() {
        return unsafeCSS(styles);
    }

    constructor() {
        super();
    }

    valueUpdateListener = () => {
        let arr = Array.from(this.inputs.values()).map((it) => it.value);
        this.setValue({
            a: arr[0],
            b: arr[1],
        });
    };

    render() {
        return html`
            <div>
                <label for=${this.id}>${this.label}</label>
                <input
                    id=${this.id}
                    type="text"
                    placeholder=${this.placeholder}
                    name=${this.name}
                    @input=${this.valueUpdateListener}
                    value=${this.value?.a}
                />
                <input
                    id=${this.id + "2"}
                    type="text"
                    placeholder=${this.placeholder}
                    name=${this.name + "2"}
                    @input=${this.valueUpdateListener}
                    value=${this.value?.b}
                />
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "ilw-filter-multi": FilterMulti;
    }
}
