import { expect, test, vi } from "vitest";
import { html } from "lit";
import "../src/ilw-filter";
import { renderFilter } from "./util";
import { userEvent } from '@vitest/browser/context'

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
</ilw-filter>`;

test("filters change should dispatch filters event on ilw-filter", async (page) => {
    const { filter, screen } = await renderFilter(content);

    let filtersValue = "";
    const callback = vi.fn((e: Event) => {
        console.log(e);
        if (e instanceof CustomEvent) {
            filtersValue = e.detail;
        }
    });
    filter.addEventListener("filters", callback);

    await screen.getByLabelText("Dep").fill("Special Education");
    await userEvent.keyboard("{Enter}");
    await vi.runAllTimersAsync();

    expect(callback).toHaveBeenCalled();
    expect(filtersValue).toEqual({department: "Special Education"});
});
