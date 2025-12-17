import log from './log';
import { core } from '../../globals';

export default function controlButttonsListeners() {
  const clearLogButton = document.getElementById('clearLog');
  if (!clearLogButton) {
    log('clearLogButton not found in DOM', 'error');
    return;
  }
  clearLogButton.addEventListener('click', clearLog);
  const stopProcessButton = document.getElementById('stopProcess');
  if (!stopProcessButton) {
    log('stopProcessButton not found in DOM', 'error');
    return;
  }
  stopProcessButton.addEventListener('click', stopProcess);
}

function clearLog() {
  const logContainer = document.getElementById('logArea');
  if (!logContainer) {
    log('logContainer not found in DOM', 'error');
    return;
  }
  const logElements = Array.from(logContainer.childNodes);
  for (const logElement of logElements) {
    logElement.remove();
  }
}

function stopProcess() {
  log('Stopping the process');
  core.isProcessRunning = false;
}
