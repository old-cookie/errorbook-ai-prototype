import { useSyncExternalStore } from 'react';
import { getGameProgress, subscribeGameProgress } from './appState';

export function useGameProgress() {
    return useSyncExternalStore(subscribeGameProgress, getGameProgress, getGameProgress);
}
