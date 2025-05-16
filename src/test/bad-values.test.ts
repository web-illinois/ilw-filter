import { expect, test } from "vitest";
import { render } from "vitest-browser-lit";
import { html } from "lit";
import "../ilw-filter";
import { renderFilter } from "./util";

const content = html`
    <ilw-filter
        data-testid="filter"
        filters='{"department"Educational Psychology"}'
    >
        <h2 slot="heading">Filter by</h2>
        <ilw-filter-search
            label="Dep"
            placeholder="Search for a department"
            name="department"
        >
    </ilw-filter>`;

test("bad filters input should still render component", async () => {
    const screen = render(content);
    const element = screen.getByRole("search");
    await expect.element(element).toBeInTheDocument();
    await expect.element(element).toHaveAccessibleName("Filter by");

    const element2 = screen.getByLabelText("Dep");
    await expect.element(element2).toBeInTheDocument();
});

test("bad filters input should turn into an empty filters value", async () => {
    const { filter } = await renderFilter(content);

    expect(filter.getAttribute("filters")).toEqual("{}");
});
