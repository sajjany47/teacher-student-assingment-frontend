import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useField, useFormikContext } from "formik";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

export const InputField = (props) => {
  const [field, meta] = useField(props);

  return (
    <FormControl fullWidth style={{ marginTop: 15 }}>
      <TextField
        {...field}
        {...props}
        value={field.value || ""}
        id={field.name}
        variant="outlined"
        size="medium"
        fullWidth
        error={meta.touched && Boolean(meta.error)}
        helperText={meta.touched ? meta.error : ""}
      />
    </FormControl>
  );
};

export const SelectField = (props) => {
  const [field, meta] = useField(props);

  return (
    <>
      <FormControl fullWidth style={{ marginTop: 15 }}>
        <InputLabel id={field.name} sx={{ marginTop: 1 }}>
          {props.label}
        </InputLabel>
        <Select
          id={field.name}
          sx={{ marginTop: 1 }}
          size="medium"
          labelId={field.name}
          {...field}
          {...props}
          value={field?.value !== undefined ? field.value : ""}
          className="w-full"
          // helperText={meta.touched ? meta.error : ""}
          error={meta.touched && Boolean(meta.error)}
        >
          <MenuItem value="" disabled>
            {props.placeholder || "Select an option"}
          </MenuItem>
          {props.options.map((item, index) => {
            return (
              <MenuItem value={item.value} key={index}>
                {item.label}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      {meta.touched && meta.error && (
        <small className="text-red-600">{meta.error}</small>
      )}
    </>
  );
};

export const DateField = (props) => {
  const [field, meta] = useField(props);
  const { setFieldValue } = useFormikContext();
  return (
    <FormControl fullWidth style={{ marginTop: 15 }}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DemoContainer components={["DatePicker"]} sx={{ paddingTop: 1 }}>
          <DatePicker
            label={props.label}
            // views={["year", "month", "day"]}
            {...field}
            {...props}
            value={field.value !== undefined ? moment(field.value) : ""}
            views={props.views}
            onChange={(e) => setFieldValue(field.name, moment(e))}
            sx={{ width: "100%" }}
            slotProps={{
              textField: {
                variant: "outlined",
                size: "medium",
                error: meta.touched && Boolean(meta.error),
                // helperText: meta.touched && Boolean(meta.error),
              },
            }}
          />
        </DemoContainer>
      </LocalizationProvider>
      {meta.touched && meta.error && (
        <small className="text-red-600">{meta.error}</small>
      )}
    </FormControl>
  );
};

export const TimeField = (props) => {
  const [field, meta] = useField(props);
  const { setFieldValue } = useFormikContext();
  return (
    <FormControl fullWidth style={{ marginTop: 15 }}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DemoContainer components={["TimePicker"]}>
          <TimePicker
            // label="Controlled picker"
            sx={{ width: "100%" }}
            {...field}
            {...props}
            value={field.value !== undefined ? moment(field.value) : ""}
            onChange={(e) => setFieldValue(field.name, moment(e))}
            slotProps={{
              textField: {
                variant: "outlined",
                size: "medium",
                error: meta.touched && Boolean(meta.error),
              },
            }}
          />
        </DemoContainer>
      </LocalizationProvider>
      {meta.touched && meta.error && (
        <small className="text-red-600">{meta.error}</small>
      )}
    </FormControl>
  );
};
