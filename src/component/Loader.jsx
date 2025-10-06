import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const Loader = () => {
  return (
    <Box className="loader_spinner">
      <CircularProgress />
      <h3>Loading...</h3>
    </Box>
  );
};

export default Loader;
