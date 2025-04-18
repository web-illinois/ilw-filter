import { LitElement } from "lit";
import { property } from "lit/decorators.js";
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

    /**
     * When true, the value of this filter will be synced with the URL.
     */
    @property({ type: Boolean })
    query = false;

    /**
     * Value property that should be implemented by subclasses.
     */
    abstract value: T | undefined;

    @consume({ context: filterContext })
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

            if (this.query) {
                // Update the browser URL with the new value by replacing
                // history. The timeout is needed to allow the value attribute
                // to be converted
                setTimeout(() => {
                    const params = new URLSearchParams(window.location.search);
                    const queryValue = this.getAttribute("value");
                    if (queryValue) {
                        params.set(this.name, queryValue);
                    } else {
                        params.delete(this.name);
                    }
                    const newUrl = `${window.location.pathname}?${params.toString()}`;
                    window.history.replaceState({}, "", newUrl);
                }, 1);
            }
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
        let value = context.get(this.name);
        context.debug(
            "FilterItem connected",
            this.tagName,
            "-",
            this.name,
            ":",
            value,
        );
        if (value || value === 0) {
            this.value = value;
        } else if (this.query) {
            const params = new URLSearchParams(window.location.search);
            const queryValue = params.get(this.name);
            if (queryValue) {
                this.setAttribute("value", queryValue);
                context.itemUpdated(this.name, this.value);
            }
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
