import React, { useRef } from 'react';
import { Context, Portal } from '../../src/index.js';
import { WithPropFunction, WithChildFunction, WithChildComponent, WithChildFunctionContext } from './common';

const lazyInit = () => {
  return document.createElement('div');
};

export const PortalComponents = ({title, col}) => { // eslint-disable-line react/prop-types
  const ref1 = useRef(lazyInit);
  const ref2 = useRef(lazyInit);
  const ref3 = useRef(lazyInit);
  const ref4 = useRef(lazyInit);

  return (
    <>
      {/* <div ref={ref1} /> */}
      <Portal container={ref1.current} generator={WithPropFunction({title, col})} />

      {/* <div ref={ref2} /> */}
      <Portal container={ref2.current}>
        {WithChildFunction({title, col})}
      </Portal>

      {/* <div ref={ref3} /> */}
      <Portal container={ref3.current}>
        <WithChildComponent title={title} col={col} />
      </Portal>

      {/* <div ref={ref4} /> */}
      <Portal container={ref4.current}>
        <Context.Consumer>
          {WithChildFunctionContext({title, col})}
        </Context.Consumer>
      </Portal>
    </>
  );
};
