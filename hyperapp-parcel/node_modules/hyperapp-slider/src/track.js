import { h } from 'hyperapp';

const Track = ({ cls, setWidth }) => (
  <div
    oncreate={el => setWidth(el.getBoundingClientRect().width)}
    class={`${cls}__track`}
  />
);

export { Track };
