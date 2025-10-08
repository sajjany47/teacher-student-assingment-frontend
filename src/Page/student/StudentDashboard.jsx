import React from "react";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// Dummy published assignments
const publishedAssignments = [
  {
    id: 1,
    title: "Math Homework",
    description: "Solve 10 algebra problems",
    dueDate: "2025-10-15",
    status: "Published",
    questions: [{ question: "What is 2+2?" }, { question: "Simplify x + x" }],
  },
  {
    id: 2,
    title: "Science Project",
    description: "Build a volcano model",
    dueDate: "2025-10-20",
    status: "Published",
    questions: [
      { question: "What is chemical reaction?" },
      { question: "Explain volcano eruption process" },
    ],
  },
];

const StudentDashboard = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3 }}>
      <h2>Published Assignments</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {publishedAssignments.map((assignment) => (
              <TableRow key={assignment.id}>
                <TableCell>{assignment.title}</TableCell>
                <TableCell>{assignment.description}</TableCell>
                <TableCell>{assignment.dueDate}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() =>
                      navigate(`/assignment/${assignment.id}`, {
                        state: { assignment },
                      })
                    }
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default StudentDashboard;
