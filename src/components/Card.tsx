import { ReactMarkdown as Md } from 'react-markdown/lib/react-markdown';
import remarkGfm from 'remark-gfm';

export default function Card() {
  const mdContent = `Test strikethrough: ~~done~~`;

  return (
    <div className="card h-60 w-72 whitespace-pre-line rounded-lg p-4 outline outline-1 outline-slate-700">
      <Md remarkPlugins={[remarkGfm]}>{mdContent}</Md>
    </div>
  );
}
