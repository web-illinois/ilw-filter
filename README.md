# ilw-filter

Links: **[ilw-filter in Builder](https://builder3.toolkit.illinois.edu/component/ilw-filter/index.html)** | 
[Illinois Web Theme](https://webtheme.illinois.edu/) | 
[Toolkit Development](https://github.com/web-illinois/toolkit-management)

## Overview

Container for filter controls that holds a series of filters. Each filter is a separate component,
and this component manages the layout and logic of the filters.

## Attributes

### `ilw-filter`

Each filter component added under this component is registered automatically. You can register additional
filter components in other parts of the page by passing a list of element IDs to the `register` attribute.

All attributes that are available on this component:

- `filters` Required. The current state of the filters. This is a JSON string that is converted to an object.
- `register` A JSON list of IDs of other filter components to register.
- `compact` Applies a compact style to the filter container.

### `ilw-filter-*`

These components are used to create form controls for a specific value to filter results by. A working
filter is built from `ilw-filter` with one or more `ilw-filter-*` components.

All filter components have the following attributes:

- `name` Required. The key for the item. This is used to identify the filter in the filters object.
- `label` Required. The label for the item.
- `value` The value for the filter. This is reactive, so if the value changes, the filter will update.
- `query` A boolean that makes the filter item use a value from the query string. The URL is also
  updated when the filter changes.
 
Type-specific attributes:
- `options` A JSON list or object of options for select and grid types. This is required for those types.
  - If the value is a list, the string is both the key and the name of the option.
  - If the value is an object, the key is the name of the option and the value is the display name.
- `placeholder` The placeholder text for text-style inputs.

### `ilw-filter-button`

A component that renders a button for the filter. Typically, at least a submit button is required for
accessibility.

- `type` Required. The type of button.
  - `submit` A button that submits or applies the filters.
  - `reset` A reset button that removes all values from the `filters` object. A custom reset
    can be implemented by just setting the value of the `filters` attribute.

## Submission

There are three values events that `ilw-filter` emits:

- `filters` - When the filters change, either through user interaction or programmatically. This event
  includes the current filters object.
- `submit` - When the filters are intentionally submitted, either by pressing enter on a text input,
  clicking the submit button, or calling the `submit()` method.
- `autosubmit` - When the filters are automatically submitted, such as when a filter item is changed.
  This differs from the filters event in that it is not dispatched immediately on changes, but rather
  when each input type considers it appropriate to submit the filters. For example, a select input
  will submit the filters when the selection changes, while a text input will wait until the user
  presses enter or the input loses focus.

With each event, the event object is a `CustomEvent` with the `details` property being an object
with one key, `values`, which is the current filters object.

## Filters Attribute

The current state of all filters is provided through the `filters` attribute, and is fully reactive. It
uses Lit's built-in object converter, so the attribute value should be a JSON string.

The keys of the object are the names of filters provided through the filter subcomponents, with the
value being the current value of that filter. The value can be a string, number, boolean, array, or object,
depending on the configuration of the filter.

There is also a custom `filters` event dispatched on the `ilw-filter` element when the filters change, which
includes the same filters object for systems that don't work with reactive attributes as easily.

## Code Examples

```html
<ilw-filter filters='{"department":"Educational Psychology"}'>
    <h2 slot="heading">Filter by</h2>
    <ilw-filter-item
            name="department"
            label="Department"
            type="select"
            options='["", "Educational Psychology", "Special Education", "Curriculum and Instruction"]'></ilw-filter-item>
    <ilw-filter-item
            name="alphabet"
            label="A to Z"
            type="grid"
            options='["A", "B", "C", "D", "E", "F", "G", "H"]'></ilw-filter-item>
    <ilw-filter-item
            name="search"
            label="Search"
            placeholder="search by name or keyword"
            type="search"></ilw-filter-item>
    <ilw-filter-item
            name="context"
            type="hidden"
            value="hidden input value"></ilw-filter-item>
    <ilw-filter-button type="submit"></ilw-filter-button>
    <ilw-filter-button type="reset"></ilw-filter-button>
</ilw-filter>
```

## Accessibility Notes

- Always use a heading element in the `slot="heading"` to provide an accessible label for the filter container.
- Use accessible labels for the filter items that are easy to understand.

## External References
