import React, { useContext } from 'react';
import { DndProvider } from 'react-dnd';
import MultiBackend, { Preview } from '../src/index.js';
import HTML5toTouch from '../src/HTML5toTouch.js';

import Card from './Card';
import MultiCard from './MultiCard';
import Basket from './Basket';
import MultiBasket from './MultiBasket';

const GeneratePreview = () => {
  const {style, item} = useContext(Preview.Context);
  return <div style={{...style, backgroundColor: item.color, width: '50px', height: '50px'}}>Generated</div>;
};

const App = () => {
  return (
    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
      <Card color="#cc2211" />
      <Card color="#22cc11" />
      <Card color="#2211cc" />
      <Basket />
      <MultiCard color="#33ff77" />
      <MultiBasket />
      <Preview>
        <GeneratePreview />
      </Preview>
      <div id="console" />
    </DndProvider>
  );
};

export default App;
