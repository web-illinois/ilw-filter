import { expect, test, vi } from "vitest";
import { html } from "lit";
import "../src/ilw-filter";
import { renderFilter } from "./util";
import { userEvent } from "@vitest/browser/context";

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

test("filters in context update when text input changes", async () => {
    const { filter, screen } = await renderFilter(content);

    await screen.getByLabelText("Dep").fill("Special Education");
    await userEvent.keyboard("{Enter}");
    await vi.runAllTimersAsync();

    expect(filter.context.get("department")).toEqual("Special Education");
});

test("filters attribute updates when text input changes", async () => {
    const { filter, screen } = await renderFilter(content);

    await screen.getByLabelText("Dep").fill("Special Education");
    await userEvent.keyboard("{Enter}");
    await vi.runAllTimersAsync();

    expect(filter.getAttribute("filters")).toEqual(
        '{"department":"Special Education"}',
    );
});

test("filters in context update when text input changes multiple times", async () => {
    const { filter, screen } = await renderFilter(content);

    await screen.getByLabelText("Dep").fill("Speci");
    await userEvent.keyboard("{Enter}");
    await vi.runAllTimersAsync();
    expect(filter.context.get("department")).toEqual("Speci");
    await screen.getByLabelText("Dep").fill("Special Edu");
    await screen.getByLabelText("Dep").fill("Special Education");
    await userEvent.keyboard("{Enter}");
    await vi.runAllTimersAsync();
    expect(filter.context.get("department")).toEqual("Special Education");
});

test("filters attribute updates when text input changes multiple times", async () => {
    const { filter, screen } = await renderFilter(content);

    await screen.getByLabelText("Dep").fill("Speci");
    await userEvent.keyboard("{Enter}");
    await screen.getByLabelText("Dep").fill("Special Edu");
    await userEvent.keyboard("{Enter}");
    await screen.getByLabelText("Dep").fill("Special Education");
    await userEvent.keyboard("{Enter}");
    await vi.runAllTimersAsync();

    expect(filter.getAttribute("filters")).toEqual(
        '{"department":"Special Education"}',
    );
});

test("input value updates when filters attribute changes", async () => {
    const { filter, screen } = await renderFilter(content);

    filter.setAttribute("filters", '{"department":"Physics"}');
    const dep = screen.getByLabelText("Dep").element() as HTMLInputElement;
    await userEvent.keyboard("{Enter}");
    await vi.runAllTimersAsync();

    expect(dep.value).toEqual("Physics");
});


test("all filters update when multiple inputs change", async () => {
    const { filter, screen } = await renderFilter(content);

    await screen.getByLabelText("Dep").fill("Special Education");
    await userEvent.keyboard("{Enter}");
    await screen.getByLabelText("Course").fill("abc");
    await userEvent.keyboard("{Enter}");
    await vi.runAllTimersAsync();

    expect(filter.context.get("department")).toEqual("Special Education");
    expect(filter.context.get("course")).toEqual("abc");
});

test("filters attribute updates when multiple inputs change", async () => {
    const { filter, screen } = await renderFilter(content);

    await screen.getByLabelText("Dep").fill("Special Education");
    await userEvent.keyboard("{Enter}");
    await screen.getByLabelText("Course").fill("abc");
    await userEvent.keyboard("{Enter}");
    await vi.runAllTimersAsync();

    expect(filter.getAttribute("filters")).toEqual(
        '{"department":"Special Education","course":"abc"}',
    );
});