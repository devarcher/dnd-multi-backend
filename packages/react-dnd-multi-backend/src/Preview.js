import React, { useState, useEffect, useContext } from 'react';
import DnDPreview, { Context } from 'react-dnd-preview';
import { DndContext } from 'react-dnd';

const Preview = (props) => {
  const [enabled, setEnabled] = useState(false);
  const dndContext = useContext(DndContext);

  useEffect(() => {
    const observer = {
      backendChanged: (backend) => {
        setEnabled(backend.previewEnabled());
      },
    };

    const previews = dndContext.dragDropManager.getBackend().previews;
    previews.register(observer);
    return () => {
      previews.unregister(observer);
    };
  });

  if (!enabled) {
    return null;
  }
  return <DnDPreview {...props} />;
};

Preview.Context = Context;
Preview.propTypes = DnDPreview.propTypes;

export default Preview;
