module.exports = {
    // accessible only from admin UI
    type: 'admin',
    routes: [
      {
        method: 'GET',
        path: '/models',
        handler: 'models.getModels',
        config: { policies: [] },
      },
      {
        method: 'GET',
        path: '/pictureModels',
        handler: 'models.getPictureModels',
        config: { policies: [] },
      },
    ],
  };
