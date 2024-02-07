<template>
  <Fullcalendar :options="config">
    <template #eventContent="{ timeText, event }">
      <i>{{ event.title }}</i>
    </template>
  </Fullcalendar>
</template>

<script>
import Fullcalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import multiMonthPlugin from "@fullcalendar/multimonth";

export default {
  name: "Calendar",
  props: ['eventData', 'onCellEventClick', 'dateChange'],
  data() {
    return {
      configOptions() {
        return {
          locale: 'zh',
          allDaySlot: false,
          plugins: [
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
            multiMonthPlugin
          ],
          initialView: "dayGridMonth",
          // views: {
          //   agendaFourDay: {
          //     type: "multiMonthYear",
          //     duration: { month: 3 },
          //     buttonText: "季度",
          //   },
          // },
          // views: {
          //   custom: {
          //     component: CustomView,
          //     buttonText: "自定义",
          //   },
          // },
          headerToolbar: {
            right: "prev,next today",
            center: "title",
            left: "multiMonthYear,dayGridMonth,dayGridWeek",
            // left: "custom",
          },
          buttonText: {
            today: '今天',
            month: '月',
            week: '周',
            year: '年'
          },
          events: this.testEvent,
          slotLabelFormat: () => '',
          datesSet: arg => {
            this.dateChange(arg)
          }
        }
      },
      eventHandlers() {
        return {
          eventClick: arg => this.onCellEventClick(arg.event),
          eventResize: this.onEventDrop,
          select: this.onDateSelect
        }
      },
      visible: false,
    }
  },
  components: { Fullcalendar },
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
    handleDateClick(arg) {
      /* Get click event data */
      console.log(arg)
      /* Get event data in store  */
      console.log(this.$store.state.events);
      const title = prompt("Please enter a title for your event");
      if (!title) {
        return undefined;
      }
    }
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

@media only screen and (max-width: 600px) {
  .card {
    width: 350px;
  }


}
</style>
