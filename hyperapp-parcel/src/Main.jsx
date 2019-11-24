import { h } from "hyperapp";
import Slider from './Slider';

function Main({ state, actions }) {

  const getValue = (key, time) => {
    return state.entries[key] ? state.entries[key][time] : ''
  }

  const getNoteValue = (key) => {
    return state.entries[key] ? state.entries[key].note : ''
  }

  const onNoteChange = (state, { key, note }) => {
    if (!state.entries[key]) {
      state.entries[key] = {};
    }
    const updatedEntry = {
      ...state.entries[key],
      note,
    };
    const updatedEntries = {
      ...state.entries,
      [key]: updatedEntry,
    }
    const updatedState = {
      ...state,
      entries: updatedEntries,
    }
    window.localStorage.setItem('entries', JSON.stringify(updatedEntries));
    return updatedState;
  }

  const sliderChanged = (state, value) => {
    console.log('state', state);
    console.log('value', value);
    return state;
  }

  const renderSlider = (id, timeOfDay) => {
    return <div className="row mb-4">
      <div className="col-md-3">
        <label htmlFor="exampleFormControlSelect1">{timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)}</label>
      </div>
      <div className="col-md-9">
        <Slider key={id + timeOfDay} state={state} min={0} max={10} value={0} step={1} onChange={sliderChanged} />
      </div>
    </div>
  }

  return (
    <div className="mt-4">
      {state.daysInMonth.map((day) => (
        <div key={day.id} className="card mb-4 shadow-sm">
          <div className="row">
            <div className="col-md-2 date">
              <h6 className="mb-3">
                {day.month}
              </h6>
              <h5>
                {day.dayNumber}
                {' '}
                {day.day}
              </h5>
            </div>

            <div className="col-md-6 entry">
              {renderSlider(day.id, 'morning')}
              {renderSlider(day.id, 'afternoon')}
              {renderSlider(day.id, 'night')}
            </div>

            <div className="col-md-4 entry">
              <h6>Notes</h6>
              <textarea
                value={getNoteValue(day.id)}
                onChange={[onNoteChange, e => ({ key: day.id, note: event.target.value })]} />
            </div>
          </div>
        </div>
      ))}

      <div className="text-center mt-4 mb-4">
        <h3>
          End of Entries...
        </h3>
      </div>

    </div>
  )
}

export default Main;