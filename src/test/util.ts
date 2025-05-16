import { render } from "vitest-browser-lit";
import Filter from "../Filter";
import { TemplateResult } from "lit";
import { vi } from "vitest";

export async function renderFilter(content: TemplateResult) {
    vi.useFakeTimers();
    const screen = render(content);
    const element = screen.getByTestId("filter");

    const filter = element.element() as Filter;

    // Make sure the debounce finishes
    await vi.runAllTimersAsync();

    return { filter, screen, element };
}
