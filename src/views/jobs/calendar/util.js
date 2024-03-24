export const getQuarter = (date) => {
  const quarterStartMonth = Math.floor(date.getMonth() / 3) * 3;
  const quarterEndMonth = quarterStartMonth + 2;
  const quarterStartDate = new Date(date.getFullYear(), quarterStartMonth, 1);
  const quarterEndDate = new Date(date.getFullYear(), quarterEndMonth + 1, 0);
  const currentQuarter = Math.floor(date.getMonth() / 3) + 1;

  return {
    start: quarterStartDate,
    end: quarterEndDate,
    quarter: currentQuarter,
  };
};

export const getPrevNextMonth = (date) => {
  const coverDate = new Date(date);
  const currentMonth = coverDate.getMonth();
  const prev = new Date(coverDate.setMonth(currentMonth - 1));
  const next = new Date(coverDate.setMonth(currentMonth + 1));
  return {
    prev,
    today: new Date(),
    next,
  };
};

export const getPrevNextDay = (date) => {
  const aDayMillSeconds = 24 * 60 * 60 * 1000;
  const coverDate = new Date(date);
  const prev = new Date(coverDate.getTime() - aDayMillSeconds);
  const next = new Date(coverDate.getTime() + aDayMillSeconds);
  return {
    prev,
    today: new Date(),
    next,
  };
};

export const getPrevNextWeek = (date) => {
  const coverDate = new Date(date);
  const currentDate = new Date(date).getDate();
  const prev = new Date(
    coverDate.setDate(currentDate - 7)
  );
  const next = new Date(
    coverDate.setDate(currentDate + 7)
  );

  return {
    prev,
    today: new Date(),
    next,
  };
};

export const getPrevNextQuarter = (date) => {
  const { end: quarterEndMonth, start: quarteStartMonth } = getQuarter(date);

  const prev = new Date(
    quarteStartMonth.setMonth(quarteStartMonth.getMonth() - 3)
  );
  const next = new Date(
    quarterEndMonth.setMonth(quarterEndMonth.getMonth() + 1)
  );

  return {
    prev,
    today: new Date(),
    next,
  };
};

export const getPrevNextYear = (date) => {
  const coverDate = new Date(date);
  const currentYear = coverDate.getFullYear();
  const prev = new Date(coverDate.setFullYear(currentYear - 1));
  const next = new Date(coverDate.setFullYear(currentYear + 1));
  return {
    prev,
    today: new Date(),
    next,
  };
};

export const getCenterTitle = (selectView, date) => {
  if (selectView === "quarter") {
    const { start, end, quarter } = getQuarter(date);
    const startFormat = start.toLocaleString("zh-CN", {
      year: "numeric",
    });
    return `Q${quarter}季度 - ${startFormat}`;
  } else if (selectView === "dayGridMonth") {
    const startFormat = date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "long",
    });
    return startFormat;
  } else if (selectView === "dayGridWeek") {
    const firstDayOfWeek = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() - date.getDay() + 1
    );

    const lastDayOfWeek = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + (7 - date.getDay())
    );
    const startFormat = firstDayOfWeek.toLocaleString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const endFormat = lastDayOfWeek.toLocaleString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return `${startFormat} - ${endFormat}`;
  } else if (selectView === "dayGridDay") {
    const startFormat = date.toLocaleString("zh-CN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return startFormat;
  } else if (selectView === "multiMonthYear") {
    const startFormat = date.toLocaleString("zh-CN", {
      year: "numeric",
    });
    return startFormat;
  }
};

export const formatDate = (date, type) => {
  if (!date) return null;
  const coverDate = new Date(date);
  const year = coverDate.getFullYear();
  const month = String(coverDate.getMonth() + 1).padStart(2, "0");
  const day = String(coverDate.getDate()).padStart(2, "0");
  const hours = String(coverDate.getHours()).padStart(2, "0");
  const minutes = String(coverDate.getMinutes()).padStart(2, "0");
  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}`;
  const formattedDate = `${year}-${month}-${day}`;
  const formattedYearMonth = `${year}-${month}`;
  const formattedYear = `${year}`;
  const typeMap = {
    days: formattedDate,
    months: formattedYearMonth,
    year: formattedYear,
    time: formattedDateTime,
  };

  return typeMap[type];
};
