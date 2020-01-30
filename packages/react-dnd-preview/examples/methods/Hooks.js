import React from 'react';
import Preview, { Context } from '../../src/index.js';
import { WithPropFunction, WithChildFunction, WithChildComponent, WithChildFunctionContext } from './common';

// TODO: finish
export const Hooks = ({title, col}) => ( // eslint-disable-line react/prop-types
  <>
    <Preview generator={WithPropFunction({title, col})} />
    <Preview>
      {WithChildFunction({title, col})}
    </Preview>
    <Preview>
      <WithChildComponent title={title} col={col} />
    </Preview>
    <Preview>
      <Context.Consumer>
        {WithChildFunctionContext({title, col})}
      </Context.Consumer>
    </Preview>
  </>
);
