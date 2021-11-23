# Radio Group

[component-header:sl-radio-group]

Radio Groups are used to group multiple radios so they function as a single control.

```html preview
<sl-radio-group label="Select an option">
  <sl-radio value="1" checked>Option 1</sl-radio>
  <sl-radio value="2">Option 2</sl-radio>
  <sl-radio value="3">Option 3</sl-radio>
</sl-radio-group>
```

```jsx react
import { SlRadio, SlRadioGroup } from '@shoelace-style/shoelace/dist/react';

const App = () => (
  <SlRadioGroup label="Select an option">
    <SlRadio value="1" checked>Option 1</SlRadio>
    <SlRadio value="2">Option 2</SlRadio>
    <SlRadio value="3">Option 3</SlRadio>
  </SlRadioGroup>
);
```

## Examples

### Showing the Fieldset

You can show a fieldset and legend that wraps the radio group using the `fieldset` attribute.

```html preview
<sl-radio-group label="Select an option" fieldset>
  <sl-radio value="1" checked>Option 1</sl-radio>
  <sl-radio value="2">Option 2</sl-radio>
  <sl-radio value="3">Option 3</sl-radio>
</sl-radio-group>
```

```jsx react
import { SlRadio, SlRadioGroup } from '@shoelace-style/shoelace/dist/react';

const App = () => (
  <SlRadioGroup label="Select an option" fieldset value="1">
    <SlRadio value="1" checked>Option 1</SlRadio>
    <SlRadio value="2">Option 2</SlRadio>
    <SlRadio value="3">Option 3</SlRadio>
  </SlRadioGroup>
);
```

### Required

Add the `required` attribute to require a selection.

```html preview
<div class="radio-group-required">
  <sl-radio-group label="Select an option" fieldset required>
    <sl-radio value="1">Option 1</sl-radio>
    <sl-radio value="2">Option 2</sl-radio>
    <sl-radio value="3">Option 3</sl-radio>
  </sl-radio-group>
  <br />
  <sl-button data-validate>Validate</sl-button>
  <sl-button data-reset>Reset</sl-button>
</div>

<script>
  const container = document.querySelector('.radio-group-required');
  const group = container.querySelector('sl-radio-group');
  const validateButton = container.querySelector('[data-validate]');
  const resetButton = container.querySelector('[data-reset]');

  validateButton.addEventListener('click', () => {
    if (group.reportValidity()) {
      alert('Valid');
    }
  });
  resetButton.addEventListener('click', () => group.value = '');
</script>
```

### Form Submission

TODO

### Custom Validation Message

TODO

```jsx react
import { SlRadio, SlRadioGroup } from '@shoelace-style/shoelace/dist/react';
const validateGroup = () => {
  const group = document.querySelector('sl-radio-group.required-radio-group');
  group.reportValidity();
}

const resetGroup = () => {
  const group = document.querySelector('sl-radio-group.required-radio-group');
  group.value = "";
}

const App = () => (
  <>
    <SlRadioGroup label="Select an option" fieldset required>
      <SlRadio value="1" checked>Option 1</SlRadio>
      <SlRadio value="2">Option 2</SlRadio>
      <SlRadio value="3">Option 3</SlRadio>
    </SlRadioGroup>
    <br />
    <sl-button class="required-button" onClick={()=> validateGroup()}>Validate Group</sl-button>
    <sl-button class="required-button" onClick={()=> resetGroup()}>Reset Group</sl-button>
  </>
);
```

[component-metadata:sl-radio-group]
