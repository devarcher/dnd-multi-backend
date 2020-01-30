import React from 'react';
import { useMultiDrop } from '../src/index.js';

const MultiBasket = () => {
  const [_, {html5: [html5Props, html5Drop], touch: [touchProps, touchDrop]}] = useMultiDrop({
    accept: 'card',
    drop: (item) => {
      const message = `Dropped: ${item.color}`;
      document.getElementById('console').innerHTML += `${message}<br />`;
    },
    collect: (monitor) => {
      return {
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      };
    },
  });

  const isOverHTML5 = html5Props.isOver;
  const canDropHTML5 = html5Props.canDrop;
  const styleHTML5 = {backgroundColor: (isOverHTML5 && canDropHTML5) ? '#f3f3f3' : '#bbbbbb', border: '1px dashed black'};

  const isOverTouch = touchProps.isOver;
  const canDropTouch = touchProps.canDrop;
  const styleTouch = {backgroundColor: (isOverTouch && canDropTouch) ? '#f3f3f3' : '#dddddd', border: '1px dashed black'};

  return (
    <div className="multi-square-container">
      <div className="multi-square" style={styleHTML5} ref={html5Drop} />
      <div className="multi-square" style={styleTouch} ref={touchDrop} />
    </div>
  );
};

export default MultiBasket;
