<template>
  <div class="mt-4">
    <div v-for="day in this.daysInMonth" :key="day.id" class="card mb-4 shadow-sm">
      <div class="row">
        <div class="col-md-2 date">
          <h6 class="mb-3">{{day.month}}</h6>
          <h5>
            {{day.dayNumber}}
            {{' '}}
            {{day.day}}
          </h5>
        </div>

        <div class="col-md-6 pt-4">
          <pain-level
            :value="getValue(day.id, 'morning') + ''"
            label="Morning"
            @change="(value) => change(day.id, 'morning', parseInt(value, 10))"
          />

          <pain-level
            :value="getValue(day.id, 'afternoon') + ''"
            label="Afternoon"
            @change="(value) => change(day.id, 'afternoon', parseInt(value, 10))"
          />

          <pain-level
            :value="getValue(day.id, 'night') + ''"
            label="Night"
            @change="(value) => change(day.id, 'night', parseInt(value, 10))"
          />
        </div>

        <div class="col-md-4 entry">
          <h6>Notes</h6>
          <textarea
            :value="getNoteValue(day.id)"
            @input="(e) => onNoteChange(day.id, e.target.value)"
          />
        </div>
      </div>
    </div>

    <div class="text-center mt-4 mb-4">
      <h3>End of Entries...</h3>
    </div>
  </div>
</template>

<script>
import PainLevel from "./PainLevel";

const getDaysArray = function() {
  const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  const date = new Date();
  const year = date.getFullYear();
  const result = [];
  let curMonth = date.getMonth();
  let totalDays = 0;
  while (date.getFullYear() === year && totalDays < 30) {
    totalDays++;
    result.push({
      dayNumber: date.getDate(),
      day: names[date.getDay()],
      month: monthNames[date.getMonth()],
      year: date.getFullYear(),
      id: `${date.getYear()}-${date.getMonth()}-${date.getDate()}`
    });
    date.setDate(date.getDate() - 1);

    if (date.getMonth() !== curMonth) {
      curMonth = date.getMonth();
    }
  }
  return result;
};

// const daysInMonth = getDaysArray(2019, 11);

const entries = JSON.parse(window.localStorage.getItem("entries") || "{}");

function change(key, time, value) {
  if (!this.entries[key]) {
    this.entries[key] = {};
  }
  const updatedEntry = {
    ...this.entries[key],
    [time]: value
  };
  const updatedEntries = {
    ...entries,
    [key]: updatedEntry
  };
  this.entries = updatedEntries;
  window.localStorage.setItem("entries", JSON.stringify(updatedEntries));
}

function getValue(key, time) {
  return this.entries[key]
    ? this.entries[key][time]
      ? this.entries[key][time]
      : 0
    : 0;
}

function getNoteValue(key) {
  return this.entries[key] ? this.entries[key].note : "";
}

function onNoteChange(key, value) {
  if (!this.entries[key]) {
    this.entries[key] = {};
  }
  const updatedEntry = {
    ...this.entries[key],
    note: value
  };
  const updatedEntries = {
    ...this.entries,
    [key]: updatedEntry
  };
  this.entries = updatedEntries;
  window.localStorage.setItem("entries", JSON.stringify(updatedEntries));
}

export default {
  data: () => {
    return {
      entries: entries,
      daysInMonth: getDaysArray(2019, 11)
    };
  },
  methods: {
    onNoteChange,
    change,
    getValue,
    getNoteValue
  },
  components: {
    PainLevel
  }
};
</script>

<style>
textarea {
  height: 140px;
  width: 100%;
}

#container {
  width: 700px;
  margin: 0 auto;
}

.date-entry {
  border-top: 0;
}

.date {
  padding: 10px;
  border-right: 1px solid rgba(0, 0, 0, 0.125);
  text-align: center;
  background-color: #386fa4;
  background-color: #59a5d8;
  color: white;
  text-shadow: 1px 1px 2px #333;
  padding-top: 20px;
}

.entry {
  float: right;
  padding: 10px;
}

.row {
  margin-left: 0;
  margin-right: 0;
}

label {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>