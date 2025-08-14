import { expect, test, vi } from "vitest";
import { html } from "lit";
import "../src/ilw-filter";
import { renderFilter } from "./util";

const content = html` <ilw-filter
    data-testid="filter"
    filters='{"department":"Educational Psychology"}'
>
    <h2 slot="heading">Filter by</h2>
    <ilw-filter-search
        label="Dep"
        placeholder="Search for a department"
        name="department"
    >
    </ilw-filter-search>
    <ilw-filter-search
        label="Course"
        placeholder="Search for a course"
        name="course"
    >
    </ilw-filter-search>
    <ilw-filter-hidden
        name="hide"
        value="test"
        data-testid="hidden"
    ></ilw-filter-hidden>
</ilw-filter>`;

test("filters attribute is saved into context", async () => {
    const { filter } = await renderFilter(content);

    expect(filter.context.get("department")).toEqual("Educational Psychology");
});

test("filters attribute is updated with rendered element values", async () => {
    const { filter } = await renderFilter(content);

    expect(filter.getAttribute("filters")).toEqual(
        '{"department":"Educational Psychology","hide":"test"}',
    );
});

test("filters in context update when filters attribute is changed", async () => {
    const { filter } = await renderFilter(content);
    filter.setAttribute(
        "filters",
        '{"department":"Physics", "hide":"replaced"}',
    );
    await vi.runAllTimersAsync();

    expect(filter.context.get("department")).toEqual("Physics");
    expect(filter.context.get("hide")).toEqual("replaced");
});

test("filters are reset to empty when attribute is replaced with an empty object", async () => {
    const { filter } = await renderFilter(content);
    filter.setAttribute("filters", "{}");
    await vi.runAllTimersAsync();

    expect(filter.context.get("department")).toBeUndefined();
    expect(filter.context.get("hide")).toBeUndefined();
});
