import { h } from 'hyperapp';

const Fill = ({ cls, value }) => {
  const style = {
    position: 'absolute',
    left: 0,
    width: `${value}px`
  };

  return <div class={`${cls}__fill`} style={style} />;
};

export { Fill };
