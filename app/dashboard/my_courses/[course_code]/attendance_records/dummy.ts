export const dummyData = [
  {
    _id: "6617d54efceef03b46c91b36",
    date: "2024-04-11T12:19:26.406Z",
    studentsPresent: [
      { id: 1, name: "Sonde Omobolaji", matricNo: "18/30GC081" },
      { id: 2, name: "Ogunlade Joshua", matricNo: "18/30GC055" },
      { id: 3, name: "Stephen Olaoke", matricNo: "18/30GC057" },
      { id: 4, name: "Adebisi Ayobami", matricNo: "19/30GC078" },
    ],
    course: "6617d2bd1d8ae1a688640bac",
    __v: 2,
  },
  {
    _id: "6617d5d85c460d451dc5dad9",
    date: "2024-04-10T12:21:44.467Z",
    studentsPresent: [
      { id: 5, name: "Ogunlade Joshua", matricNo: "18/30GC055" },
      { id: 6, name: "Ndife Joshua", matricNo: "18/30GC053" },
      { id: 7, name: "Mustapha Ahmad", matricNo: "18/30GC050" },
    ],
    course: "6617d2bd1d8ae1a688640bac",
    __v: 2,
  },

  {
    _id: "6617d5d85c460d451dc5dad0",
    date: "2024-04-09T12:21:44.467Z",
    studentsPresent: [
      { id: 8, name: "Sonde Omobolaji", matricNo: "18/30GC081" },
      { id: 9, name: "Ogunlade Joshua", matricNo: "18/30GC055" },
      { id: 10, name: "Ndife Joshua", matricNo: "18/30GC053" },
      { id: 11, name: "Mustapha Ahmad", matricNo: "18/30GC050" },
    ],
    course: "6617d2bd1d8ae1a688640bac",
    __v: 2,
  },
  {
    _id: "6617d5d85c460d451dc5dad1",
    date: "2024-04-08T12:21:44.467Z",
    studentsPresent: [
      { id: 12, name: "Sonde Omobolaji", matricNo: "18/30GC081" },
      { id: 13, name: "Ogunlade Joshua", matricNo: "18/30GC055" },
      { id: 14, name: "Ndife Joshua", matricNo: "18/30GC053" },
      { id: 15, name: "Mustapha Ahmad", matricNo: "18/30GC050" },
      { id: 16, name: "Stephen Olaoke", matricNo: "18/30GC057" },
      { id: 17, name: "Adebisi Ayobami", matricNo: "19/30GC078" },
    ],
    course: "6617d2bd1d8ae1a688640bac",
    __v: 2,
  },
  {
    _id: "6617d5d85c460d451dc5dad2",
    date: "2024-04-12T12:21:44.467Z",
    studentsPresent: [
      { id: 18, name: "Mustapha Ahmad", matricNo: "18/30GC050" },
      { id: 19, name: "Stephen Olaoke", matricNo: "18/30GC057" },
      { id: 20, name: "Adebisi Ayobami", matricNo: "19/30GC078" },
    ],
    course: "6617d2bd1d8ae1a688640bac",
    __v: 2,
  },
  {
    _id: "6617d5d85c460d451dc5dad1",
    date: "2024-04-13T12:21:44.467Z",
    studentsPresent: [
      { id: 21, name: "Sonde Omobolaji", matricNo: "18/30GC081" },
      { id: 22, name: "Ogunlade Joshua", matricNo: "18/30GC055" },
      { id: 23, name: "Ndife Joshua", matricNo: "18/30GC053" },
      { id: 24, name: "Mustapha Ahmad", matricNo: "18/30GC050" },
      { id: 25, name: "Stephen Olaoke", matricNo: "18/30GC057" },
      { id: 26, name: "Adebisi Ayobami", matricNo: "19/30GC078" },
    ],
    course: "6617d2bd1d8ae1a688640bac",
    __v: 2,
  },
  {
    _id: "6617d5d85c460d451dc5dad1",
    date: "2024-04-14T12:21:44.467Z",
    studentsPresent: [
      { id: 27, name: "Sonde Omobolaji", matricNo: "18/30GC081" },
      { id: 28, name: "Ogunlade Joshua", matricNo: "18/30GC055" },
      { id: 29, name: "Ndife Joshua", matricNo: "18/30GC053" },
      { id: 30, name: "Mustapha Ahmad", matricNo: "18/30GC050" },
      { id: 31, name: "Stephen Olaoke", matricNo: "18/30GC057" },
      { id: 32, name: "Adebisi Ayobami", matricNo: "19/30GC078" },
    ],
    course: "6617d2bd1d8ae1a688640bac",
    __v: 2,
  },
  {
    _id: "6617d5d85c460d451dc5dad1",
    date: "2024-04-15T12:21:44.467Z",
    studentsPresent: [
      { id: 33, name: "Sonde Omobolaji", matricNo: "18/30GC081" },
      { id: 34, name: "Ogunlade Joshua", matricNo: "18/30GC055" },
      { id: 35, name: "Ndife Joshua", matricNo: "18/30GC053" },
      { id: 36, name: "Mustapha Ahmad", matricNo: "18/30GC050" },
      { id: 37, name: "Stephen Olaoke", matricNo: "18/30GC057" },
      { id: 38, name: "Adebisi Ayobami", matricNo: "19/30GC078" },
    ],
    course: "6617d2bd1d8ae1a688640bac",
    __v: 2,
  },
];

interface MyObject {
  _id: string;
  date: string;
  studentsPresent: any[]; // Change this to the type of studentsPresent array
  course: string;
  __v: number;
}

export function sortByDate(objects: MyObject[]): MyObject[] {
  return objects.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });
}
