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

  if (laChecked) {
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
    const emailName = email?.split("@")[0];
    console.log("emailName: ", emailName);

    await new Email({
      email: email,
      name: [emailName, ""],
    }).sendCourseReportFile(
      courseCode,
      belowOrEqualFiftyPercent,
      aboveFiftyPercent
    );
  }
  if (studentsChecked) {
    [...aboveFiftyPercent, ...belowOrEqualFiftyPercent].map(
      async (student: any) => {
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
