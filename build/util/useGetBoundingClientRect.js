"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGetBoundingClientRect = void 0;
const react_1 = require("react");
const EPS = 1;
function useGetBoundingClientRect(onUpdate, extraDependencies) {
    const [lastBoundingBox, setLastBoundingBox] = (0, react_1.useState)({ width: 0, height: 0 });
    const updateBoundingBox = (0, react_1.useCallback)((node) => {
        if (node != null) {
            const box = {
                width: node.offsetWidth,
                height: node.offsetHeight,
            };
            if (Math.abs(box.width - lastBoundingBox.width) > EPS || Math.abs(box.height - lastBoundingBox.height) > EPS) {
                setLastBoundingBox({ width: box.width, height: box.height });
                if (onUpdate) {
                    onUpdate(box);
                }
            }
        }
    }, [lastBoundingBox.width, lastBoundingBox.height, onUpdate, ...extraDependencies]);
    return [lastBoundingBox, updateBoundingBox];
}
exports.useGetBoundingClientRect = useGetBoundingClientRect;
//# sourceMappingURL=useGetBoundingClientRect.js.map