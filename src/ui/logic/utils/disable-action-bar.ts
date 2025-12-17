export function disableActionBar(disabled: boolean): void {
  const actions = document.querySelectorAll<HTMLElement>('.action-bar *');
  for (const action of actions) {
    if (
      action instanceof HTMLButtonElement ||
      action instanceof HTMLInputElement ||
      action instanceof HTMLSelectElement ||
      action instanceof HTMLTextAreaElement ||
      action instanceof HTMLOptionElement ||
      action instanceof HTMLOptGroupElement ||
      action instanceof HTMLFieldSetElement ||
      "disabled" in action
    ) {
      action.disabled = disabled;
    }
  }
}