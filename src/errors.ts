export const ErrorCodes = {
    API_VALIDATION_ERROR: 'API_VALIDATION_ERROR',
    INVALID_JSON_FORMAT: 'INVALID_JSON_FORMAT',
    FORM_VALIDATION_ERROR: 'FORM_VALIDATION_ERROR',
    INVALID_API_KEY: 'INVALID_API_KEY',
    REQUEST_FORBIDDEN_ERROR: 'REQUEST_FORBIDDEN_ERROR',
    RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR'
};
export const ErrorCodeMap: { [key: string]: number } = {
    API_VALIDATION_ERROR: 400,
    INVALID_JSON_FORMAT: 400,
    FORM_VALIDATION_ERROR: 400,
    INVALID_API_KEY: 401,
    REQUEST_FORBIDDEN_ERROR: 403,
    RESOURCE_NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
};
