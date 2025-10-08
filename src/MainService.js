import axios from "axios";
import { BASE_URL, getHeaders, getHeadersWithToken } from "../utilis";

export const UserLogin = async (payload) => {
  try {
    const response = await axios.post(`${BASE_URL}/user/login`, payload, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message);
  }
};

export const CreateAssignment = async (payload) => {
  try {
    const response = await axios.post(`${BASE_URL}/assigment/create`, payload, {
      headers: getHeadersWithToken(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message);
  }
};
export const EditAssignment = async (payload) => {
  try {
    const response = await axios.post(`${BASE_URL}/assigment/edit`, payload, {
      headers: getHeadersWithToken(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message);
  }
};
export const DatatableAssignment = async (payload) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/assigment/datatable`,
      payload,
      {
        headers: getHeadersWithToken(),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message);
  }
};

export const DeleteAssignment = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/assigment/${id}`, {
      headers: getHeadersWithToken(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message);
  }
};

export const StudentListAPI = async (payload) => {
  try {
    const response = await axios.post(`${BASE_URL}/user/list`, payload, {
      headers: getHeadersWithToken(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message);
  }
};
export const StudentAssignmentSubmit = async (payload) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/assigment/student-submit`,
      payload,
      {
        headers: getHeadersWithToken(),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message);
  }
};

export const AssignmentReview = async (id) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/assigment/review-teacher/${id}`,

      {
        headers: getHeadersWithToken(),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message);
  }
};

export const StudentAssignmentList = async (assignmentId, studentId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/assigment/${assignmentId}/student/${studentId}`,

      {
        headers: getHeadersWithToken(),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message);
  }
};
