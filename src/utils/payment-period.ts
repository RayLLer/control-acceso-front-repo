import dayjs from "dayjs";

export const isPeriodActive = (periodStr: string | null | undefined): boolean => {
  if (!periodStr || typeof periodStr !== "string") return false;

  const parts = periodStr.trim().split("::");
  if (parts.length !== 2) return false;

  const todayDay = dayjs().startOf("day");
  const fechaInicioDay = dayjs(parts[0].trim(), "DD/MM/YYYY").startOf("day");
  const fechaFinDay = dayjs(parts[1].trim(), "DD/MM/YYYY").startOf("day");

  console.log("Checking period:", { todayDay, fechaInicioDay, fechaFinDay });
  return (
    (todayDay.isAfter(fechaInicioDay) || todayDay.isSame(fechaInicioDay)) &&
    (todayDay.isBefore(fechaFinDay) || todayDay.isSame(fechaFinDay))
  );
};
