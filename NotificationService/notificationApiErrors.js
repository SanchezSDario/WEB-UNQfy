class APIError extends Error{
    constructor(name, statusCode, errorCode, message = null){
        super(message || name);
        this.name = name;
        this.statusCode = statusCode;
        this.errorCode = errorCode;
    }

    toJSON(){
        let data = {
            status: this.statusCode,
            errorCode: this.errorCode
        };
        return data;
    }
}

class RelatedResourceNotFoundError extends APIError{
    constructor(){
        super('RelatedResourceNotFoundError', 404, 'RELATED_RESOURCE_NOT_FOUND');
    }
}

class ResourceNotFoundError extends APIError{
    constructor(){
        super('ResourceNotFoundError', 404, 'RESOURCE_NOT_FOUND');
    }
}

class BadRequestError extends APIError{
    constructor(){
        super('BadRequestError', 400, 'BAD_REQUEST');
    }
}

class InternalServerError extends APIError{
    constructor(){
        super('InternalServerError', 500, 'INTERNAL_SERVER_ERROR');
    }
}

module.exports = {
    RelatedResourceNotFoundError,
    ResourceNotFoundError,
    BadRequestError,
    InternalServerError
}