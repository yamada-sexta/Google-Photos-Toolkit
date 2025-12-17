import saveToStorage from '../../utils/saveToStorage';
import getFromStorage from '../../utils/getFromStorage';
import log from './log';
import { apiSettingsDefault } from '../../api/api-utils-default-presets';
import getFormData from './utils/getFormData';

export default function advancedSettingsListenersSetUp() {
  function saveApiSettings(event: Event) {
    event.preventDefault();

    const userInptSettings = getFormData('.settings-form');

    // Save values to localStorage
    saveToStorage('apiSettings', userInptSettings);
    log('Api settings saved');
  }

  function restoreApiDefaults() {
    // Save default values to localStorage
    saveToStorage('apiSettings', apiSettingsDefault);

    // Update the form with default values
    maxConcurrentSingleApiReqInput!!.value = String(apiSettingsDefault.maxConcurrentSingleApiReq);
    maxConcurrentBatchApiReqInput!!.value = String(apiSettingsDefault.maxConcurrentBatchApiReq);
    operationSizeInput!!.value = String(apiSettingsDefault.operationSize);
    lockedFolderOpSizeInput!!.value = String(apiSettingsDefault.lockedFolderOpSize);
    infoSizeInput!!.value = String(apiSettingsDefault.infoSize);
    log('Default api settings restored');
  }
  const maxConcurrentSingleApiReqInput = document.querySelector<HTMLInputElement>('input[name="maxConcurrentSingleApiReq"]');
  const maxConcurrentBatchApiReqInput = document.querySelector<HTMLInputElement>('input[name="maxConcurrentBatchApiReq"]');
  const operationSizeInput = document.querySelector<HTMLInputElement>('input[name="operationSize"]');
  const lockedFolderOpSizeInput = document.querySelector<HTMLInputElement>('input[name="lockedFolderOpSize"]');
  const infoSizeInput = document.querySelector<HTMLInputElement>('input[name="infoSize"]');
  const defaultButton = document.querySelector<HTMLButtonElement>('button[name="default"]');
  const settingsForm = document.querySelector<HTMLFormElement>('.settings-form');

  const restoredSettings = getFromStorage('apiSettings');

  maxConcurrentSingleApiReqInput!!.value =
    restoredSettings?.maxConcurrentSingleApiReq || apiSettingsDefault.maxConcurrentSingleApiReq;
  maxConcurrentBatchApiReqInput!!.value =
    restoredSettings?.maxConcurrentBatchApiReq || apiSettingsDefault.maxConcurrentBatchApiReq;
  operationSizeInput!!.value = restoredSettings?.operationSize || apiSettingsDefault.operationSize;
  lockedFolderOpSizeInput!!.value = restoredSettings?.lockedFolderOpSize || apiSettingsDefault.lockedFolderOpSize;
  infoSizeInput!!.value = restoredSettings?.infoSize || apiSettingsDefault.infoSize;

  // Add event listener for form submission
  settingsForm!!.addEventListener('submit', saveApiSettings);
  // Add event listener for "Default" button click
  defaultButton!!.addEventListener('click', restoreApiDefaults);
}
