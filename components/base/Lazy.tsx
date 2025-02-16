import React, { useEffect, useMemo, useRef } from "react";

import { DOMObserver } from "@/lib/dom";

const Lazy = (
    { render, onObserve, state }:
        {
            render: (codeRef: React.RefObject<HTMLElement>) => React.JSX.Element,
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

    return render(ref);
};

export default Lazy;