import React, { useState } from 'react';
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
  while (date.getFullYear() === year) {
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
      result.push({
        id,
        month: monthNames[date.getMonth()],
        isDivider: true,
      });
      id += 1;
    }
  }
  return result;
};

function heatMapColorforValue(value) {
  const h = (1.0 - value / 10) * 240;
  return `hsl(${h}, 100%, 50%)`;
}

const daysInMonth = getDaysArray(2019, 11);

function Main() {
  const [entries, setEntries] = useState(JSON.parse(window.localStorage.getItem('entries') || '{}'));

  const change = (key, value) => {
    const updatedEntries = {
      ...entries,
      [key]: value,
    };

    setEntries(updatedEntries);
    window.localStorage.setItem('entries', JSON.stringify(updatedEntries));
  };

  return (
    <div className="container">
      {daysInMonth.map((day) => (
        <div key={day.id} className="card mb-4">
          <div className="row">
            <div className="col-md-2 date" style={{ backgroundColor: heatMapColorforValue(entries[day.id]) }}>
              <h6 className="mb-3">
                {day.month}
              </h6>
              <h5>
                {day.dayNumber}
                {' '}
                {day.day}
              </h5>
            </div>

            <div className="col-md-2 entry">
              <div className="form-group">
                <label htmlFor="exampleFormControlSelect1">Pain</label>
                <select
                  className="form-control"
                  id="exampleFormControlSelect1"
                  onChange={(e) => change(day.id, parseInt(e.currentTarget.value, 10))}
                  value={entries[day.id]}
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
            </div>

            <div className="col-md-8 entry">
              <h6>Notes:</h6>
              <textarea />
            </div>
          </div>
        </div>
      ))}

    </div>
  );
}

export default Main;
