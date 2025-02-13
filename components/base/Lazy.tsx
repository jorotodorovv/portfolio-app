import React, { useEffect, useMemo, useRef } from "react";

const FIRST_ENTRY_INDEX = 0;
const DEFAULT_THRESHOLD = 0;

class DOMObserver {
    private ref: React.RefObject<HTMLElement>;
    private observer: IntersectionObserver;

    constructor(
        ref: React.RefObject<HTMLElement>,
        onObserve: (element: HTMLElement) => void,
        threshold: number = DEFAULT_THRESHOLD) {
        this.ref = ref;
        this.observer = new IntersectionObserver(this.getCallback(onObserve), { threshold: threshold });
    }

    public observe(): void {
        if (this.ref.current) {
            this.observer.observe(this.ref.current);
        }
    }

    public unobserve(): void {
        if (this.ref.current) {
            this.observer.unobserve(this.ref.current);
        }
    }

    private getCallback(onObserve: (element: HTMLElement) => void): IntersectionObserverCallback {
        return (entries) => {
            if (this.ref.current && entries[FIRST_ENTRY_INDEX].isIntersecting) {
                onObserve(this.ref.current);
            };
        }
    }
}


const Lazy = (
    { component, onObserve, state }:
        {
            component: (codeRef: React.RefObject<HTMLElement>) => React.JSX.Element,
            onObserve: (element: HTMLElement) => void,
            state: Array<string | undefined>,
        }) => {
    const ref = useRef<HTMLElement>(null);

    const observer = useMemo(() => {
        return new DOMObserver(ref, onObserve);
    }, [onObserve, ref]);

    useEffect(() => {
        observer.observe();

        return () => {
            observer.unobserve();
        }
    }, [observer, ...state])

    return component(ref);
};

export default Lazy;