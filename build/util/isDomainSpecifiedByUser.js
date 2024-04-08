"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDomainSpecifiedByUser = void 0;
const DataUtils_1 = require("./DataUtils");
function isDomainSpecifiedByUser(domain, allowDataOverflow, axisType) {
    if (axisType === 'number' && allowDataOverflow === true && Array.isArray(domain)) {
        const domainStart = domain === null || domain === void 0 ? void 0 : domain[0];
        const domainEnd = domain === null || domain === void 0 ? void 0 : domain[1];
        if (!!domainStart && !!domainEnd && (0, DataUtils_1.isNumber)(domainStart) && (0, DataUtils_1.isNumber)(domainEnd)) {
            return true;
        }
    }
    return false;
}
exports.isDomainSpecifiedByUser = isDomainSpecifiedByUser;
//# sourceMappingURL=isDomainSpecifiedByUser.js.map