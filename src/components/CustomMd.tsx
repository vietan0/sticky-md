import { useContext, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { ThemeContext } from '../contexts';
import vsDarkPlus from './Main/themes/vs-dark-plus';
import vsLight from './Main/themes/vs-light';

export default function CustomMd({
  children,
  className = '',
}: {
  children: string;
  className?: string;
}) {
  const { htmlHasDark } = useContext(ThemeContext);
  const remarkPlugins = useMemo(() => [remarkGfm], []);
  const components = useMemo(
    () => ({
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
      pre: ({ node, ...props }) => <pre {...props} className="myPre max-h-64 overflow-scroll" />,
      code: ({ node, inline, className, children, ...props }) => {
        const match = /language-(\w+)/.exec(className || '');
        return !inline && match ? (
          <SyntaxHighlighter
            style={htmlHasDark ? vsDarkPlus : vsLight}
            customStyle={{
              borderRadius: '4px',
              margin: 0,
              width: '100%',
              border: htmlHasDark
                ? '1px solid hsl(0 100% 100% / 0.15)'
                : '1px solid hsl(0 0% 0% / 0.1)',
              backgroundColor: htmlHasDark ? 'hsl(0 0% 12% / 0.9)' : 'hsl(0 100% 100% / 0.75)',
            }} // affect parent of <code>
            codeTagProps={{ className: 'text-[14px] tracking-tight' }} // affect <code> itself, overrides style
            language={match[1]}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        ) : (
          <code
            {...props}
            className={`${className || ''} w-fit whitespace-pre-wrap rounded-md bg-black/10 px-1 py-[2px] text-sm dark:bg-white/10`}
          >
            {children}
          </code>
        );
      },
    }),
    [],
  );

  return (
    <ReactMarkdown className={className} remarkPlugins={remarkPlugins} components={components}>
      {children}
    </ReactMarkdown>
  );
}
