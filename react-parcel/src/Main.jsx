import React, { useState } from 'react';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';
import './App.css';

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
  while (date.getFullYear() === year && totalDays < 300) {
    totalDays++;
    result.push({
      dayNumber: date.getDate(),
      day: names[date.getDay()],
      month: monthNames[date.getMonth()],
      year: date.getFullYear(),
      id: `${date.getYear()}-${date.getMonth()}-${date.getDate()}`,
    });
    date.setDate(date.getDate() - 1);

    if (date.getMonth() !== curMonth) {
      curMonth = date.getMonth();
    }
  }
  return result;
};

function perc2color(perc) {
  var r, g, b = 0;
  if (perc < 50) {
    r = 255;
    g = Math.round(5.1 * perc);
  }
  else {
    g = 255;
    r = Math.round(510 - 5.10 * perc);
  }
  var h = r * 0x10000 + g * 0x100 + b * 0x1;
  return '#' + ('000000' + h.toString(16)).slice(-6);
}

const daysInMonth = getDaysArray(2019, 11);

function Main() {
  const [entries, setEntries] = useState(JSON.parse(window.localStorage.getItem('entries') || '{}'));

  const change = (key, time, value) => {
    if (!entries[key]) {
      entries[key] = {};
    }
    const updatedEntry = {
      ...entries[key],
      [time]: value,
    };
    const updatedEntries = {
      ...entries,
      [key]: updatedEntry,
    }
    setEntries(updatedEntries);
    window.localStorage.setItem('entries', JSON.stringify(updatedEntries));
  };

  const getValue = (key, time) => {
    return entries[key] ? entries[key][time] ? entries[key][time] : 0 : 0
  }

  const getNoteValue = (key) => {
    return entries[key] ? entries[key].note : ''
  }

  const onNoteChange = (key, value) => {
    if (!entries[key]) {
      entries[key] = {};
    }
    const updatedEntry = {
      ...entries[key],
      note: value,
    };
    const updatedEntries = {
      ...entries,
      [key]: updatedEntry,
    }
    setEntries(updatedEntries);
    window.localStorage.setItem('entries', JSON.stringify(updatedEntries));
  }

  const renderSlider = (id, timeOfDay) => {
    return <div className="row mb-2">
      <div className="col-md-3">

        <label htmlFor="exampleFormControlSelect1">{timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)}</label>
      </div>
      <div className="col-md-9">

        <Slider
          min={0}
          max={10}
          value={getValue(id, timeOfDay)}
          labels={{
            0: 'Low',
            5: 'Medium',
            10: 'High'
          }}
          handleLabel={getValue(id, timeOfDay) + ''}
          onChange={(value) => change(id, timeOfDay, parseInt(value, 10))}
        />
      </div>
    </div>
  }

  return (
    <div className="mt-4">
      {daysInMonth.map((day) => (
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
              <textarea value={getNoteValue(day.id)} onChange={(e) => onNoteChange(day.id, e.currentTarget.value)} />
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
  );
}

export default Main;
