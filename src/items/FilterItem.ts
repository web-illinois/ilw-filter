import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { consume } from "@lit/context";
import { FilterContext, filterContext } from "../FilterContext";

/**
 * Base class for all filter items.
 *
 * This has all the common properties as well as logic for wiring up to
 * the FilterContext.
 */
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

    /**
     * The context that this filter item is connected to.
     *
     * It's separate from the context property for cases where
     * the provide/consume pattern isn't used, such as when this is outside
     * the ilw-filter element.
     * @private
     */
    private appliedContext: FilterContext | undefined = undefined;

    /**
     * An ID for the filter item to use with the label element.
     *
     * Note that this isn't necessarily unique across the whole document,
     * but that's okay since it's in the shadow DOM.
     */
    get id() {
        return `filter-${this.name}`;
    }

    protected constructor() {
        super();
    }

    setValue(value: T) {
        this.value = value;
        if (this.appliedContext) {
            this.appliedContext.itemUpdated(this.name, value);
        } else {
            console.warn(
                "FilterItem: No context connected, cannot update value.",
                this.name,
            );
        }
    }

    connect(context: FilterContext) {
        this.appliedContext = context;
        context.register(this);
        let value = context.get(this.name)
        context.debug("FilterItem connected", this.tagName, "-", this.name, ":", value);
        if (value !== undefined) {
            this.value = value;
        }
    }

    disconnect(context: FilterContext) {
        context.unregister(this);
        this.appliedContext = undefined;
    }

    connectedCallback() {
        super.connectedCallback();
        const context = this.context;
        if (context) {
            this.connect(context);
        }
    }

    disconnectedCallback() {
        const context = this.context;
        if (context) {
            this.disconnect(context);
        }
        super.disconnectedCallback();
    }
}
