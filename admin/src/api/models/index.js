import { request } from '@strapi/helper-plugin';

const models = {
  get: async () => {
    const data = await request(`/open-ai/models`, {
      method: 'GET',
    });
    return data;
  },
  getPicture: async () => {
    const data = await request(`/open-ai/pictureModels`, {
      method: 'GET',
    });
    return data;
  },
};
export default models;
