export interface Lecturer {
  _id: string;
  name: string;
}

export interface Course {
  _id: string;
  courseCode: string;
  courseName: string;
}

export interface Student {
  _id: string;
  name: string;
  attendancePercentage: number;
}

export interface Attendance {
  _id: string;
  date: string;
  studentsPresent: Array<{
    student: Student;
    time: string;
  }>;
}
