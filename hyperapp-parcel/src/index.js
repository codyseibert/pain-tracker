import { h, app } from "hyperapp";
import './index.css';
import Main from './Main'
import { onMouseMove, onMouseUp } from "@hyperapp/events"

const getDaysArray = function () {
  const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  const date = new Date();
  const year = date.getFullYear();
  const result = [];
  let curMonth = date.getMonth();
  let totalDays = 0;
  while (date.getFullYear() === year && totalDays < 60) {
    totalDays++;
    result.push({
      id: `${date.getYear()}-${date.getMonth()}-${date.getDate()}`,
      dayNumber: date.getDate(),
      day: names[date.getDay()],
      month: monthNames[date.getMonth()],
      year: date.getFullYear(),
    });
    date.setDate(date.getDate() - 1);

    if (date.getMonth() !== curMonth) {
      curMonth = date.getMonth();
    }
  }
  return result;
};

let sx = 0;

const MouseMoved = (state, { x }) => {
  const sx = state.position.sx;
  const ox = state.position.ox;
  const dx = x - sx;
  return { ...state, position: { sx, dx, x, ox } }
};

const MouseUp = (state, { x }) => {
  const ox = state.position.ox;
  const sx = state.position.sx;
  const dx = x - sx;
  const value = parseInt((dx + state.ex) / state.segmentWidth);
  return {
    ...state,
    value,
    isTracking: false,
    position: { sx, dx, x, ox }
  }
}

app({
  init: {
    entries: JSON.parse(window.localStorage.getItem('entries') || '{}'),
    daysInMonth: getDaysArray(),
    isTracking: false,
    value: 0,
    segmentWidth: 0,
    position: {
      y: 0,
    }
  },
  view: (state) =>
    <div class="container">
      {`${state.isTracking}`}
      <div class="row">
        <div class="col-md-2"></div>
        <div class="col-md-8 pt-4">
          <h1>Pain Tracker</h1>
          <Main state={state} />
        </div>
        <div class="col-md-2"></div>
      </div>
    </div>,
  subscriptions: state => [
    state.isTracking && onMouseMove(MouseMoved),
    state.isTracking && onMouseUp(MouseUp),
  ],
  node: document.getElementById("root")
})

