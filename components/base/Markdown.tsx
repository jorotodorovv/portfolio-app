import React, { useState, useRef, useMemo } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import ReactQuill from 'react-quill';
import turndown from 'turndown';

import 'react-quill/dist/quill.snow.css';

import CodeSnippet from '../CodeSnippet';

const Markdown = ({ content }: { content: string }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [markdownContent, setMarkdownContent] = useState<string>(content);

    const quillRef = useRef<ReactQuill | null>(null);

    const components = useMemo<Components>(() => {
        return {
            code: ({ className, children }) =>
                <CodeSnippet code={String(children)} className={className} />
        }
    }, []);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        if (!quillRef || !quillRef.current) return;

        const quill = quillRef.current.getEditor();
        const html = quill.root.innerHTML;

        const td = new turndown();
        const markdown = td.turndown(html);

        setMarkdownContent(markdown);
        setIsEditing(false);
    };

    const modules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'header': [1, 2, 3, false] }],
            ['link', 'image'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['clean']
        ],
    };

    const formats = [
        'bold', 'italic', 'underline', 'strike',
        'header',
        'link', 'image',
        'list', 'bullet'
    ];

    return (
        <>
            {isEditing ? (
                <>
                    <button onClick={handleSaveClick}>Save</button>
                    <ReactQuill
                        theme='snow'
                        ref={quillRef}
                        value={markdownContent}
                        onChange={setMarkdownContent}
                        modules={modules}
                        formats={formats}
                    />
                </>
            ) : (
                <div onClick={handleEditClick}>
                    <ReactMarkdown components={components}>
                        {markdownContent}
                    </ReactMarkdown>
                </div>
            )}
        </>
    );
};

export default Markdown;