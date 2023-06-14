import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

export default function Main() {
  const markdownH2 = `## Just a link: [React](https://reactjs.com)`;
  const markdownList = `- hey \n - jude`;
  return (
    <main className="p-8">
      <ReactMarkdown
        children={markdownH2}
        className="text-lg font-bold"
      />
      <ReactMarkdown
        children={markdownList}
        className=""
      />
    </main>
  );
}
