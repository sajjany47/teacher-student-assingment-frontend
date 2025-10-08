import React, { useState } from "react";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  Typography,
  IconButton,
  Paper,
} from "@mui/material";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { InputField } from "../../component/CustomField";
import moment from "moment";
import DeleteIcon from "@mui/icons-material/Delete";
import { StudentAssignmentSubmit } from "../../MainService";
import { useSelector } from "react-redux";
import { enqueueSnackbar } from "notistack";
import Loader from "../../component/Loader";

const validationSchema = Yup.object().shape({
  questions: Yup.array().of(
    Yup.object().shape({
      question: Yup.string().required("Question is required"),
      answer: Yup.string().required("Answer is required"),
    })
  ),
});

const AssignmentDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state?.auth?.user);
  const { assignment } = location.state;
  const [loading, setLoading] = useState(false);

  // ✅ Prepare Formik initialValues
  const initialValues = {
    title: assignment.title || "",
    description: assignment.description || "",
    dueDate: assignment.dueDate || "",
    questions:
      assignment.questions?.map((q) => ({
        ...q,
        question: q.question,
        answer: "",
      })) || [],
  };

  // ✅ Handle Submit
  const handleSubmit = (values) => {
    setLoading(true);
    let payload = {
      assignmentId: assignment._id,
      studentId: user._id,
      answers: values.questions.map((item) => ({
        answerText: item.answer,
        questionId: item._id,
      })),
    };
    StudentAssignmentSubmit(payload)
      .then(() => {
        setLoading(false);
        enqueueSnackbar("Assignment submitted successfully!", {
          variant: "success",
        });
        navigate("/student-dashboard");
      })
      .catch((err) => {
        setLoading(false);
        enqueueSnackbar(err.message || "Failed to submit assignment", {
          variant: "error",
        });
      });
  };

  return (
    <Box sx={{ p: 3 }}>
      {loading && <Loader />}
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5" fontWeight="bold">
          {assignment.title}
        </Typography>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Back
        </Button>
      </Box>

      {/* Basic Info */}
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        {assignment.description}
      </Typography>
      <Typography variant="body2" sx={{ mb: 3 }}>
        <strong>Due Date:</strong>{" "}
        {moment(assignment.dueDate).format("Do MMM YYYY")}
      </Typography>

      {/* Formik Form */}
      <Paper sx={{ p: 3 }}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <DialogContent
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                <FieldArray name="questions">
                  {() => (
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        <h4>Questions</h4>
                      </Box>

                      {values.questions.length > 0 ? (
                        values.questions.map((q, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 1.5,
                              mb: 2,
                              p: 2,
                              border: "1px solid #ccc",
                              borderRadius: "8px",
                              background: "#fafafa",
                              position: "relative",
                            }}
                          >
                            <Typography variant="subtitle2">
                              Q{index + 1}: {q.question}
                            </Typography>

                            <InputField
                              name={`questions[${index}].answer`}
                              label="Your Answer"
                              placeholder="Type your answer here..."
                              multiline
                              rows={3}
                              fullWidth
                            />

                            {/* Optional: Allow remove (if you want students to remove a question) */}
                            {/* <IconButton
                              onClick={() => remove(index)}
                              color="error"
                              size="small"
                              sx={{ position: "absolute", top: 8, right: 8 }}
                            >
                              <DeleteIcon />
                            </IconButton> */}
                          </Box>
                        ))
                      ) : (
                        <Typography>No questions available</Typography>
                      )}
                    </Box>
                  )}
                </FieldArray>
              </DialogContent>

              <DialogActions sx={{ justifyContent: "center", mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={
                    !values.questions.every(
                      (q) => q.answer && q.answer.trim() !== ""
                    )
                  }
                >
                  Submit Assignment
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
};

export default AssignmentDetail;
