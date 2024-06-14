import { Student } from "@/store/archived/ArchivedSlice";

interface MyObject {
  _id: string;
  date: string;
  studentsPresent: Array<{
    student: Student;
    time: string;
  }>;
}

export function sortByDate(objects: MyObject[]): MyObject[] {
  // Create a shallow copy of the array to ensure mutability
  const mutableObjects = objects.slice();

  return mutableObjects.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });
}
export function compareTimes(a: any, b: any) {
  const timeA = new Date(a.time).getTime();
  const timeB = new Date(b.time).getTime();
  return timeA - timeB;
}

export function formatTimeFromISOString(isoString: string) {
  const date = new Date(isoString);
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}
