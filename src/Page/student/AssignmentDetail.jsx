import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const AssignmentDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { assignment } = location.state;

  const [answers, setAnswers] = useState(
    Array(assignment.questions.length).fill("")
  );

  const handleChange = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleSubmit = () => {
    console.log("Submitted answers:", answers);
    alert("Assignment submitted successfully!");
    navigate("/dashboard");
  };

  const allCompleted = answers.every((a) => a.trim() !== "");

  return (
    <Box sx={{ p: 3 }}>
      {/* Back button aligned to right */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Back
        </Button>
      </Box>

      <h2>{assignment.title}</h2>
      <p>{assignment.description}</p>
      <p>Due Date: {assignment.dueDate}</p>

      {assignment.questions.map((q, index) => (
        <Box key={index} sx={{ mb: 2 }}>
          <TextField
            label={`Q${index + 1}: ${q.question}`}
            value={answers[index]}
            onChange={(e) => handleChange(index, e.target.value)}
            fullWidth
            multiline
            rows={2}
          />
        </Box>
      ))}

      {allCompleted && (
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit Assignment
        </Button>
      )}
    </Box>
  );
};

export default AssignmentDetail;
