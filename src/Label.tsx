interface LabelProps {
  text: string;
  hover: boolean;
}

// export default function Label({ text, hover }: LabelProps) {
//   return (
//     <div>
//       <p>{text}</p>
//       <p>{hover}</p>
//     </div>
//   );
// }

// Type <P> is used as type of `props` parameter of function Label(props) {}
export const Label: React.FC<LabelProps> = ({ text, hover }) => (
  <div>
    <p>{text}</p>
    <p>{hover}</p>
  </div>
);
