import Email from "@/utils/email";

export async function POST(request: Request) {
  const {
    laChecked,
    lecturerChecked,
    studentsChecked,
    email,
    data: {
      levelAdviser,
      lecturer,
      courseCode,
      aboveFiftyPercent,
      belowOrEqualFiftyPercent,
    },
  } = await request.json();

  if (laChecked && levelAdviser) {
    await new Email(levelAdviser).sendCourseReportFile(
      courseCode,
      belowOrEqualFiftyPercent,
      aboveFiftyPercent
    );
  }
  if (lecturerChecked) {
    await new Email(lecturer).sendCourseReportFile(
      courseCode,
      belowOrEqualFiftyPercent,
      aboveFiftyPercent
    );
  }
  if (email) {
    const emailName = email.slice(0, 4);

    await new Email({
      email: email,
      name: `${emailName}... ...`,
    }).sendCourseReportFile(
      courseCode,
      belowOrEqualFiftyPercent,
      aboveFiftyPercent
    );
  }
  if (studentsChecked) {
    console.log("Student is checked");
    [...aboveFiftyPercent, ...belowOrEqualFiftyPercent].map(
      async (student: any) => {
        console.log("Student ", student.student.email);
        await new Email(student.student).sendStudentCourseReport(
          courseCode,
          student.attendancePercentage
        );
      }
    );
  }

  // Send email to all students
  return Response.json({ message: "Email sent successfully" });
}
