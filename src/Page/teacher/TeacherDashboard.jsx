import React, { useEffect, useState } from "react";
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
  Pagination,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LockIcon from "@mui/icons-material/Lock";
import DeleteIcon from "@mui/icons-material/Delete";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import {
  InputField,
  SelectField,
  DateField,
} from "../../component/CustomField";

import { useSnackbar } from "notistack";
import {
  CreateAssignment,
  DatatableAssignment,
  DeleteAssignment,
  EditAssignment,
} from "../../MainService";
import Loader from "../../component/Loader";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const statusOptions = [
  { label: "All", value: "" },
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
      })
    )
    .min(1, "At least one question is required"),
});

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [assignments, setAssignments] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editAssignment, setEditAssignment] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAssignments = () => {
    setLoading(true);

    const payload = {
      page,
      limit,
      status: statusFilter,
    };
    DatatableAssignment(payload)
      .then((res) => {
        setAssignments(res.data || []);
        setTotalPages(res.totalPages || 1);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar(error.message || "Failed to load assignments", {
          variant: "error",
        });
      });
  };

  useEffect(() => {
    fetchAssignments();
  }, [page, statusFilter]);

  const handleOpenDialog = (assignment = null) => {
    setEditAssignment(assignment);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditAssignment(null);
  };

  const handleAssignmentSubmit = (values, { resetForm }) => {
    if (editAssignment) {
      EditAssignment({ ...values, _id: editAssignment._id })
        .then(() => {
          enqueueSnackbar("Assignment updated successfully", {
            variant: "success",
          });
          resetForm();
          handleCloseDialog();
          fetchAssignments();
        })
        .catch((error) => {
          enqueueSnackbar(error.message || "Failed to update assignment", {
            variant: "error",
          });
        });
    } else {
      CreateAssignment(values)
        .then(() => {
          enqueueSnackbar("Assignment created successfully", {
            variant: "success",
          });
          resetForm();
          handleCloseDialog();
          fetchAssignments();
        })
        .catch((error) => {
          enqueueSnackbar(error.message || "Failed to create assignment", {
            variant: "error",
          });
        });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      DeleteAssignment(id)
        .then(() => {
          enqueueSnackbar("Assignment deleted successfully", {
            variant: "success",
          });
          fetchAssignments();
        })
        .catch((error) => {
          enqueueSnackbar(error.message || "Failed to delete assignment", {
            variant: "error",
          });
        });
    }
  };

  const formatDate = (dateString) => {
    return moment(dateString).format("Do MMM YYYY"); // e.g. 22nd May 2025
  };

  const getStatusChip = (status) => {
    let color = "default";
    switch (status) {
      case "Draft":
        color = "default"; // gray
        break;
      case "Published":
        color = "primary"; // blue
        break;
      case "Completed":
        color = "success"; // green
        break;
      default:
        color = "default";
    }
    return (
      <Chip label={status} color={color} variant="outlined" size="small" />
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      {loading && <Loader />}
      {/* Header with Filter */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <h2>Assignments</h2>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>Status Filter</InputLabel>
            <Select
              label="Status Filter"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button variant="contained" onClick={() => handleOpenDialog()}>
            + Add Assignment
          </Button>
        </Box>
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
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assignments.length > 0 ? (
              assignments.map((assignment) => (
                <TableRow key={assignment._id || assignment.id}>
                  <TableCell>{assignment.title}</TableCell>
                  <TableCell>{assignment.description}</TableCell>
                  <TableCell>{formatDate(assignment.dueDate)}</TableCell>
                  <TableCell>{getStatusChip(assignment.status)}</TableCell>

                  {/* ================= Actions ================= */}
                  <TableCell align="center">
                    {/* Always show View */}
                    <Tooltip title="View">
                      <IconButton
                        onClick={() => {
                          navigate("/student-list", {
                            state: { assignment }, // match StudentList.jsx
                          });
                        }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>

                    {/* If status is Draft → show Edit + Delete */}
                    {assignment.status === "Draft" && (
                      <>
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={() => handleOpenDialog(assignment)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() =>
                              handleDelete(assignment._id || assignment.id)
                            }
                          >
                            <DeleteIcon color="error" />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}

                    {/* If Published → show Edit only */}
                    {assignment.status === "Published" && (
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => handleOpenDialog(assignment)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    )}

                    {/* If Completed → show Lock only */}
                    {assignment.status === "Completed" && (
                      <Tooltip title="Locked">
                        <IconButton disabled>
                          <LockIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No assignments found
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
              questions: [{ question: "" }],
            }
          }
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={handleAssignmentSubmit}
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
                />
                <SelectField
                  name="status"
                  label="Status"
                  placeholder="Select status"
                  options={statusOptions.slice(1)} // remove "All"
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
                          onClick={() => push({ question: "" })}
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

                          <IconButton
                            onClick={() => remove(index)}
                            color="error"
                            size="medium"
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
