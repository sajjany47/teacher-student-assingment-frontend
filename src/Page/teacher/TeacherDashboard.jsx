import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LockIcon from "@mui/icons-material/Lock";
import DeleteIcon from "@mui/icons-material/Delete";
import { Formik, Form, FieldArray, Field } from "formik";
import * as Yup from "yup";
import {
  InputField,
  SelectField,
  DateField,
} from "../../component/CustomField";

const initialAssignments = [
  {
    id: 1,
    title: "Math Homework",
    description: "Solve 10 algebra problems",
    dueDate: "2025-10-15",
    status: "Draft",
    questions: [
      { question: "What is 2+2?", answer: "4" },
      { question: "Simplify x + x", answer: "2x" },
    ],
  },
];

const statusOptions = [
  { label: "Draft", value: "Draft" },
  { label: "Published", value: "Published" },
  { label: "Completed", value: "Completed" },
];

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  dueDate: Yup.string().required("Due date is required"),
  status: Yup.string().required("Status is required"),
  questions: Yup.array()
    .of(
      Yup.object().shape({
        question: Yup.string().required("Question is required"),
        answer: Yup.string().required("Answer is required"),
      })
    )
    .min(1, "At least one question is required"),
});

const TeacherDashboard = () => {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [openDialog, setOpenDialog] = useState(false);
  const [editAssignment, setEditAssignment] = useState(null);

  const handleOpenDialog = (assignment = null) => {
    setEditAssignment(assignment);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditAssignment(null);
  };

  const handleDelete = (id) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  const handelAssignmentSubmit = (values) => {
    console.log(values);
    handleCloseDialog();
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <h2>Assignments</h2>
        <Button variant="contained" onClick={() => handleOpenDialog()}>
          Add Assignment
        </Button>
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assignments.map((assignment) => (
              <TableRow key={assignment.id}>
                <TableCell>{assignment.title}</TableCell>
                <TableCell>{assignment.description}</TableCell>
                <TableCell>{assignment.dueDate}</TableCell>
                <TableCell>{assignment.status}</TableCell>
                <TableCell>
                  <Tooltip title="View">
                    <IconButton onClick={() => handleOpenDialog(assignment)}>
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => handleOpenDialog(assignment)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Lock">
                    <IconButton>
                      <LockIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton onClick={() => handleDelete(assignment.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editAssignment ? "Edit Assignment" : "Add Assignment"}
        </DialogTitle>

        <Formik
          initialValues={
            editAssignment || {
              title: "",
              description: "",
              dueDate: "",
              status: "Draft",
              questions: [{ question: "", answer: "" }],
            }
          }
          validationSchema={validationSchema}
          onSubmit={handelAssignmentSubmit}
        >
          {({ values, handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <DialogContent
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                <InputField
                  name="title"
                  label="Title"
                  placeholder="Enter title"
                />

                <InputField
                  name="description"
                  label="Description"
                  placeholder="Enter description"
                  multiline
                  rows={3}
                />

                <DateField
                  name="dueDate"
                  label="Due Date"
                  placeholder="Select due date"
                  views={["year", "month", "day"]}
                />

                <SelectField
                  name="status"
                  label="Status"
                  placeholder="Select status"
                  options={statusOptions}
                />

                {/* Question FieldArray */}
                <FieldArray name="questions">
                  {({ push, remove }) => (
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
                        <Button
                          variant="outlined"
                          onClick={() => push({ question: "", answer: "" })}
                          // size="small"
                        >
                          + Add Question
                        </Button>
                      </Box>
                      {values.questions.map((q, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            gap: 2,
                            mb: 1,
                            alignItems: "center",
                          }}
                        >
                          <InputField
                            label={`Question ${index + 1}`}
                            name={`questions[${index}].question`}
                            placeholder="Enter question"
                            fullWidth
                          />

                          <InputField
                            label="Answer"
                            name={`questions[${index}].answer`}
                            placeholder="Enter answer"
                            fullWidth
                          />
                          <IconButton
                            onClick={() => remove(index)}
                            // color="primary"
                            size="medium"
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  )}
                </FieldArray>
              </DialogContent>

              <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button type="submit" variant="contained">
                  Save
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </Box>
  );
};

export default TeacherDashboard;
