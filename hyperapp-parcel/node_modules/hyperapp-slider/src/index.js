import { h } from 'hyperapp';
import { Handle } from './handle';
import { Track } from './track';
import { Fill } from './fill';

const { min, max, abs, round } = Math;

function isUndefined(v) {
  return typeof v === 'undefined';
}

function Slider({ baseClass, state, actions, onChange }) {
  const cls = !isUndefined(baseClass) ? baseClass : 'slider';

  return (
    <div
      class={cls}
      role="slider"
      aria-valuemin={state.min}
      aria-valuemax={state.max}
      aria-valuenow={state.value}
    >
      <Track cls={cls} setWidth={actions.setDomWidth} />
      <Fill cls={cls} value={state.dom.value} />
      <Handle
        cls={cls}
        min={state.min}
        max={state.max}
        value={state.dom.value}
        setMovementX={actions.setMovementX}
        setInitialMousePosition={actions.dom.setInitialMousePosition}
      />
    </div>
  );
}

Slider.state = function({ min, max, value, step }) {
  return {
    min,
    max,
    value,
    step: step || 1,
    dom: {
      width: 0,
      value: 0,
      mousePosition: 0
    }
  };
};

Slider.actions = {
  setValue: value => state => ({ value }),
  setMovementX: movementX => (state, actions) => {
    const mousePosition = state.dom.mousePosition + movementX;
    actions.dom.setMousePosition(mousePosition);

    const valueAtMousePosition =
      state.min + mousePosition / state.dom.width * (state.max - state.min);

    const clampedValueAtMousePosition = max(
      state.min,
      min(state.max, valueAtMousePosition)
    );

    if (state.step === 'any') {
      const newDomValue =
        (clampedValueAtMousePosition - state.min) /
        (state.max - state.min) *
        state.dom.width;
      actions.setValue(clampedValueAtMousePosition);
      actions.dom.setValue(newDomValue);
      return;
    }

    const valueDiff = clampedValueAtMousePosition - state.value;
    if (abs(valueDiff) >= state.step / 2) {
      const step = state.step * round(valueDiff / state.step);
      const newValue = state.value + step;
      const newDomValue =
        (newValue - state.min) / (state.max - state.min) * state.dom.width;

      if (newValue >= state.min && newValue <= state.max) {
        actions.setValue(newValue);
        actions.dom.setValue(newDomValue);
      }
    }
  },
  setDomWidth: width => (state, actions) => {
    const ratio = (state.value - state.min) / (state.max - state.min);
    const domValue = ratio * width;
    actions.dom.setWidth(width);
    actions.dom.setValue(domValue);
  },
  dom: {
    setWidth: width => state => ({ width }),
    setValue: value => state => ({ value }),
    setInitialMousePosition: () => state => ({ mousePosition: state.value }),
    setMousePosition: value => state => ({ mousePosition: value })
  }
};

export { Slider };
