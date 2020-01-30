import React from 'react';
import PropTypes from 'prop-types';
import { useMultiDrag } from '../src/index.js';

const MultiCard = (props) => {
  const [_, {html5: [html5Props, html5Drag], touch: [touchProps, touchDrag]}] = useMultiDrag({
    item: {type: 'card', color: props.color},
    collect: (monitor) => {
      return {
        isDragging: monitor.isDragging(),
      };
    },
  });

  const isDraggingHTML5 = html5Props.isDragging;
  const styleHTML5 = { backgroundColor: props.color, opacity: isDraggingHTML5 ? 0.5 : 1};

  const isDraggingTouch = touchProps.isDragging;
  const styleTouch = { backgroundColor: props.color, opacity: isDraggingTouch ? 0.5 : 1};

  return (
    <div className="multi-square-container">
      <div className="multi-square" style={styleHTML5} ref={html5Drag}>HTML5</div>
      <div className="multi-square" style={styleTouch} ref={touchDrag}>Touch</div>
    </div>
  );
};

MultiCard.propTypes = {
  color: PropTypes.string.isRequired,
};

export default MultiCard;
