import { useSyncExternalStore } from 'react';
import { getAppSettings, subscribeAppSettings } from './appState';

export function useAppSettings() {
    return useSyncExternalStore(subscribeAppSettings, getAppSettings, getAppSettings);
}
