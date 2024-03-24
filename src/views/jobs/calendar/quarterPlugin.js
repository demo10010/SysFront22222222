import { createPlugin, sliceEvents } from "@fullcalendar/core";
import { formatDate } from "./util";

const QuarterViewPlugin = createPlugin({
  views: {
    quarter: {
      duration: { month: 3 },
      content: function (props, ...args) {
        let segs = sliceEvents(props, true);
        let container = document.createElement("div");
        container.className = 'quarter-view-event';

        let click = (seg) =>
          window.dispatchEvent(
            new CustomEvent("calendar-custom-view-event", {
              detail: seg,
            })
          );
        if (segs.length == 0) {
          container.innerHTML = `<div class="quarter-view-event-content-no-data">暂无数据</div>`;
        } else {
          segs.forEach(function (seg) {
            const { range, ui, def } = seg;
            let eventEl = document.createElement("div");
            eventEl.className = 'quarter-view-event-content';

            let html =
              `<a class="fc-event fc-event-start fc-daygrid-event fc-daygrid-block-event fc-h-event" 
              style="background:${ui.backgroundColor};border-color:${ui.borderColor}">` +
              def.title +
              "&nbsp;(" +
              formatDate(range.start, "days") +
              "&nbsp;-&nbsp;" +
              formatDate(range.end, "days") +
              ")" +
              "</a>";
            eventEl.innerHTML = html;

            eventEl.onclick = function (e) {
              click({ id: def.publicId, ...def.extendedProps });
            };
            container.appendChild(eventEl);
          });
        }
        return { domNodes: [container] };
      },
    },
  },
});

export default QuarterViewPlugin;
