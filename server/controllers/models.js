'use strict';

module.exports = ({ strapi }) => {
  const modelService = strapi.plugins['open-ai'].services.models;

  const getModels = async (ctx) => {
    try {
      return modelService.getModels();
    } catch (err) {
      ctx.throw(500, err);
    }
  };

  const getPictureModels = async (ctx) => {
    try {
      return modelService.getPictureModels();
    } catch (err) {
      ctx.throw(500, err);
    }
  };

  return {
    getModels, getPictureModels,
  };
};
