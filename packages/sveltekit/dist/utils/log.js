const dev = process.env.NODE_ENV !== 'production';
const logger = {
    log: (message, ...optionalParams) => {
        dev ? console.log(message, ...optionalParams) : null;
    },
    error: (message, ...optionalParams) => {
        console.error(message, ...optionalParams);
    },
    info: (message, ...optionalParams) => {
        logger.log(message, ...optionalParams);
    },
    debug: (message, ...optionalParams) => {
        logger.log(message, ...optionalParams);
    },
    warn: (message, ...optionalParams) => {
        dev ? logger.error(message, ...optionalParams) : null;
    }
};
export default logger;
