const handleError = (status) => {
  if (status === 403) {
    throw new Error("403");
  }
  throw new Error("Server error");
};

export default handleError;
