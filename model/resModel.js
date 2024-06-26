// 成功时返回 {"success": true, "data": {...}, "message": xxx}
// 失败时返回 {"success": false, "message": xxx}

class BaseModel {
    constructor(data, message) {
        if (typeof data === 'string') {
            this.message = data;
            data = null;
            message = null;
        }
        if (data) {
            this.data = data;
        }
        if (message) {
            this.message = message;
        }
    }
}

class SuccessModel extends BaseModel {
    constructor(data, message) {
        super(data, message);
        this.success = true;
    }
}

class ErrorModel extends BaseModel {
    constructor(data, message) {
        super(data, message);
        this.success = false;
    }
}

module.exports = {
    SuccessModel,
    ErrorModel
}
