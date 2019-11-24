import { h } from "hyperapp";

function Slider({ state, min, max, value, step, key, onChange }) {
  const onDragStart = (state, { target, x }) => {
    const ox = x - target.getBoundingClientRect().left + (target.getBoundingClientRect().right - target.getBoundingClientRect().left) / 2;
    const width = target.parentElement.getBoundingClientRect().right - target.parentElement.getBoundingClientRect().left;
    const dx = x - target.parentElement.getBoundingClientRect().left;
    const segmentWidth = width / (max / step - min + 1);
    const ex = (target.getBoundingClientRect().right - target.getBoundingClientRect().left) / 2;
    return {
      ...state,
      isTracking: key,
      ex,
      segmentWidth,
      position: { sx: x, dx, x, ox }
    }
  }

  const getLeft = () => {
    if (state.isTracking === key) {
      return `${state.position.dx + state.position.ox}px`;
    } else {
      return `${state.segmentWidth * state.value}px`;
    }
  }

  const points = new Array(max / step - min + 1).fill(null).map((_, i) => i * step + min);

  return (
    <div style={{ height: '20px' }}>
      <div onMouseDown={onDragStart}
        style={{
          cursor: 'pointer',
          borderRadius: '50%',
          backgroundColor: 'orange',
          height: '15px',
          width: '15px',
          left: getLeft(),
          position: state.isTracking === key ? 'absolute' : 'relative'
        }}>
      </div>
      <div style={{ borderBottom: '1px solid black' }}></div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {points.map(point => (
          <div style={{ display: 'inline-block' }}>{point}</div>
        ))}
      </div>
    </div>
  )
}

export default Slider;