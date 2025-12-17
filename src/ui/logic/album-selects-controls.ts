import { addAlbums } from './album-selects-update';
import saveToStorage from '../../utils/saveToStorage';
import log from './log';
import { apiUtils } from '../../globals';
import { updateUI } from './update-state';
import { core } from '../../globals';

export function albumSelectsControlsSetUp(): void {
  const selectAllButtons = document.querySelectorAll<HTMLElement>('[name="selectAll"]');
  for (const selectAllButton of selectAllButtons) {
    selectAllButton.addEventListener('click', selectAllAlbums);
  }

  const selectSharedButtons = document.querySelectorAll<HTMLElement>('[name="selectShared"]');
  for (const selectSharedButton of selectSharedButtons) {
    selectSharedButton.addEventListener('click', selectSharedAlbums);
  }

  const selectNotSharedButtons = document.querySelectorAll<HTMLElement>('[name="selectNonShared"]');
  for (const selectNotSharedButton of selectNotSharedButtons) {
    selectNotSharedButton.addEventListener('click', selectNotSharedAlbums);
  }

  const resetAlbumSelectionButtons = document.querySelectorAll<HTMLElement>('[name="resetAlbumSelection"]');
  for (const resetAlbumSelectionButton of resetAlbumSelectionButtons) {
    resetAlbumSelectionButton.addEventListener('click', resetAlbumSelection);
  }

  const refreshAlbumsButtons = document.querySelectorAll<HTMLElement>('.refresh-albums');
  for (const refreshAlbumsButton of refreshAlbumsButtons) {
    refreshAlbumsButton.addEventListener('click', refreshAlbums);
  }
}

function selectAllAlbums(this: HTMLElement): void {
  const parent = this.parentElement?.parentElement ?? null;
  const closestSelect = parent?.querySelector<HTMLSelectElement>('select') ?? null;

  // Ensure the required elements actually exist
  if (!!parent && !!closestSelect) {
    for (const option of Array.from(closestSelect.options)) {
      if (option.value) option.selected = true;
    }
    updateUI();
  } else {
    console.warn('selectAllAlbums: missing parent or select element');
  }
}

function selectSharedAlbums(this: HTMLElement): void {
  updateUI();
  const parent = this.parentElement?.parentElement ?? null;
  const closestSelect = parent?.querySelector<HTMLSelectElement>('select') ?? null;

  if (!!parent && !!closestSelect) {
    for (const option of Array.from(closestSelect.options)) {
      if (option.value) option.selected = option.classList.contains('shared');
    }
    updateUI();
  } else {
    console.warn('selectSharedAlbums: missing parent or select element');
  }
}

function selectNotSharedAlbums(this: HTMLElement): void {
  const parent = this.parentElement?.parentElement ?? null;
  const closestSelect = parent?.querySelector<HTMLSelectElement>('select') ?? null;

  if (!!parent && !!closestSelect) {
    for (const option of Array.from(closestSelect.options)) {
      if (option.value) option.selected = !option.classList.contains('shared');
    }
    updateUI();
  } else {
    console.warn('selectNotSharedAlbums: missing parent or select element');
  }
}

function resetAlbumSelection(this: HTMLElement): void {
  const parent = this.parentElement?.parentElement ?? null;
  const closestSelect = parent?.querySelector<HTMLSelectElement>('select') ?? null;

  if (!!parent && !!closestSelect) {
    for (const option of Array.from(closestSelect.options)) option.selected = false;
    updateUI();
  } else {
    console.warn('resetAlbumSelection: missing parent or select element');
  }
}

async function refreshAlbums(): Promise<void> {
  // ugly
  core.isProcessRunning = true;
  let albums: any = null;
  try {
    albums = await apiUtils.getAllAlbums();
    addAlbums(albums);
    saveToStorage('albums', albums);
    log('Albums Refreshed');
  } catch (e) {
    log(`Error refreshing albums ${e}`, 'error');
  }
  core.isProcessRunning = false;
  updateUI();
}
