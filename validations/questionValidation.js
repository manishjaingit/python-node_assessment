import Joi from "joi";

const getAnswer = {
    query: Joi.object().keys({
        model: Joi.string().empty().valid('ollama2', 'mistral'),
        question: Joi.string().empty()
    }),
};

export {
    getAnswer
};