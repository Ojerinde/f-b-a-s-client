interface StudentDetailsProps {
  params: { matric_no: string };
}
const StudentDetails: React.FC<StudentDetailsProps> = ({ params }) => {
  const matricNo = params.matric_no.replace("_", "/");
  return <div>All details of student {matricNo} will be shown here</div>;
};
export default StudentDetails;
