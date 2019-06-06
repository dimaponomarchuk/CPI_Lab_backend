const success = (data) => {
    return { success: true, data, message: 'OK' }
};

const error = (data) => {
  return { success: true, data, message: 'NOT OK' };
};

module.exports = {
  success,
  error
};
