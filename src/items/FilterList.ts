import { html, unsafeCSS } from "lit";
// @ts-ignore
import styles from "./FilterSearch.styles.css?inline";
import { customElement, property, queryAll } from "lit/decorators.js";
import { FilterItem } from "./FilterItem";

@customElement("ilw-filter-list")
export default class FilterList extends FilterItem<string[]> {
    @property({
        reflect: true,
        useDefault: true,
        converter: {
            fromAttribute: (value: string): string[] => {
                if (!value) {
                    return [];
                }
                return value.split(" ");
            },
            toAttribute(value: string[]): string {
                if (!value) {
                    return "";
                }
                return value.join(" ");
            },
        },
    })
    value: string[] | undefined = undefined;

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
        this.setValue(arr);
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
                    value=${this.value?.[0]}
                />
                <input
                    id=${this.id + "2"}
                    type="text"
                    placeholder=${this.placeholder}
                    name=${this.name + "2"}
                    @input=${this.valueUpdateListener}
                    value=${this.value?.[1]}
                />
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "ilw-filter-list": FilterList;
    }
}
