export default class ResponseError extends Error {
    /**
     * @param {object} response
     * @param {object} data
     */
    constructor (response, data = null) {
        super();
        Error.captureStackTrace(this, this.constructor);
        this.name = 'RESTApiClientResponseError';
        this.data = data;
        this.info = {
            responseUrl: response.responseUrl,
            path: response.req.path,
            statusCode: response.statusCode,
            statusMessage: response.statusMessage,
            headers: response.headers
        };
        this.message = response.statusMessage;
    }
}
