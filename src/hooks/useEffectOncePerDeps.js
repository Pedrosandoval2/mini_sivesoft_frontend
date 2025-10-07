import { useEffect, useRef } from 'react';

export function useEffectOncePerDeps(effect, deps = []) {
    const prevDepsRef = useRef([]);

    useEffect(() => {
        const depsChanged =
            deps.length !== prevDepsRef.current.length ||
            deps.some((dep, i) => dep !== prevDepsRef.current[i]);

        if (!depsChanged) return;

        prevDepsRef.current = deps;

        const cleanup = effect();
        return cleanup;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}