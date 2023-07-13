import SimpleMarkdown, {
  defaultBlockParse,
  defaultReactOutput,
  outputFor,
  parserFor,
  reactElement,
} from 'simple-markdown';

const customRules = {
  ...SimpleMarkdown.defaultRules,
  inlineCode: {
    ...SimpleMarkdown.defaultRules.inlineCode,
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
