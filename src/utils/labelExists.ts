import LabelDbData from '../types/LabelDbData';

export default function labelExists(label: string, db: LabelDbData[]) {
  return db.some(({ label_name }) => label_name === label);
}
