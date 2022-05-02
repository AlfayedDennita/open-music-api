const ClientError = require('../exceptions/ClientError');

const goodResponse = (h, statusCode, options) => {
  const response = h.response({
    status: 'success',
    ...options,
  });
  response.code(statusCode);

  return response;
};

const badResponse = (h, error) => {
  let response;

  if (error instanceof ClientError) {
    response = h.response({
      status: 'fail',
      message: error.message,
    });
    response.code(error.statusCode);
  } else {
    console.error(error);
    response = h.response({
      status: 'error',
      message: 'Maaf, terjadi kesalahan pada server.',
    });
    response.code(500);
  }

  return response;
};

module.exports = { goodResponse, badResponse };
