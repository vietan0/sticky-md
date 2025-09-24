import { useContext } from 'react';
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import remarkGfm from 'remark-gfm';
import { ThemeContext } from '../contexts';
import cn from '../utils/cn';
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

  const style = htmlHasDark
    ? (vsDarkPlus as {
        [key: string]: React.CSSProperties;
      })
    : (vsLight as {
        [key: string]: React.CSSProperties;
      });

  return (
    <div className={className}>
      <Markdown
        components={{
          h1: ({ node, ...props }) => <h1 {...props} className="text-lg font-semibold" />,
          h2: ({ node, ...props }) => <h2 {...props} className="text-base font-medium" />,
          ul: ({ node, ...props }) => <ul {...props} className="list-disc ps-4" />,
          ol: ({ node, ...props }) => <ol {...props} className="list-decimal ps-4" />,
          table: ({ node, ...props }) => (
            <table {...props} className="border-collapse border border-neutral-400" />
          ),
          thead: ({ node, ...props }) => (
            <thead
              {...props}
              className={`
                bg-black/10
                dark:bg-white/10
              `}
            />
          ),
          th: ({ node, ...props }) => (
            <th
              {...props}
              className={`
                border border-black/40 p-2
                dark:border-white/20
              `}
            />
          ),
          td: ({ node, ...props }) => (
            <td
              {...props}
              className={`
                border border-black/40 p-2
                dark:border-white/20
              `}
            />
          ),
          a: ({ node, ...props }) => (
            <a
              {...props}
              className={`
                text-blue-700
                hover:underline
                dark:text-blue-500
              `}
              onClick={e => e.stopPropagation()}
              target="_blank"
            />
          ),
          pre: ({ node, ...props }) => (
            <pre {...props} className="max-h-64 overflow-y-scroll" />
          ),
          code: ({ node, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');

            return match
              ? (
                  <SyntaxHighlighter
                    codeTagProps={{ className: 'text-[13px] overflow-hidden tracking-tight' }} // affect <code> itself, overrides style
                    customStyle={{
                      borderRadius: '4px',
                      margin: 0,
                      width: '100%',
                      border: htmlHasDark
                        ? '1px solid hsl(0 100% 100% / 0.15)'
                        : '1px solid hsl(0 0% 0% / 0.1)',
                      backgroundColor: htmlHasDark ? 'hsl(0 0% 12% / 0.9)' : 'hsl(0 100% 100% / 0.75)',
                    }} // affect parent of <code>
                    language={match[1]}
                    style={style}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                )
              : (
                  <code
                    {...props}
                    className={cn(
                      className || '',
                      `
                        w-fit rounded-md bg-black/10 px-1 py-[2px] text-sm whitespace-pre-wrap
                        dark:bg-white/10
                      `,
                    )}
                  >
                    {children}
                  </code>
                );
          },
        }}
        remarkPlugins={[remarkGfm]}
      >
        {children}
      </Markdown>
    </div>
  );
}
