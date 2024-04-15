"use client";

import { socket } from "@/app/dashboard/socket";
import { useEffect, useState } from "react";

interface StudentDetailsProps {
  params: { matric_no: string; course_code: string };
}
const StudentDetails: React.FC<StudentDetailsProps> = ({ params }) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const modifiedCourseCode = params?.course_code
    .replace("_", " ")
    .toUpperCase();

  const matricNo = params.matric_no.replace("_", "/");

  const handleDeleteEnrolledStudent = (
    courseCode: string,
    matricNo: string
  ) => {
    try {
      setIsDeleting(true);
      // Emit the event to the server
      socket.emit("delete_enrolled_students", { courseCode, matricNo });
      console.log("Delete Event emmitted");
    } catch (error) {
      console.error("Error emitting delete event:", error);
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    // Listen for attendance feedback from the server
    socket.on("delete_enrolled_students_feedback", (feedback) => {
      console.log("Delete Enrolled students feedback received:", feedback);
      setIsDeleting(false); // Set loading to false once feedback is received
      if (feedback.error) {
        console.error(
          "Error occurred during deletion of enrolled students",
          feedback.error
        );
      } else {
        console.log("Student deleted successfully");
      }
    });

    // Clean up event listener when component unmounts
    return () => {
      socket.off("delete_enrolled_students_feedback");
    };
  }, []);

  return (
    <div>
      All details of student {matricNo} will be shown here
      <button
        onClick={() =>
          handleDeleteEnrolledStudent(modifiedCourseCode, matricNo)
        }
      >
        {isDeleting ? "Deleting" : "Delete student"}
      </button>
    </div>
  );
};
export default StudentDetails;
