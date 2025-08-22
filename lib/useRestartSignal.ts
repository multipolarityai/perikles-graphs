import { useEffect } from 'react';

/**
 * When you want to nudge D3's simulation to restart from a control panel,
 * dispatch: window.dispatchEvent(new CustomEvent('forcegraph:restart'));
 *
 * Then in the page, call useRestartSignal(() => setLinkDistance(v => v + 0.0001) ...)
 */
export function useRestartSignal(cb: () => void) {
  useEffect(() => {
    const handler = () => cb();
    window.addEventListener('forcegraph:restart', handler);
    return () => window.removeEventListener('forcegraph:restart', handler);
  }, [cb]);
}
