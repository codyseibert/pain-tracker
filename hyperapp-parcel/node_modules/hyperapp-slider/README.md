# hyperapp-slider

Slider/range component for [Hyperapp](https://github.com/hyperapp/hyperapp).

## Installation

`npm install --save hyperapp-slider`

## Usage

```jsx
import { h, app } from 'hyperapp';
import { Slider } from 'hyperapp-slider';

const state = {
    mySlider: Slider.state({min: 0, max: 100, value: 50, step: 1})
};

const actions = {
    mySlider: Slider.actions
};

const view = (state, actions) => (
    <div>
        <div>Value: {state.mySlider.value}</div>
        <Slider state={state.mySlider} actions={actions.mySlider} />
    </div>
);

app(state, actions, view, document.body);
```

There is no default styling. You can style based on the classes `.slider`, `.slider__track`, `slider__fill` and `.slider__handle`. Alternatively, you can passe your own "base" class with `baseClass="my-slider"` and get `.my-slider`, `.my-slider__track`, `my-slider__fill` and `.my-slider__handle`.

See `example/index.html` and `example/index.js` for a working example.

**NOTE:** don’t update values owned by hyperapp-slider manually, things will get out of sync.

## Configuration

The slider is configured through the `Slider.state` function. It returns your configured state for the slider, and should be put in your global state object. It accepts the following properties.

| Property | Type       | Mandatory | Default | Explanation       |
|----------|------------|-----------|---------|-------------------|
| `min`    | Int        | Yes       |         | The minimum value |
| `max`    | Int        | Yes       |         | The maximum value |
| `value`  | Int        | Yes       |         | The initial value |
| `step`   | Int/String | No        | 1       | The value added or subtracted to `value` per tick. Set to a number for a discrete slider, or `'any'` for a continuous slider |

## Development

- `npm i`
- `npm run watch`
- `open http://localhost:1234`

