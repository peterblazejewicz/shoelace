import { LitElement, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import type SlRadio from '../radio/radio';
import styles from './radio-group.styles';

/**
 * @since 2.0
 * @status stable
 *
 * @slot - The default slot where radio controls are placed.
 * @slot label - The radio group label. Required for proper accessibility. Alternatively, you can use the label prop.
 *
 * @csspart base - The component's base wrapper.
 * @csspart label - The radio group label.
 */
@customElement('sl-radio-group')
export default class SlRadioGroup extends LitElement {
  static styles = styles;
  private checkedValue: string = '';
  private customValidity = '';

  @query('slot:not([name])') defaultSlot: HTMLSlotElement;

  /** The radio group label. Required for proper accessibility. Alternatively, you can use the label slot. */
  @property() label = '';

  /** The radio group's name attribute. This is how you reference it in a form submission. */
  @property() name: string;

  /** The value of the radio group. This is based on the `value` of the currently selected radio. */
  @property()
  get value() {
    if (!this.checkedValue) return this.getCheckedValue();

    return this.checkedValue;
  }

  set value(newValue) {
    const index = this.getAllRadios().findIndex(el => el.value === newValue);
    const oldValue = this.checkedValue;

    if (index > -1) {
      this.checkRadioByIndex(index);

      this.checkedValue = newValue;
      this.requestUpdate('value', oldValue);
    } else {
      this.checkedValue = '';
      this.deselectAll();
    }
  }

  /** Shows the fieldset and legend that surrounds the radio group. */
  @property({ type: Boolean, attribute: 'fieldset' }) fieldset = false;

  /**
   * This will be true when the control is in an invalid state. Validity in a radio control is determined by the
   * `required` attribute or the message provided by the `setCustomValidity` method.
   */
  @property({ type: Boolean, reflect: true }) invalid = false;

  /** Indicates that a selection is required. */
  @property({ type: Boolean, reflect: true }) required = false;

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('sl-change', this.syncRadioButtons);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('sl-change', this.syncRadioButtons);
  }

  syncRadioButtons(event: CustomEvent) {
    const currentRadio = event.target;
    const radios = this.getAllRadios().filter(el => !el.disabled && el !== currentRadio);
    radios.forEach(el => {
      el.checked = false;
    });
  }

  getCheckedValue() {
    const checkedRadio = this.getAllRadios().find(el => el.checked);
    return checkedRadio?.value || '';
  }

  handleFocusIn() {
    // When tabbing into the fieldset, make sure it lands on the checked radio
    requestAnimationFrame(() => {
      const checkedRadio = this.getAllRadios().find(el => (el as SlRadio).checked) as SlRadio;

      if (checkedRadio) {
        checkedRadio.focus();
      }
    });
  }

  getAllRadios(options: { includeDisabled: boolean } = { includeDisabled: true }): SlRadio[] {
    return [...this.querySelectorAll('sl-radio')].filter(radio => {
      return options.includeDisabled ? true : radio.disabled === false;
    });
  }

  checkRadioByIndex(index: number): SlRadio[] {
    const radios = this.deselectAll();

    radios[index].focus();
    radios[index].checked = true;
    this.checkedValue = radios[index].value;

    return radios;
  }

  deselectAll(): SlRadio[] {
    return this.getAllRadios().map(radio => {
      radio.checked = false;
      return radio;
    });
  }

  handleKeyDown(event: KeyboardEvent) {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      const radios = this.getAllRadios().filter(radio => !radio.disabled);
      const currentIndex = radios.findIndex(el => el.checked);

      const incr = ['ArrowUp', 'ArrowLeft'].includes(event.key) ? -1 : 1;
      let index = currentIndex + incr;
      if (index < 0) index = radios.length - 1;
      if (index > radios.length - 1) index = 0;

      this.checkRadioByIndex(index);

      event.preventDefault();
    }
  }

  /** Checks for validity and shows the browser's validation message if the control is invalid. */
  reportValidity() {
    const radios = this.getAllRadios({ includeDisabled: false });
    let isChecked = true;

    // Report custom validity if a message is provided
    if (this.customValidity && radios.length > 0) {
      const internalRadio = radios[0].shadowRoot!.querySelector('input[type="radio"]')! as HTMLInputElement;
      internalRadio.setCustomValidity(this.customValidity);
      this.invalid = true;

      return internalRadio.reportValidity();
    }

    // Report unchecked controls when required
    if (this.required && radios.length > 0) {
      isChecked = radios.some(el => el.checked);

      if (!isChecked) {
        const internalRadio = radios[0].shadowRoot!.querySelector('input[type="radio"]')! as HTMLInputElement;

        // Synchronously set the internal radio so we don't have to wait for a render cycle
        internalRadio.setCustomValidity('');
        internalRadio.required = true;
        this.invalid = !internalRadio.reportValidity();

        return !this.invalid;
      }
    }

    return isChecked;
  }

  /** Sets a custom validation message. If `message` is not empty, the field will be considered invalid. */
  setCustomValidity(message: string) {
    this.customValidity = message;
  }

  render() {
    return html`
      <fieldset
        part="base"
        class=${classMap({
          'radio-group': true,
          'radio-group--has-fieldset': this.fieldset
        })}
        role="radiogroup"
        @focusin=${this.handleFocusIn}
        @keydown=${this.handleKeyDown}
      >
        <legend part="label" class="radio-group__label">
          <slot name="label">${this.label}</slot>
        </legend>
        <slot></slot>
      </fieldset>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sl-radio-group': SlRadioGroup;
  }
}
