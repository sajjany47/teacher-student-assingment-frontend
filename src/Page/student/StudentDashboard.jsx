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
  Tooltip,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DatatableAssignment } from "../../MainService";
import { enqueueSnackbar } from "notistack";
import moment from "moment";
import Loader from "../../component/Loader";
import LockIcon from "@mui/icons-material/Lock";

const StudentDashboard = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [assignments, setAssignments] = useState([]);
  // const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    FetchAssignmentList();
  }, []);
  const FetchAssignmentList = () => {
    setLoading(true);

    const payload = {
      page: 1,
      limit: 100,
      status: "Published",
    };
    DatatableAssignment(payload)
      .then((res) => {
        setAssignments(res.data || []);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar(error.message || "Failed to load assignments", {
          variant: "error",
        });
      });
  };

  return (
    <Box sx={{ p: 3 }}>
      {loading && <Loader />}
      <h2>Published Assignments</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Marks</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assignments.map((assignment) => (
              <TableRow key={assignment._id}>
                <TableCell>{assignment.title}</TableCell>
                <TableCell>{assignment.description}</TableCell>
                <TableCell>
                  {moment(assignment.dueDate).format("Do,MMM,YYYY")}
                </TableCell>
                <TableCell>{assignment.marks}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() =>
                      navigate(`/assignment/${assignment._id}`, {
                        state: { assignment },
                      })
                    }
                  >
                    View
                  </Button>
                  {assignment.isSubmit && (
                    <Tooltip title="Locked">
                      <IconButton disabled>
                        <LockIcon />
                      </IconButton>
                    </Tooltip>
                  )}
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
