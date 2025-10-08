import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Pagination,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import {
  AssignmentReview,
  StudentAssignmentList,
  StudentListAPI,
} from "../../MainService";
import Loader from "../../component/Loader";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { SelectField, InputField } from "../../component/CustomField";

const validationSchema = Yup.object().shape({
  totalMarks: Yup.number().required("Total marks required"),
  marksObtained: Yup.number()
    .required("Marks obtained required")
    .max(Yup.ref("totalMarks"), "Marks cannot exceed total marks"),
});

const StudentList = () => {
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const { assignment } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [assignmentDeatials, setAssignmentDetails] = useState({});

  const fetchStudentList = () => {
    setLoading(true);
    const payload = {
      page,
      limit,
      position: "student",
      assignmentId: assignment._id,
    };
    StudentListAPI(payload)
      .then((res) => {
        setStudents(res.data || []);
        setTotalPages(res.totalPages || 1);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar(error.message || "Failed to fetch students", {
          variant: "error",
        });
      });
  };

  useEffect(() => {
    fetchStudentList();
  }, [page]);

  const handleViewStudent = (student) => {
    setLoading(true);
    StudentAssignmentList(assignment._id, student._id)
      .then((res) => {
        setAssignmentDetails(res.data || {});
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar(error.message || "Failed to fetch students", {
          variant: "error",
        });
      });
    setCurrentStudent(student);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentStudent(null);
  };

  const handleSubmitReview = (values) => {
    // let payload={submissionId:}
    AssignmentReview(currentStudent.id)
      .then(() => {
        enqueueSnackbar("Review submitted successfully", {
          variant: "success",
        });
        handleCloseDialog();
      })
      .catch((error) => {
        enqueueSnackbar(error.message || "Failed to submit review", {
          variant: "error",
        });
      });
  };

  return (
    <Box sx={{ p: 3 }}>
      {loading && <Loader />}

      <h2>Students for {assignment?.title || "Assignment"}</h2>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Completed</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.length > 0 ? (
              students.map((s) => (
                <TableRow key={s._id}>
                  <TableCell>{s.name}</TableCell>
                  <TableCell>{s.email}</TableCell>
                  <TableCell>{s.isCompleted ? "Yes" : "No"}</TableCell>
                  <TableCell align="center">
                    {s.isCompleted && (
                      <Button
                        variant="contained"
                        onClick={() => handleViewStudent(s)}
                      >
                        Review
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No students found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, newPage) => setPage(newPage)}
          color="primary"
          shape="rounded"
        />
      </Box>

      {/* Review Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Review {currentStudent?.name}'s Assignment</DialogTitle>

        <Formik
          initialValues={{
            totalMarks: "",
            marksObtained: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmitReview}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <DialogContent
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                {assignmentDeatials?.questions?.length > 0 ? (
                  assignmentDeatials.questions.map((a, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                        borderBottom: "1px solid #eee",
                        pb: 1,
                      }}
                    >
                      <Box sx={{ flex: 3 }}>
                        <b>Q{index + 1}:</b> {a.question}
                      </Box>
                      <Box sx={{ flex: 3 }}>
                        <b>Answer:</b> {a.answer}
                      </Box>
                      <Box sx={{ flex: 2 }}>
                        <SelectField
                          name={`answers[${index}].isCorrect`}
                          label="Correct?"
                          options={[
                            { label: "Yes", value: true },
                            { label: "No", value: false },
                          ]}
                        />
                      </Box>
                    </Box>
                  ))
                ) : (
                  <p>No answers submitted.</p>
                )}

                <InputField
                  name="totalMarks"
                  label="Total Marks"
                  type="number"
                />
                <InputField
                  name="marksObtained"
                  label="Marks Obtained"
                  type="number"
                />

                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
                >
                  <Button onClick={handleCloseDialog}>Cancel</Button>
                  <Button type="submit" variant="contained" sx={{ ml: 2 }}>
                    Submit
                  </Button>
                </Box>
              </DialogContent>
            </Form>
          )}
        </Formik>
      </Dialog>
    </Box>
  );
};

export default StudentList;
