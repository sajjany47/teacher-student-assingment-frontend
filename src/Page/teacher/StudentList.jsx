import React, { useState } from "react";
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
} from "@mui/material";
import { useLocation } from "react-router-dom";

// Dummy student assignment data
const initialStudents = [
  {
    id: 1,
    name: "John Doe",
    assignmentName: "Math Homework",
    isCompleted: true,
    answers: [
      { question: "2+2?", answer: "4" },
      { question: "Simplify x+x", answer: "2x" },
    ],
  },
  {
    id: 2,
    name: "Jane Smith",
    assignmentName: "Math Homework",
    isCompleted: false,
    answers: [],
  },
];

const StudentList = () => {
  const location = useLocation();
  const { assignment } = location.state;
  const [students] = useState(initialStudents);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);

  const handleViewStudent = (student) => {
    setCurrentStudent(student);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  return (
    <Box sx={{ p: 3 }}>
      <h2>Students for {assignment.title}</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Assignment</TableCell>
              <TableCell>Completed</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((s) => (
              <TableRow key={s.id}>
                <TableCell>{s.name}</TableCell>
                <TableCell>{s.assignmentName}</TableCell>
                <TableCell>{s.isCompleted ? "Yes" : "No"}</TableCell>
                <TableCell>
                  {s.isCompleted && (
                    <Button
                      variant="contained"
                      onClick={() => handleViewStudent(s)}
                    >
                      View
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Review Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Review {currentStudent?.name}'s Assignment</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {currentStudent?.answers.map((a, index) => (
            <Box
              key={index}
              sx={{ display: "flex", gap: 2, alignItems: "center" }}
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
          ))}

          <InputField name="totalMarks" label="Total Marks" />
          <InputField name="marksObtained" label="Marks Obtained" />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default StudentList;
