import React, { useState, useEffect } from 'react';
import DnDPreview, { Context } from 'react-dnd-preview';
import { PreviewManager } from 'dnd-multi-backend';

// TODO: match react-dnd-preview API
// TODO: rework PreviewManager through DndContext from 'react-dnd'
const Preview = (props) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const observer = {
      backendChanged: (backend) => {
        setEnabled(backend.previewEnabled());
      },
    };

    PreviewManager.register(observer);
    return () => {
      PreviewManager.unregister(observer);
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
