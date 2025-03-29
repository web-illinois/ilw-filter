# ilw-filter

Links: **[ilw-filter in Builder](https://builder3.toolkit.illinois.edu/component/ilw-filter/index.html)** | 
[Illinois Web Theme](https://webtheme.illinois.edu/) | 
[Toolkit Development](https://github.com/web-illinois/toolkit-management)

## Overview

Container for filter controls that holds a series of filters. Each filter is a separate component,
and this component manages the layout and logic of the filters.

Each filter component added under this component is registered automatically. You can register additional
filter components in other parts of the page by passing a list of element IDs to the `register` attribute.

Other attributes that are available on this component include:

- `compact` applies a compact style to the filter container.

### Submission

Because the filters are a type of form, it must be possible for it to be submitted in two ways:

- Pressing the enter key in an input.
- Clicking a submit button.

In either case, there is a `submit` event that is dispatched on the `ilw-filter` element.

### Filters Attribute

The current state of all filters is provided through the `filters` attribute, and is fully reactive. It
uses Lit's built-in object converter, so the attribute value should be a JSON string.

The keys of the object are the names of filters provided through the filter subcomponents, with the
value being the current value of that filter. The value can be a string, number, boolean, array, or object,
depending on the configuration of the filter.

## Code Examples

```html
<ilw-filter filters='{"department":"Educational Psychology"}'>
    <h2 slot="heading">Filter by</h2>
    <ilw-filter-item
        name="department"
        label="Department"
        type="select"
        options='["Educational Psychology", "Special Education", "Curriculum and Instruction"]' />
    <ilw-filter-item
        name="alphabet"
        type="alphabet" />
    <ilw-filter-item
        name="search"
        label="search by name or keyword"
        type="search" />
    <ilw-filter-button type="submit" primary />
    <ilw-filter-button type="reset" />
</ilw-filter>
```

## Accessibility Notes and Use

Consider accessibility, both for building the component and for its use:

- Is there sufficient color contrast?
- Can the component be fully understood without colors?
- Does the component need alt text or ARIA roles?
- Can the component be navigated with a keyboard? Is the tab order correct?
- Are focusable elements interactive, and interactive elements focusable?
- Are form fields, figures, fieldsets and other interactive elements labelled?

## External References
