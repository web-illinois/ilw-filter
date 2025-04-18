import { expect, test } from "vitest";
import { render } from "vitest-browser-lit";
import { html } from "lit";
import "../ilw-filter";

const content = html`
    <ilw-filter>
        <h2 slot="heading">Filter by</h2>
        <p>some more text</p>
        <ilw-filter-search
            label="Dep"
            placeholder="Search for a department"
            name="department"
        >
        </ilw-filter-search>
    </ilw-filter>
`;

test("renders slotted heading", async () => {
    const screen = render(content);
    const element = screen.getByText("Filter by");
    await expect.element(element).toBeInTheDocument();
});

test("has search role", async () => {
    let screen = render(content);
    const element = screen.getByRole("search");
    await expect.element(element).toBeInTheDocument();
});

test("has slotted heading as accessible name", async () => {
    let screen = render(content);
    const element = screen.getByRole("search");
    await expect.element(element).toHaveAccessibleName("Filter by");
});
