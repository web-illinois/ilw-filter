import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { consume } from "@lit/context";
import { FilterContext, filterContext } from "../FilterContext";

export abstract class FilterItem<
    T extends string | string[] | Record<string, string>,
> extends LitElement {
    @property()
    name = "";

    @property()
    label = "";

    @property()
    value: T | undefined = undefined;

    @consume({context: filterContext})
    public context?: FilterContext;

    protected constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this.context!.register(this);
        let value = this.context!.get(this.name)
        console.log("context", this.context);
        console.log("connected", this.name, value);
        if (value !== undefined) {
            this.value = value;
        }
    }

    disconnectedCallback() {
        this.context!.unregister(this);
        super.disconnectedCallback();
    }
}
