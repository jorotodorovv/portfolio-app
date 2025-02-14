import ReactMarkdown, { Components } from 'react-markdown';

import CodeSnippet from '../CodeSnippet';

const code: Components['code'] = ({ className, children }) => (
    <CodeSnippet code={String(children)} className={className} />
);

const pre: Components['pre'] = ({ children }) => (
    <pre className='bg-gray-800 text-gray-200 overflow-x-auto p-4 mb-5 rounded-lg text-base leading-relaxed'>{children}</pre>
);

const ul: Components['ul'] = ({ children, node }) => {
    let listStyle;

    let level = 1;

    if (node && 
        node.position && 
        node.position.start.column > 1) {
        level = node.position.start.column;
    }

    if (level <= 3) {
        listStyle = 'list-disc';
    }
    else if (level <= 5) {
        listStyle = 'list-[circle]';
    }
    else {
        listStyle = 'list-none';
    }

    return <ul className={`${listStyle} pl-5 text-muted-foreground`}>{children}</ul>;
};

const li: Components['li'] = ({ children, node }) => {
    let listStyle;

    let level = 1;

    if (node && 
        node.position && 
        node.position.start.column > 1) {
        level = node.position.start.column;
    }

    if (level <= 3) {
        listStyle = 'mb-4';
    }
    else if (level <= 5) {
        listStyle = 'mb-2';
    }
    else {
        listStyle = 'mb-1';
    }

    return <li className={listStyle}>{children}</li>;
};

const ol: Components['ol'] = ({ children }) => <ol className="text-muted-foreground">{children}</ol>;
const p: Components['p'] = ({ children }) => <p className="text-muted-foreground mb-4">{children}</p>;
const h1: Components['h1'] = ({ children }) => <h1 className="text-5xl mb-12">{children}</h1>;
const h2: Components['h2'] = ({ children }) => <h2 className="text-4xl mb-8 mt-16">{children}</h2>;
const h3: Components['h3'] = ({ children }) => <h3 className="text-xl mb-4 mt-12">{children}</h3>;
const h4: Components['h4'] = ({ children }) => <h4 className="text-base mb-2">{children}</h4>;
const h5: Components['h5'] = ({ children }) => <h5 className="text-xs mb-2">{children}</h5>;
const h6: Components['h6'] = ({ children }) => <h6 className="text-2xs mb-2">{children}</h6>;


const components: Components = {
    code,
    pre,
    ul,
    ol,
    li,
    p,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
};

const Markdown = ({ content }: { content: string }) => {
    return (
        <ReactMarkdown components={components}>
            {content}
        </ReactMarkdown >
    );
};

export default Markdown;