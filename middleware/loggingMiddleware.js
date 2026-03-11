const {createMiddleware} = require("langchain");

const loggingMiddleware = createMiddleware({
    name: "LoggingMiddleware",
    beforeAgent: {
        hook: (state) => {
            console.log(`before agent`);
            return state;
        }
    },
    beforeModel: {
        hook: (state) => {
            console.log(`before model`);
            return state;
        }
    },
    afterModel: {
        hook: (state) => {
            console.log(`after model`);
            return state;
        }
    },
    afterAgent: {
        hook: (state) => {
            console.log(`after agent`);
            return state;
        }
    }
});

module.exports = loggingMiddleware
