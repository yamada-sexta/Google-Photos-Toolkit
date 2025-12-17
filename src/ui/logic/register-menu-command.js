import { showMainMenu } from './insert-ui';

export default function registerMenuCommand() {
  // Register a new menu command
  // eslint-disable-next-line no-undef
  GM_registerMenuCommand('Open GPTK window', function () {
    showMainMenu();
  });
}
