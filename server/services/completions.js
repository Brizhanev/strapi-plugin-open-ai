'use strict';

const fetch = require('node-fetch');

module.exports = ({ strapi }) => {
  const createCompletion = async ({ model, prompt, temperature, maxTokens }) => {
    let messages = [{role: 'user', content: prompt}];
    try {
      const response = await fetch(`${strapi
        .plugin('open-ai')
        .config('API_HOST')}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${strapi
            .plugin('open-ai')
            .config('API_TOKEN')}`,
        },
        body: JSON.stringify({ model, messages, temperature, max_tokens: maxTokens }),
      });

      const res = await response.json();
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  const createPicture = async ({ picturePrompt }) => {
    let data = {
        'model_id': 1,
        'params': {
            "type": "GENERATE",
            "numImages": 1,
            "width": 250,
            "height": 250,
            "generateParams": {
                "query": picturePrompt
            }
        }
    };
    try {
      const response = await fetch(`${strapi
        .plugin('open-ai')
        .config('FUSION_API_HOST')}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Key': `Key ${strapi
            .plugin('open-ai')
            .config('FUSION_API_KEY')}`,
          'X-Secret': `Secret ${strapi
            .plugin('open-ai')
            .config('FUSION_API_SECRET')}`,
        },
        body: JSON.stringify(data),
      });
      console.dir(response);
      const res = await response.json();
      console.dir(res);
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    createCompletion,
    createPicture
  };
};
