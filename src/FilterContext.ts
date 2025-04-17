import { createContext } from "@lit/context";
import { FilterItem } from "./items/FilterItem";

export class FilterContext extends EventTarget {
    protected items = new Map<string, FilterItem<any>>();
    protected values = new Map<string, any>();

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

    get(name: string) {
        return this.values.get(name);
    }

    /**
     * Register a filter item.
     *
     * This gets called automatically for FilterItem elements when they are descendants
     * of the Filter element. Otherwise, you can call this manually to register a filter item.
     *
     * @param item
     */
    register(item: FilterItem<any>) {
        console.log("register", item, item.name);
        if (this.items.has(item.name)) {
            console.warn(
                `ilw-filter: Item with name ${item.name} already registered, overwriting.`,
            );
        }
        this.items.set(item.name, item);
        if (item.value !== undefined && this.values.get(item.name) === undefined) {
            this.values.set(item.name, item.value);
        }
        this.dispatchItemUpdate();
    }

    /**
     * Unregister a filter item.
     *
     * @param item
     */
    unregister(item: FilterItem<any>) {
        this.items.delete(item.name);
        this.values.delete(item.name);
        this.dispatchItemUpdate();
    }

    /**
     * Update the value of a single filter item.
     *
     * @param name
     * @param value
     */
    itemUpdated(name: string, value: any) {
        console.log("itemUpdated", name, value);
        this.values.set(name, value);
        this.dispatchItemUpdate();
    }

    /**
     * Update all the filter values, replacing any existing values and removing
     * values that don't exist in the new filters.
     *
     * @param filters
     */
    valueUpdated(filters: Record<string, any>) {
        console.log("valueUpdated", filters);
        for (const [name, value] of Object.entries(filters)) {
            console.log("set", name, value);
            this.values.set(name, value);
            const item = this.items.get(name);
            console.log(item, value);
            if (item) {
                item.value = value;
            }
        }

        // Remove any values that don't exist in the new filters.
        for (const name of this.values.keys()) {
            if (!filters.hasOwnProperty(name)) {
                this.values.delete(name);
            }
        }
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
