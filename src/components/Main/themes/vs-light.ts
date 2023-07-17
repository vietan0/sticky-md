export default {
  'pre[class*="language-"]': {
    color: '#393A34',
    fontSize: '13px',
    textShadow: 'none',
    fontFamily: 'Menlo, Monaco, Consolas, "Andale Mono", "Ubuntu Mono", "Courier New", monospace',
    direction: 'ltr',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    lineHeight: '1.5',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',
    msHyphens: 'none',
    hyphens: 'none',
    padding: '1em',
    margin: '.5em 0',
    overflow: 'auto',
    backgroundColor: 'white',
    outline: '1px solid #dddddd',
  },
  'code[class*="language-"]': {
    color: '#393A34',
    fontSize: '13px',
    textShadow: 'none',
    fontFamily: 'Menlo, Monaco, Consolas, "Andale Mono", "Ubuntu Mono", "Courier New", monospace',
    direction: 'ltr',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    lineHeight: '1.5',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',
    msHyphens: 'none',
    hyphens: 'none',
  },

  'pre > code[class*="language-"]': {
    fontSize: '1em',
  },
  'pre[class*="language-"]::selection': {
    background: '#C1DEF1',
  },
  'pre[class*="language-"] ::selection': {
    background: '#C1DEF1',
  },
  'code[class*="language-"]::selection': {
    background: '#C1DEF1',
  },
  'code[class*="language-"] *::selection': {
    background: '#C1DEF1',
  },
  ':not(pre) > code[class*="language-"]': {
    padding: '.1em .3em',
    borderRadius: '.3em',
    color: '#db4c69',
    background: '#f8f8f8',
  },
  comment: {
    color: '#008000',
  },
  prolog: {
    color: '#008000',
  },
  punctuation: {
    color: '#393A34',
  },
  operator: {
    color: '#393A34',
  },
  url: {
    color: '#36acaa',
  },
  boolean: {
    color: '#36acaa',
  },
  number: {
    color: '#36acaa',
  },
  variable: {
    color: '#36acaa',
  },
  constant: {
    color: '#36acaa',
  },
  symbol: {
    color: '#36acaa',
  },
  inserted: {
    color: '#36acaa',
  },
  deleted: {
    color: '#9a050f',
  },
  atrule: {
    color: '#0000ff',
  },
  keyword: {
    color: '#0000ff',
  },
  'attr-value': {
    color: '#0000ff',
  },
  '.language-autohotkey .token.selector': {
    color: '#0000ff',
  },
  '.language-json .token.boolean': {
    color: '#0000ff',
  },
  '.language-json .token.number': {
    color: '#0000ff',
  },
  'code[class*="language-css"]': {
    color: '#0000ff',
  },
  function: {
    color: '#393A34',
  },

  '.language-autohotkey .token.tag': {
    color: '#9a050f',
  },
  selector: {
    color: '#800000',
  },
  '.language-autohotkey .token.keyword': {
    color: '#00009f',
  },
  important: {
    color: '#e90',
    fontWeight: 'bold',
  },
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
  'class-name': {
    color: '#2B91AF',
  },
  '.language-json .token.property': {
    color: '#2B91AF',
  },
  tag: {
    color: '#800000',
  },
  'attr-name': {
    color: '#ff0000',
  },
  property: {
    color: '#ff0000',
  },
  regex: {
    color: '#ff0000',
  },
  entity: {
    color: '#ff0000',
  },
  'directive.tag.tag': {
    background: '#ffff00',
    color: '#393A34',
  },
  '.line-numbers.line-numbers .line-numbers-rows': {
    borderRightColor: '#a5a5a5',
  },
  '.line-numbers .line-numbers-rows > span:before': {
    color: '#2B91AF',
  },
  '.line-highlight.line-highlight': {
    background: 'linear-gradient(to right, rgba(193, 222, 241, 0.2) 70%, rgba(221, 222, 241, 0))',
  },
};
