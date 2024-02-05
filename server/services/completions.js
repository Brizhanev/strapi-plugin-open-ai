'use strict';

const fetch = require('node-fetch');
var FormData = require('form-data');

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

  const createPicture = async ({ picturePrompt, width, height }) => {
    let params = {
            "type": "GENERATE",
            "numImages": 1,
            "width": width,
            "height": height,
            "generateParams": {
                "query": picturePrompt
            }
    };
    const formData = new FormData();
    const modelIdData = { value: 4, options: { contentType: null }};
    const paramsData = { value: JSON.stringify(params), options: { contentType: 'application/json'}};
    formData.append('model_id', modelIdData.value, modelIdData.options);
    formData.append('params', paramsData.value, paramsData.options);
    try {
      const response = await fetch(`${strapi
        .plugin('open-ai')
        .config('FUSION_API_HOST')}/text2image/run`, {
        method: 'POST',
        headers: {
          //'Content-Type': 'application/json',
          'X-Key': `Key ${strapi
            .plugin('open-ai')
            .config('FUSION_API_KEY')}`,
          'X-Secret': `Secret ${strapi
            .plugin('open-ai')
            .config('FUSION_API_SECRET')}`,
        },
        body: formData,
      });
      console.dir(response);
      const res = await response.json();
      console.dir(res);
      const requestId = res.uuid;
      console.dir(requestId);
      const images = await checkGeneration({ requestId });
      console.dir(images);
      return images;
    } catch (error) {
      console.log(error);
    }
  };

  const checkGeneration = async ({ requestId }) => {
    let attempts = 10;
    let delay = 10;
    console.dir(requestId);
    while (attempts > 0) {
      try {
        const response = await fetch(`${strapi
          .plugin('open-ai')
          .config('FUSION_API_HOST')}/text2image/status/${requestId}`, {
          method: 'GET',
          headers: {
            //'Content-Type': 'application/json',
            'X-Key': `Key ${strapi
              .plugin('open-ai')
              .config('FUSION_API_KEY')}`,
            'X-Secret': `Secret ${strapi
              .plugin('open-ai')
              .config('FUSION_API_SECRET')}`,
          },
        });
        console.dir(response);
      const res = await response.json();
      console.dir(res);
      if (res.status === 'DONE') {
        return res;
      }

      } catch (error) {
        console.error(error);
      }
      attempts--;
      await new Promise(resolve => setTimeout(resolve, delay * 1000));
    }
  }

  return {
    createCompletion,
    createPicture
  };
};
