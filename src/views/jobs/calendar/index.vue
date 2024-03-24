<template>
  <div>
    <div class="calendar-header">
      <el-button-group>
        <el-button @click="changeView('multiMonthYear')" size="medium"
          :type="selectView == 'multiMonthYear' ? 'primary' : 'undefined'">年</el-button>
        <el-button @click="changeView('quarter')" :type="selectView == 'quarter' ? 'primary' : 'undefined'">季</el-button>
        <el-button @click="changeView('dayGridMonth')"
          :type="selectView == 'dayGridMonth' ? 'primary' : 'undefined'">月</el-button>
        <el-button @click="changeView('dayGridWeek')"
          :type="selectView == 'dayGridWeek' ? 'primary' : 'undefined'">周</el-button>
      </el-button-group>
      <h2>{{ getTitle() }}</h2>
      <div>
        <el-button-group>
          <el-button @click="toggleAction('prev')" icon="el-icon-arrow-left"></el-button>
          <el-button @click="toggleAction('next')" icon="el-icon-arrow-right"></el-button>
        </el-button-group>
        <el-button @click="toggleAction('today')" style="margin-left: 8px;">今天</el-button>
      </div>
    </div>
    <Fullcalendar :options="config" ref="fullCalendar">
      <template #eventContent="{ timeText, event }">
        <i>{{ event.title }}</i>
      </template>
    </Fullcalendar>
  </div>
</template>

<script>
import Fullcalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import multiMonthPlugin from "@fullcalendar/multimonth";
import QuarterViewPlugin from "./quarterPlugin";
import {
  getPrevNextMonth,
  getPrevNextDay,
  getPrevNextWeek,
  getPrevNextQuarter,
  getPrevNextYear,
  getQuarter,
  getCenterTitle,
} from "./util";


export default {
  name: "Calendar",
  props: ['eventData', 'onCellEventClick', 'dateChange'],
  data() {
    return {
      selectEvent: null,
      initialDate: new Date(),
      currentDate: new Date(),
      vieMap: {
        quarter: getPrevNextQuarter,
        dayGridMonth: getPrevNextMonth,
        dayGridWeek: getPrevNextWeek,
        dayGridDay: getPrevNextDay,
        multiMonthYear: getPrevNextYear,
      },
      selectAction: "today",
      selectView: "dayGridMonth",
      configOptions() {
        return {
          locale: 'zh',
          allDaySlot: false,
          firstDay: 1,
          plugins: [
            dayGridPlugin,
            timeGridPlugin,
            multiMonthPlugin,
            interactionPlugin,
            QuarterViewPlugin,
          ],
          initialView: "dayGridMonth",
          initialDate: this.initialDate,
          headerToolbar: false,
          // headerToolbar: {
          //   right: "prev,next today",
          //   center: "title",
          //   left: "multiMonthYear,dayGridMonth,dayGridWeek",
          // },
          events: this.testEvent,
          slotLabelFormat: () => '',
        }
      },
      eventHandlers() {
        return {
          eventClick: arg => this.onCellEventClick(arg.event),
        }
      },
      visible: false,
    }
  },
  components: { Fullcalendar },
  mounted: function () {
    window.addEventListener(
      "calendar-custom-view-event",
      this.customViewEvent,
      true
    );
    this.changeView('dayGridMonth');
  },
  computed: {
    config() {
      return {
        ...this.configOptions(),
        ...this.eventHandlers()
      }
    },
    testEvent() {
      return this.eventData;
    }
  },
  methods: {
    customViewEvent: function (e) {
      e.stopPropagation();
      e.stopImmediatePropagation();
      if (e.target == e.currentTarget) {
        this.onCellEventClick(e.detail)
      }
    },
    removeCustomViewEvent: function () {
      window.removeEventListener(
        "calendar-custom-view-event",
        this.customViewEvent
      );
    },
    getCurrentDateRange(view, range) {
      const { start, end: basicEnd } = range;
      if (view === 'quarter') {
        return { ...getQuarter(start) };
      }
      const endDays = new Date(basicEnd).getDate();
      const newEndDate = new Date(basicEnd);
      const end = new Date(newEndDate.setDate(endDays - 1));
      return {
        start, end
      }
    },
    handleRequestChange() {
      const calendarApi = this.$refs.fullCalendar.getApi();
      const view = calendarApi.view.type;
      const range = calendarApi.currentData.dateProfile.currentRange;
      this.dateChange({ view, ...this.getCurrentDateRange(view, range) });
    },
    toggleAction(arg) {
      this.selectAction = arg;
      const calendarApi = this.$refs.fullCalendar.getApi();
      const viewType = calendarApi.view.type;
      const value = this.vieMap[viewType](this.currentDate)[arg];
      this.currentDate = value;
      calendarApi.gotoDate(value);
      this.handleRequestChange();
    },
    changeView(viewName) {
      this.$refs.fullCalendar.getApi().changeView(viewName);
      this.selectView = viewName;
      this.handleRequestChange();
    },
    getTitle() {
      return getCenterTitle(this.selectView, this.currentDate);
    },
  }
}
</script>

<style lang="scss">
.fc .fc-timegrid-slot-label {
  display: none;
}

.fc .fc-button-group>.fc-button,
.fc .fc-button {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff !important;
  border: 1px solid #dcdfe6 !important;
  color: #606266 !important;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  margin: 0;
  transition: .1s;
  font-weight: 500;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
  height: 40px;
  display: inline-flex;
  align-items: center;
}

.fc .fc-button-primary:not(:disabled).fc-button-active,
.fc .fc-button-primary:not(:disabled):active {
  color: #fff !important;
  background-color: #409eff !important;
  border-color: #409eff !important;
}

.fc .fc-button-primary:focus,
.fc .fc-button-primary:not(:disabled).fc-button-active:focus,
.fc .fc-button-primary:not(:disabled):active:focus {
  box-shadow: none;
}

.fc-daygrid-event {
  border-radius: 40px;
  padding-left: 4px;
  padding-right: 4px;
  color: #fff;
}

.fc-daygrid-event:hover {
  color: #fff;
  opacity: 0.8;
}

.fc-daygrid-more-link.fc-more-link {
  border-color: #d1d1d1 !important;
}

.card {
  width: 100%;

  .card-body {
    width: 100%;

    a {
      text-decoration: none;
      color: #2c3e50;
    }
  }
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.quarter-view-event-content+.quarter-view-event-content {
  margin-top: 8px;
}

.quarter-view-event {
  height: 100%;
}

.quarter-view-event-content-no-data {
  height: 100%;
  width: 100%;
  padding-top: 80px;
  display: flex;
  justify-content: center;
}

@media only screen and (max-width: 600px) {
  .card {
    width: 350px;
  }


}
</style>
