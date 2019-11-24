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
  let id = 0;
  let curMonth = date.getMonth();
  let totalDays = 0;
  while (date.getFullYear() === year && totalDays < 60) {
    totalDays++;
    result.push({
      id,
      dayNumber: date.getDate(),
      day: names[date.getDay()],
      month: monthNames[date.getMonth()],
      year: date.getFullYear(),
    });
    id += 1;
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
    return entries[key] ? entries[key][time] : ''
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

  return (
    <div className="mt-4">
      {daysInMonth.map((day) => (
        <div key={day.id} className="card mb-4 shadow-sm">
          <div className="row">
            <div className="col-md-2 date"
              style={{ backgroundColor: perc2color(100 - getValue(day.id, 'morning') * 10) }}
            >
              <h6 className="mb-3">
                {day.month}
              </h6>
              <h5>
                {day.dayNumber}
                {' '}
                {day.day}
              </h5>
            </div>

            {/* <div className="col-md-2 entry">
              <div className="form-group">
                <label htmlFor="exampleFormControlSelect1">Morning</label>
                <select
                  className="form-control"
                  id="exampleFormControlSelect1"
                  onChange={(e) => change(day.id, 'morning', parseInt(e.currentTarget.value, 10))}
                  value={getValue(day.id, 'morning')}
                  style={{ color: perc2color(100 - getValue(day.id, 'morning') * 10) }}
                >
                  <option>-- Select --</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                  <option>7</option>
                  <option>8</option>
                  <option>9</option>
                  <option>10</option>
                </select>
              </div>
            </div> */}

            <div className="col-md-6 entry">
              {/* <div className="form-group">
                <label htmlFor="exampleFormControlSelect1">Afternoon</label>
                <select
                  className="form-control"
                  id="exampleFormControlSelect1"
                  onChange={(e) => change(day.id, 'afternoon', parseInt(e.currentTarget.value, 10))}
                  value={getValue(day.id, 'afternoon')}
                  style={{ color: perc2color(100 - getValue(day.id, 'afternoon') * 10) }}
                >
                  <option>-- Select --</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                  <option>7</option>
                  <option>8</option>
                  <option>9</option>
                  <option>10</option>
                </select>
              </div> */}
              <div className="form-group">
                <label htmlFor="exampleFormControlSelect1">Pain Scale</label>

                <Slider
                  min={0}
                  max={10}
                  value={getValue(day.id, 'morning')}
                  labels={{
                    0: 'Low',
                    5: 'Medium',
                    10: 'High'
                  }}
                  handleLabel={getValue(day.id, 'morning')}
                  onChange={(value) => change(day.id, 'morning', parseInt(value, 10))}
                />
              </div>
            </div>

            {/* <div className="col-md-2 entry">
              <div className="form-group">
                <label htmlFor="exampleFormControlSelect1">Night</label>
                <select
                  className="form-control"
                  id="exampleFormControlSelect1"
                  onChange={(e) => change(day.id, 'night', parseInt(e.currentTarget.value, 10))}
                  value={getValue(day.id, 'night')}
                  style={{ color: perc2color(100 - getValue(day.id, 'night') * 10) }}
                >
                  <option>-- Select --</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                  <option>7</option>
                  <option>8</option>
                  <option>9</option>
                  <option>10</option>
                </select>
              </div>
            </div> */}

            <div className="col-md-4 entry">
              <h6>Notes</h6>
              <textarea value={getNoteValue(day.id)} onChange={(e) => onNoteChange(day.id, e.currentTarget.value)} />
            </div>
          </div>
        </div>
      ))}

    </div>
  );
}

export default Main;
