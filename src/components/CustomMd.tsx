import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function CustomMd({
  children,
  className = '',
}: {
  children: string;
  className?: string;
}) {
  return (
    <ReactMarkdown
      className={className}
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ node, ...props }) => <h1 {...props} className="text-lg font-semibold" />,
        h2: ({ node, ...props }) => <h2 {...props} className="text-base font-medium" />,
        ul: ({ node, ordered, ...props }) => <ul {...props} className="list-disc ps-4" />,
        a: ({ node, ...props }) => (
          <a
            {...props}
            target="_blank"
            onClick={(e) => e.stopPropagation()}
            className="text-blue-700 hover:underline dark:text-blue-500"
          />
        ),
        code: ({ node, inline, className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              style={vscDarkPlus}
              customStyle={{ borderRadius: '4px' }} // affect parent of <code>
              codeTagProps={{ className: 'text-[14px] tracking-tight' }} // affect <code> itself, overrides style
              language={match[1]}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code
              {...props}
              className={`${className} whitespace-pre-wrap rounded-md bg-slate-300 px-1 py-[2px] text-sm dark:bg-slate-700`}
            >
              {children}
            </code>
          );
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
}