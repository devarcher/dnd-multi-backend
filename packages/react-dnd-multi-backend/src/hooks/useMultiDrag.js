import { useContext } from 'react';
import { useDrag } from 'react-dnd';
import { DndContext } from 'react-dnd';

// TODO: finish
export const useMultiDrag = (spec) => {
  const [collectedProps, drag, preview] = useDrag(spec);
  const dndContext = useContext(DndContext);
  const multiDrag = {};
  return [[collectedProps, drag, preview], multiDrag];
};
