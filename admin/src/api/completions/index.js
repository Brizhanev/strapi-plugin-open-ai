import { request } from '@strapi/helper-plugin';

const completions = {
  create: async ({ model, prompt, temperature, maxTokens }) => {
    const data = await request(`/open-ai/completions`, {
      method: 'POST',
      body: { model, prompt, temperature, maxTokens },
    });
    return data;
  },
  picture: async ({ picturePrompt }) => {
    const data = await request(`/open-ai/picture`, {
      method: 'POST',
      body: { picturePrompt },
    });
    return data;
  },
};
export default completions;
