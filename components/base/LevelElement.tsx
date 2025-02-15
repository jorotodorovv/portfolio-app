import React from 'react';
import Hast from 'hast';
import { cn } from '@/lib/utils';

interface LevelBasedStyle {
    max: number;
    style: string;
}

interface LevelComponentProps {
    element: 'ul' | 'li' | 'p';
    styles: LevelBasedStyle[];
    className?: string | undefined;
    node: Hast.Element | undefined;
    children: React.ReactNode;
}

const getLevelBasedStyle = (node: Hast.Element | undefined, levels: LevelBasedStyle[]): string => {
    let level = 1;

    if (node && node.position) {
        level = node.position.start.column;
    }

    for (const item of levels) {
        if (level <= item.max) {
            return item.style;
        }
    }

    return '';
};

const LevelElement = ({ element, styles, className, node, children }: LevelComponentProps) => {
    const style = getLevelBasedStyle(node, styles);

    const Element = element;

    return <Element className={cn(className, style)}>{children}</Element>;
};

export default LevelElement;