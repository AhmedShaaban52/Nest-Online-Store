"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerMiddleware = loggerMiddleware;
const common_1 = require("@nestjs/common");
function loggerMiddleware(req, res, next) {
    const { method, originalUrl } = req;
    const logger = new common_1.Logger('HTTP');
    res.on('finish', () => {
        const { statusCode } = res;
        logger.log(`${method} ${originalUrl} ${statusCode}`);
    });
    next();
}
//# sourceMappingURL=logger.middleware.js.map