import objectAssign from './objectAssign';

class PreviewList {
  constructor() {
    this.previews = [];
  }

  register = (preview) => {
    this.previews.push(preview);
  }

  unregister = (preview) => {
    let index;
    while ((index = this.previews.indexOf(preview)) !== -1) {
      this.previews.splice(index, 1);
    }
  }

  backendChanged = (backend) => {
    for (const preview of this.previews) {
      preview.backendChanged(backend);
    }
  }
}

export default class {
  constructor(manager, context, sourceOptions) {
    const options = objectAssign({backends: []}, sourceOptions || {});

    if (options.backends.length < 1) {
      throw new Error(
        `You must specify at least one Backend, if you are coming from 2.x.x (or don't understand this error)
        see this guide: https://github.com/louisbrunner/dnd-multi-backend/tree/master/packages/react-dnd-multi-backend#migrating-from-2xx`
      );
    }

    this.current = null;

    this.backends = {};
    this.backendsList = [];
    options.backends.forEach((backend) => {
      if (!backend.id) {
        throw new Error(
          `You must specify an 'id' property in your Backend entry: ${backend}
          see this guide: https://github.com/louisbrunner/dnd-multi-backend/tree/master/packages/react-dnd-multi-backend#migrating-from-4xx`
        );
      }
      if (this.backends[backend.id]) {
        throw new Error(`You must specify a unique 'id' property in your Backend entry: ${backend} (conflicts with: ${this.backends[backend.id]})`);
      }
      if (!backend.backend) {
        throw new Error(`You must specify a 'backend' property in your Backend entry: ${backend}`);
      }
      const transition = backend.transition;
      if (transition && !transition._isMBTransition) {
        throw new Error(
          `You must specify a valid 'transition' property (either undefined or the return of 'createTransition') in your Backend entry: ${backend}`
        );
      }
      if (this.current === null) {
        this.current = backend.id;
      }
      const backendRecord = ({
        id: backend.id,
        instance: backend.backend(manager, context, backend.options),
        preview: (backend.preview || false),
        transition,
        skipDispatchOnTransition: Boolean(backend.skipDispatchOnTransition),
      });
      this.backends[backend.id] = backendRecord;
      this.backendsList.push(backendRecord);
    });

    this.nodes = {};

    this.previews = new PreviewList();
  }

  // DnD Backend API
  setup = () => {
    if (typeof window === 'undefined') {
      return;
    }

    if (this.constructor.isSetUp) {
      throw new Error('Cannot have two MultiBackends at the same time.');
    }
    this.constructor.isSetUp = true;
    this.addEventListeners(window);
    this.backends[this.current].instance.setup();
  }

  teardown = () => {
    if (typeof window === 'undefined') {
      return;
    }

    this.constructor.isSetUp = false;
    this.removeEventListeners(window);
    this.backends[this.current].instance.teardown();
  }

  connectDragSource = (...args) => {
    return this.connectBackend('connectDragSource', args);
  }
  connectDragPreview = (...args) => {
    return this.connectBackend('connectDragPreview', args);
  }
  connectDropTarget = (...args) => {
    return this.connectBackend('connectDropTarget', args);
  }

  // Used by Preview component
  previewEnabled = () => {
    return this.backends[this.current].preview;
  }

  // Multi Backend Listeners
  addEventListeners = (target) => {
    this.backendsList.forEach((backend) => {
      if (backend.transition) {
        target.addEventListener(backend.transition.event, this.backendSwitcher, true);
      }
    });
  }

  removeEventListeners = (target) => {
    this.backendsList.forEach((backend) => {
      if (backend.transition) {
        target.removeEventListener(backend.transition.event, this.backendSwitcher, true);
      }
    });
  }

  // Switching logic
  backendSwitcher = (event) => {
    const oldBackend = this.current;

    this.backendsList.some((backend) => {
      if (backend.id !== this.current && backend.transition && backend.transition.check(event)) {
        this.current = backend.id;
        return true;
      }
      return false;
    });

    if (this.current !== oldBackend) {
      this.backends[oldBackend].instance.teardown();
      Object.keys(this.nodes).forEach((id) => {
        const node = this.nodes[id];
        node.handler();
        node.handler = this.callBackend(node.func, node.args);
      });
      this.previews.backendChanged(this);

      const newBackend = this.backends[this.current];
      newBackend.instance.setup();

      if (newBackend.skipDispatchOnTransition) {
        return;
      }

      let newEvent = null;
      try {
        newEvent = new event.constructor(event.type, event);
      } catch (_e) {
        newEvent = document.createEvent('Event');
        newEvent.initEvent(event.type, event.bubbles, event.cancelable);
      }
      event.target.dispatchEvent(newEvent);
    }
  }

  callBackend = (func, args) => {
    return this.backends[this.current].instance[func](...args);
  }

  connectBackend = (func, args) => {
    const nodeId = `${func}_${args[0]}`;
    const handler = this.callBackend(func, args);
    this.nodes[nodeId] = {func, args, handler};

    return (...subArgs) => {
      const r = this.nodes[nodeId].handler(...subArgs);
      delete this.nodes[nodeId];
      return r;
    };
  }
}
