const routes = require('./routes');
const ExportsHandler = require('./handler');

module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: async (server, {
    producerService, usersService, playlistsService, validator,
  }) => {
    const exportsHandler = new ExportsHandler({
      producerService, usersService, playlistsService, validator,
    });
    server.route(routes(exportsHandler));
  },
};
