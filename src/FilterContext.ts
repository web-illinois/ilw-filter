import { createContext } from "@lit/context";
import { FilterItem } from "./items/FilterItem";

/**
 * Holds the filter items and values for an ilw-filter element.
 *
 * Lit's context API is used to automatically register the filter items
 * that are descendants of the ilw-filter element.
 *
 * This is an event target for dispatching events to the ilw-filter element.
 */
export class FilterContext extends EventTarget {
    protected items = new Map<string, FilterItem<any>>();
    protected values = new Map<string, any>();

    protected debugLog = false;

    constructor() {
        super();
        // @ts-ignore
        if (import.meta.env.MODE === "development") {
            this.debugLog = true;
        }
    }
    
    debug(...args: any[]) {
        if (this.debugLog) {
            console.log("ilw-filter", ...args);
        }
    }

    /**
     * Gets all filter values, excluding undefined.
     */
    getValues() {
        return Object.fromEntries(
            Array.from(this.values.entries()).filter(
                ([, value]) => value !== undefined,
            ),
        );
    }

    /**
     * Get the value of an individual filter by name.
     */
    get(name: string) {
        return this.values.get(name);
    }

    /**
     * Register a filter item.
     *
     * This gets called automatically for FilterItem elements when they are descendants
     * of the Filter element. Otherwise, you can call this manually to register a filter item.
     */
    register(item: FilterItem<any>) {
        if (this.items.has(item.name)) {
            console.warn(
                `ilw-filter: Item with name ${item.name} already registered, ignoring.`,
            );
            return;
        }
        this.items.set(item.name, item);
        if (item.value !== undefined && this.values.get(item.name) === undefined) {
            this.values.set(item.name, item.value);
        }
        this.dispatchItemUpdate();
    }

    /**
     * Unregister a filter item.
     */
    unregister(item: FilterItem<any>) {
        this.items.delete(item.name);
        this.values.delete(item.name);
        this.dispatchItemUpdate();
    }

    /**
     * Update the value of a single filter item.
     */
    itemUpdated(name: string, value: any, autosubmit: boolean) {
        // Only update the value if it has changed, so we don't dispatch
        // events unnecessarily.
        if (this.values.get(name) !== value) {
            this.debug("FilterContext itemUpdated", name, value);
            this.values.set(name, value);
            this.dispatchItemUpdate();
            if (autosubmit) {
                this.debug("FilterContext autosubmit", name, value);
                this.dispatchAutosubmit();
            }
        }
    }

    /**
     * Update all the filter values, replacing any existing values and removing
     * values that don't exist in the new filters.
     *
     * @param filters An object of filter values
     */
    valueUpdated(filters: Record<string, any>) {
        this.debug("FilterContext valueUpdated", filters);
        for (const [name, value] of Object.entries(filters)) {
            this.values.set(name, value);
            const item = this.items.get(name);
            if (item) {
                item.setValue(value);
            }
        }

        const params = new URLSearchParams(window.location.search);
        // Remove any values that don't exist in the new filters.
        for (const name of this.values.keys()) {
            if (!filters.hasOwnProperty(name)) {
                this.values.delete(name);
                const item = this.items.get(name);
                if (item) {
                    item.value = undefined;
                    if (item.query) {
                        // Remove the query parameter from the URL.
                        params.delete(name);
                    }
                }
            }
        }
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState({}, "", newUrl);
    }

    readonly submit = debounce(()=> {
        this.debug("FilterContext submit", this.getValues());
        this.dispatchEvent(
            new CustomEvent("submit", {
                detail: {
                    values: this.getValues(),
                },
            }),
        );
    }, 100);

    public readonly triggerLayoutUpdate = () => {
        this.dispatchEvent(new CustomEvent("layout-update"));
    }

    protected dispatchItemUpdate = debounce(() => {
        // This can get called a lot in some scenarios, so debounce it.
        this.dispatchEvent(
            new CustomEvent("item-update", {
                detail: {
                    values: Object.fromEntries(this.values),
                },
            }),
        );
    }, 10);

    protected dispatchAutosubmit = debounce(() => {
        this.dispatchEvent(
            new CustomEvent("autosubmit", {
                detail: {
                    values: this.getValues(),
                },
            }),
        );
    }, 100);
}

export const filterContext = createContext<FilterContext>(Symbol("ilw-filter"));

export function debounce(func: (...args: any[]) => any, wait: number) {
    let timeout: any = null;
    return function (...args: any[]) {
        const trigger = () => {
            timeout = null;
            func(args);
        };
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(trigger, wait);
    };
}
