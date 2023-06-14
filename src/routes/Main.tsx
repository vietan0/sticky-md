import { ReactMarkdown as Md } from 'react-markdown/lib/react-markdown';
import remarkGfm from 'remark-gfm';

export default function Main() {
  return (
    <main className="p-8">
      <Md remarkPlugins={[remarkGfm]}>## Just a link: [React](https://reactjs.com)</Md>
      <Md remarkPlugins={[remarkGfm]}>Test strikethrough: ~~completed~~</Md>
    </main>
  );
}
