"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectReferenceElementsDomain = void 0;
const ReferenceDot_1 = require("../cartesian/ReferenceDot");
const ReferenceLine_1 = require("../cartesian/ReferenceLine");
const ReferenceArea_1 = require("../cartesian/ReferenceArea");
const ReactUtils_1 = require("./ReactUtils");
const DataUtils_1 = require("./DataUtils");
const detectReferenceElementsDomain = (children, domain, axisId, axisType, specifiedTicks) => {
    const lines = (0, ReactUtils_1.findAllByType)(children, ReferenceLine_1.ReferenceLine);
    const dots = (0, ReactUtils_1.findAllByType)(children, ReferenceDot_1.ReferenceDot);
    const elements = [...lines, ...dots];
    const areas = (0, ReactUtils_1.findAllByType)(children, ReferenceArea_1.ReferenceArea);
    const idKey = `${axisType}Id`;
    const valueKey = axisType[0];
    let finalDomain = domain;
    if (elements.length) {
        finalDomain = elements.reduce((result, el) => {
            var _a;
            const ifOverflow = (_a = el.props) === null || _a === void 0 ? void 0 : _a.ifOverflow;
            if (el.props[idKey] === axisId && ifOverflow === 'extendDomain' && (0, DataUtils_1.isNumber)(el.props[valueKey])) {
                const value = el.props[valueKey];
                return [Math.min(result[0], value), Math.max(result[1], value)];
            }
            return result;
        }, finalDomain);
    }
    if (areas.length) {
        const key1 = `${valueKey}1`;
        const key2 = `${valueKey}2`;
        finalDomain = areas.reduce((result, el) => {
            var _a;
            const ifOverflow = (_a = el.props) === null || _a === void 0 ? void 0 : _a.ifOverflow;
            if (el.props[idKey] === axisId &&
                ifOverflow === 'extendDomain' &&
                (0, DataUtils_1.isNumber)(el.props[key1]) &&
                (0, DataUtils_1.isNumber)(el.props[key2])) {
                const value1 = el.props[key1];
                const value2 = el.props[key2];
                return [Math.min(result[0], value1, value2), Math.max(result[1], value1, value2)];
            }
            return result;
        }, finalDomain);
    }
    if (specifiedTicks && specifiedTicks.length) {
        finalDomain = specifiedTicks.reduce((result, tick) => {
            if ((0, DataUtils_1.isNumber)(tick)) {
                return [Math.min(result[0], tick), Math.max(result[1], tick)];
            }
            return result;
        }, finalDomain);
    }
    return finalDomain;
};
exports.detectReferenceElementsDomain = detectReferenceElementsDomain;
//# sourceMappingURL=DetectReferenceElementsDomain.js.map