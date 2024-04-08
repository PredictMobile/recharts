"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useGetBoundingClientRect = useGetBoundingClientRect;
var _react = require("react");
var EPS = 1;
/**
 * Use this to listen to bounding box changes.
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
 *
 * Very useful for reading actual sizes of DOM elements.
 *
 * Be aware that this is difficult to test for. jsdom, by design, returns all zeroes!
 * If you want to write tests check out the utility function `mockGetBoundingClientRect`
 *
 * @param onUpdate this is extra callback that's called with the full DOMRect. Note that this receives different object than the return value.
 * @param extraDependencies use this to trigger new DOM dimensions read when any of these change. Good for things like payload and label, that will re-render something down in the children array, but you want to read the bounding box of a parent.
 * @returns [lastBoundingBox, updateBoundingBox] most recent value, and setter. Pass the setter to a DOM element ref like this: `<div ref={updateBoundingBox}>`
 */
function useGetBoundingClientRect(onUpdate, extraDependencies) {
  var [lastBoundingBox, setLastBoundingBox] = (0, _react.useState)({
    width: 0,
    height: 0
  });
  var updateBoundingBox = (0, _react.useCallback)(node => {
    if (node != null) {
      var box = {
        width: node.offsetWidth,
        height: node.offsetHeight
      };
      if (Math.abs(box.width - lastBoundingBox.width) > EPS || Math.abs(box.height - lastBoundingBox.height) > EPS) {
        setLastBoundingBox({
          width: box.width,
          height: box.height
        });
        if (onUpdate) {
          onUpdate(box);
        }
      }
    }
  }, [lastBoundingBox.width, lastBoundingBox.height, onUpdate, ...extraDependencies]);
  return [lastBoundingBox, updateBoundingBox];
}