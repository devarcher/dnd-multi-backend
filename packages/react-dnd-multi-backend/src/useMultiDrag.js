import { useDrag } from 'react-dnd';

// TODO: finish
export const useMultiDrag = (spec) => {
  const [collectedProps, drag] = useDrag(spec);
  const multiDrag = {};
  return [collectedProps, drag, multiDrag];
};
