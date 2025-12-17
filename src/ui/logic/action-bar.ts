import { windowGlobalData } from '../../windowGlobalData';
import { core } from '../../globals';
import getFormData from './utils/getFormData';
import { generateFilterDescription } from './filter-description-gen';
import { updateUI } from './update-state';
import { disableActionBar } from './utils/disable-action-bar';
import getFromStorage from '../../utils/getFromStorage';
import type { ApiSettings, Filter, Source } from '../../gptk-core';
import type { Album } from '../../api/parser';

const actions = [
  {
    elementId: 'toExistingAlbum',
    targetId: 'existingAlbum',
  },
  {
    elementId: 'toNewAlbum',
    targetId: 'newAlbumName',
  },
  { elementId: 'toTrash' },
  { elementId: 'restoreTrash' },
  { elementId: 'toArchive' },
  { elementId: 'unArchive' },
  { elementId: 'toFavorite' },
  { elementId: 'unFavorite' },
  { elementId: 'lock' },
  { elementId: 'unLock' },
  { elementId: 'copyDescFromOther' },
] as const;

function userConfirmation(action: (typeof actions)[number], filter: Filter, source: Source) {
  function generateWarning(action: (typeof actions)[number], filter: Filter, source: Source) {
    const filterDescription = generateFilterDescription(filter);
    const sourceHuman = (<HTMLLabelElement>document.querySelector('input[name="source"]:checked+label')!).textContent!.trim();
    const actionElement = <HTMLElement>document.getElementById(action.elementId)!;
    const warning = [];
    warning.push(`Account: ${windowGlobalData.account}`);
    warning.push(`\nSource: ${sourceHuman}`);
    warning.push(`\n${filterDescription}`);
    warning.push(`\nAction: ${actionElement.title}`);
    return warning.join(' ');
  }
  const warning = generateWarning(action, filter, source);
  const confirmation = window.confirm(`${warning}\nProceed?`);
  if (!confirmation) return false;
  return true;
}

async function runAction(actionId: string) {
  const action = actions.find((action) => action.elementId === actionId);
  if (!action) return;
  // get the target album if action has one
  let targetAlbum: Album | null = null;
  let newTargetAlbumName: string | null = null;
  if (actionId === 'toExistingAlbum') {
    const albumMediaKey = (<HTMLInputElement>document.getElementById((<any>action).targetId)!).value;
    targetAlbum = getFromStorage('albums').find((album: any) => album.mediaKey === albumMediaKey);
  } else {
    newTargetAlbumName = (<HTMLInputElement>document.getElementById((<any>action).targetId)!).value;
  }
  // id of currently selected source element
  const source = <Source>(<HTMLInputElement>document.querySelector('input[name="source"]:checked')!).id;

  // check filter validity
  const filtersForm = <HTMLFormElement>document.querySelector('.filters-form')!;
  if (!filtersForm.checkValidity()) {
    filtersForm.reportValidity();
    return;
  }

  // Parsed filter object
  const filter = <Filter><unknown>getFormData('.filters-form');
  // Parsed settings object
  const apiSettings: ApiSettings = getFormData('.settings-form') as any;
  if (!userConfirmation(action, filter, source)) return;

  // Disable action bar while process is running
  disableActionBar(true);
  // add class to indicate which action is running
  (<HTMLElement>document.getElementById(actionId)!).classList.add('running');
  // Run it
  await core.actionWithFilter(action, filter, source, targetAlbum, newTargetAlbumName ?? '', apiSettings);
  // remove 'running' class
  (<HTMLElement>document.getElementById(actionId)!).classList.remove('running');
  // Update the ui
  updateUI();
  // force show main action bar
  showActionButtons();
}

function showExistingAlbumContainer() {
  (<HTMLElement>document.querySelector('.action-buttons')!).style.display = 'none';
  (<HTMLElement>document.querySelector('.to-existing-container')!).style.display = 'flex';
}

function showNewAlbumContainer() {
  (<HTMLElement>document.querySelector('.action-buttons')!).style.display = 'none';
  (<HTMLElement>document.querySelector('.to-new-container')!).style.display = 'flex';
}

function showActionButtons() {
  (<HTMLElement>document.querySelector('.action-buttons')!).style.display = 'flex';
  (<HTMLElement>document.querySelector('.to-existing-container')!).style.display = 'none';
  (<HTMLElement>document.querySelector('.to-new-container')!).style.display = 'none';
}

export function actionsListenersSetUp() {
  for (const action of actions) {
    const actionElement = <HTMLElement>document.getElementById(action.elementId)!;
    if ("type" in actionElement && actionElement.type === 'button') {
      actionElement.addEventListener('click', async function (event) {
        event.preventDefault();
        await runAction(actionElement.id);
      });
    } else if (actionElement.tagName.toLowerCase() === 'form') {
      actionElement.addEventListener('submit', async function (event) {
        event.preventDefault();
        await runAction(actionElement.id);
      });
    }
  }

  const showExistingAlbumForm = <HTMLElement>document.querySelector('#showExistingAlbumForm')!;
  showExistingAlbumForm.addEventListener('click', showExistingAlbumContainer);

  const showNewAlbumForm = <HTMLElement>document.querySelector('#showNewAlbumForm')!;
  showNewAlbumForm.addEventListener('click', showNewAlbumContainer);

  const returnButtons = document.querySelectorAll('.return');
  for (const button of returnButtons) {
    button?.addEventListener('click', showActionButtons);
  }
}
