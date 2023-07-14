import { Highlight } from 'prism-react-renderer';
import SimpleMarkdown, { outputFor, parserFor } from 'simple-markdown';
import vsDarkCustom from '../components/Main/highlight-themes/vsDarkCustom';
import vsLightCustom from '../components/Main/highlight-themes/vsLightCustom';

let darkMode = false;
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  darkMode = true;
}
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
  darkMode = event.matches ? true : false;
});

const sanitizeUrl = function (url: string) {
  // copied from node_modules/simple-markdown
  if (url == null) {
    return null;
  }
  try {
    const prot = decodeURIComponent(url)
      .replace(/[^A-Za-z0-9/:]/g, '')
      .toLowerCase();
    if (
      prot.indexOf('javascript:') === 0 ||
      prot.indexOf('vbscript:') === 0 ||
      prot.indexOf('data:') === 0
    ) {
      return null;
    }
  } catch (e) {
    // decodeURIComponent sometimes throws a URIError
    // See `decodeURIComponent('a%AFc');`
    // http://stackoverflow.com/questions/9064536/javascript-decodeuricomponent-malformed-uri-exception
    return null;
  }
  return url;
};

const customRules = {
  ...SimpleMarkdown.defaultRules,
  codeBlock: {
    ...SimpleMarkdown.defaultRules.codeBlock,
    react: function (
      node: SimpleMarkdown.SingleASTNode,
      output: SimpleMarkdown.Output<React.ReactNode>,
      state: SimpleMarkdown.State,
    ) {
      return (
        <Highlight
          key={state.key}
          theme={darkMode ? vsDarkCustom : vsLightCustom}
          code={node.content}
          language="js"
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              key={state.key}
              style={style}
              className={`Highlight ${className} mb-2 overflow-scroll whitespace-pre-wrap rounded p-4 text-sm`}
            >
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      );
    },
  },
  fence: {
    ...SimpleMarkdown.defaultRules.fence,
    react: function (
      node: SimpleMarkdown.SingleASTNode,
      output: SimpleMarkdown.Output<React.ReactNode>,
      state: SimpleMarkdown.State,
    ) {
      return (
        <Highlight
          key={state.key}
          theme={darkMode ? vsDarkCustom : vsLightCustom}
          code={node.content}
          language="js"
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              key={state.key}
              style={style}
              className={`Highlight ${className} mb-2 overflow-scroll whitespace-pre-wrap rounded p-4 text-sm`}
            >
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      );
    },
  },
  link: {
    ...SimpleMarkdown.defaultRules.link,
    react: function (
      node: SimpleMarkdown.SingleASTNode,
      output: SimpleMarkdown.Output<React.ReactNode>,
      state: SimpleMarkdown.State,
    ) {
      return (
        <a
          href={sanitizeUrl(node.target) || undefined}
          key={state.key}
          title={node.title}
          target="_blank" // from here below doesn't exist in simple-markdown by default
          rel="noreferrer"
          onClick={(e) => {
            // stop opening card/toggling note edit when clicked
            e.stopPropagation();
          }}
        >
          {output(node.content, state)}
        </a>
      );
    },
  },
};

const parser = parserFor(customRules);
const reactOutput = outputFor(customRules, 'react');

export default function md(source: string) {
  // Many rules require content to end in \n\n to be interpreted as a block.
  const blockSource = source + '\n\n';
  const parseTree = parser(blockSource, { inline: false });
  const outputResult = reactOutput(parseTree);
  return outputResult;
}
