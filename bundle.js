'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var rest = _interopDefault(require('node-rest-client'));
var _ = _interopDefault(require('lodash'));

class ResponseError extends Error {
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

class Client {
    /**
     * @param {object} config
     * @param {object} [logger]
     */
    constructor(config, logger = null) {
        if (!_.isObject(config)) {
            throw new TypeError('config is not object');
        }

        if (!_.isObject(config.api)) {
            throw new TypeError('invalid config');
        }

        this._config = config;
        this.setLogger(logger);

        if (_.isObject(this._config.api.clientOptions)) {
            this._client = new rest.Client(this._config.api.clientOptions);
        } else {
            this._client = new rest.Client();
        }
    }
    /**
     * @param {object|null} logger
     */
    setLogger(logger) {
        this._logger = logger;
    }
    /**
     * @param {string} path
     * @return {string}
     */
    getUrl(path) {
        return this._config.api.host + path;
    }
    /**
     * @param {object} headers
     * @return {object}
     */
    getHeaders(headers) {
        return _.defaults(headers, {
            'Content-Type': 'application/json',
            [this._config.api.keyHeader]: this._config.api.key
        });
    }
    /**
     * @return {rest.Client}
     */
    getClient() {
        return _.client;
    }
    /**
     * @param {string} method
     * @param {string} path
     * @param {object} [options]
     * @return {Promise}
     */
    request(method, path, options = {}) {
        let client = this._client;

        if (['get', 'post', 'put', 'patch', 'delete'].indexOf(method) === -1) {
            client = this._client.methods;
        }

        options.headers = this.getHeaders(options.headers || {});

        return new Promise((resolve, reject) => {
            try {
                const request = client[method](this.getUrl(path), options, (data, response) => {
                    if (response.statusCode >= 300 || response.statusCode < 200) {
                        const e = new ResponseError(response, data);
                        this._logError(e);
                        reject(e);
                    } else {
                        resolve({
                            data,
                            response
                        });
                    }
                });

                request.on('requestTimeout', (req) => {
                    const e = new Error('Request has expired');
                    this._logError(e);
                    reject(e);
                    req.abort();
                });

                request.on('responseTimeout', (res) => {
                    const e = new Error('Response has expired');
                    this._logError(e);
                    reject(e);
                });

                request.on('error', (err) => {
                    const e = new Error('Request error: ' + err);
                    this._logError(e);
                    reject(e);
                });
            } catch (e) {
                this._logError(e);
                reject(e);
            }
        });
    }
    /**
     * @param {object} e
     * @private
     */
    _logError(e) {
        if (_.isObject(this._logger)) {
            this._logger.error(e);
        }
    }
}

var index = {
    Client,
    ResponseError
};

module.exports = index;
