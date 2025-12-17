import { showMainMenu } from './insert-ui';

export default function registerMenuCommand() {
  // Register a new menu command
  GM.registerMenuCommand('Open GPTK window', function () {
    showMainMenu();
  });
}
