module.exports = {

  invalidCredentials(res) {
    return res.status(403).json({
      error: true,
      data: 'Invalid credentials',
    });
  },

  notFound(req, res) {
    return res.status(404).json({
      error: true,
      data: 'Not Found',
    });
  },

  ok(res, data = 'ok') {
    return res.status(200).json({
      success: true,
      data,
    });
  },

  created(res, data = '201 Created') {
    return res.status(201).json({
      success: true,
      data,
    });
  },

  upload(res) {
    return res.status(204).json({
      success: true,
      data: 'Ok',
    });
  },

  deleted(res) {
    return res.status(204).json({
      success: true,
      data: 'Ok',
    });
  },

  error(res, message = 'An Error occured. Please try again latter') {
    return res.status(500).json({
      success: false,
      data: message,
    });
  },

};
