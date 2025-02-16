import ReactMarkdown, { Components } from 'react-markdown';

import CodeSnippet from '../CodeSnippet';
import LevelElement from './LevelElement';

const ulStyles = [
    { max: 3, style: 'list-disc' },
    { max: 5, style: 'list-[circle]' },
    { max: 9, style: 'list-none' },
];

const liStyles = [
    { max: 3, style: 'mb-4' },
    { max: 5, style: 'mb-2' },
    { max: 9, style: 'mb-0' },
];

const pStyles = [
    { max: 3, style: 'mb-4' },
    { max: 5, style: 'mb-2' },
    { max: 9, style: 'mb-0' },
];

const components: Components = {
    code: ({ className, children }) => <CodeSnippet code={String(children)} className={className} />,
    ul: ({ children, node }) => <LevelElement element='ul' node={node} styles={ulStyles} className='pl-5 text-muted-foreground'>{children}</LevelElement>,
    li: ({ children, node }) => <LevelElement element='li' node={node} styles={liStyles}>{children}</LevelElement>,
    p: ({ children, node }) => <LevelElement element='p' node={node} styles={pStyles} className='text-muted-foreground'>{children}</LevelElement>,
    pre: ({ children }) => <pre className='bg-gray-800 text-gray-200 overflow-x-auto p-4 mb-5 rounded-lg text-base leading-relaxed'>{children}</pre>,
    ol: ({ children }) => <ol className="text-muted-foreground">{children}</ol>,
    h1: ({ children }) => <h1 className="text-5xl mb-12">{children}</h1>,
    h2: ({ children }) => <h2 className="text-4xl mb-8 mt-16">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl mb-4 mt-12">{children}</h3>,
    h4: ({ children }) => <h4 className="text-base mb-2">{children}</h4>,
    h5: ({ children }) => <h5 className="text-xs mb-2">{children}</h5>,
    h6: ({ children }) => <h6 className="text-2xs mb-2">{children}</h6>,
};

const Markdown = ({ content }: { content: string }) => {
    return (
        <ReactMarkdown components={components}>
            {content}
        </ReactMarkdown >
    );
};

export default Markdown;