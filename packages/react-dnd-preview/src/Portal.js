import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Preview } from './Preview';

const Portal = ({container, ...props}) => {
  return ReactDOM.createPortal(
    Preview(props),
    container,
  );
};

Portal.propTypes = {
  container: PropTypes.any.isRequired,
  ...Preview.PropTypes,
};

export { Portal };
