const generateSlots = (
  startTime,

  endTime,

  slotDuration,

  breakStartTime,

  breakEndTime,
) => {
  const slots = [];

  /*
    |--------------------------------------------------------------------------
    | Convert Time To Minutes
    |--------------------------------------------------------------------------
    */
  const convertToMinutes = (time) => {
    const [hours, minutes] = time.split(":");

    return parseInt(hours) * 60 + parseInt(minutes);
  };

  /*
    |--------------------------------------------------------------------------
    | Convert Minutes To Time
    |--------------------------------------------------------------------------
    */
  const convertToTime = (minutes) => {
    const hrs = Math.floor(minutes / 60);

    const mins = minutes % 60;

    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
  };

  /*
    |--------------------------------------------------------------------------
    | Time Values
    |--------------------------------------------------------------------------
    */
  let currentTime = convertToMinutes(startTime);

  const end = convertToMinutes(endTime);

  const breakStart = breakStartTime ? convertToMinutes(breakStartTime) : null;

  const breakEnd = breakEndTime ? convertToMinutes(breakEndTime) : null;

  /*
    |--------------------------------------------------------------------------
    | Generate Slots
    |--------------------------------------------------------------------------
    */
  while (currentTime < end) {
    /*
        |--------------------------------------------------------------------------
        | Skip Break Time
        |--------------------------------------------------------------------------
        */
    if (
      breakStart !== null &&
      breakEnd !== null &&
      currentTime >= breakStart &&
      currentTime < breakEnd
    ) {
      currentTime = breakEnd;

      continue;
    }

    slots.push(convertToTime(currentTime));

    currentTime += slotDuration;
  }

  return slots;
};

module.exports = generateSlots;
