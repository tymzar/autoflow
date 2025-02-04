import {Position} from 'reactflow';

import {uuid} from '@/utils/uuid';

import {isHorizontalFromPosition} from './edge';

/**
 * Find the potential midpoint and intersection
 */
export const getCenterPoints = ({
    source,
    target,
    sourceOffset,
    targetOffset,
}) => {
    if (
        sourceOffset.x === targetOffset.x ||
        sourceOffset.y === targetOffset.y
    ) {
        // Cannot determine the rectangle
        return [];
    }
    const vertices = [...getRectVertices(source), ...getRectVertices(target)];
    const outerSides = getSidesFromPoints(vertices);
    const {left, right, top, bottom} = getSidesFromPoints([
        sourceOffset,
        targetOffset,
    ]);
    const centerX = (left + right) / 2;
    const centerY = (top + bottom) / 2;
    const points = [
        {id: uuid(), x: centerX, y: top}, // topCenter
        {id: uuid(), x: right, y: centerY}, // rightCenter
        {id: uuid(), x: centerX, y: bottom}, // bottomCenter
        {id: uuid(), x: left, y: centerY}, // leftCenter
        {id: uuid(), x: centerX, y: outerSides.top}, // outerTop
        {id: uuid(), x: outerSides.right, y: centerY}, // outerRight
        {id: uuid(), x: centerX, y: outerSides.bottom}, // outerBottom
        {id: uuid(), x: outerSides.left, y: centerY}, // outerLeft
    ];
    return points.filter((p) => {
        return !isPointInRect(p, source) && !isPointInRect(p, target);
    });
};

export const getExpandedRect = (rect, offset) => {
    return {
        x: rect.x - offset,
        y: rect.y - offset,
        width: rect.width + 2 * offset,
        height: rect.height + 2 * offset,
    };
};

export const isRectOverLapping = (rect1, rect2) => {
    return (
        Math.abs(rect1.x - rect2.x) < (rect1.width + rect2.width) / 2 &&
        Math.abs(rect1.y - rect2.y) < (rect1.height + rect2.height) / 2
    );
};

export const isPointInRect = (p, box) => {
    const sides = getRectSides(box);
    return (
        p.x >= sides.left &&
        p.x <= sides.right &&
        p.y >= sides.top &&
        p.y <= sides.bottom
    );
};

/**
 * Find the vertex of an enclosing rectangle with a vertex outside of it, given a rectangle and an external vertex.
 */
export const getVerticesFromRectVertex = (box, vertex) => {
    const points = [vertex, ...getRectVertices(box)];
    const {top, right, bottom, left} = getSidesFromPoints(points);
    return [
        {id: uuid(), x: left, y: top}, // topLeft
        {id: uuid(), x: right, y: top}, // topRight
        {id: uuid(), x: right, y: bottom}, // bottomRight
        {id: uuid(), x: left, y: bottom}, // bottomLeft
    ];
};

export const getSidesFromPoints = (points) => {
    const left = Math.min(...points.map((p) => p.x));
    const right = Math.max(...points.map((p) => p.x));
    const top = Math.min(...points.map((p) => p.y));
    const bottom = Math.max(...points.map((p) => p.y));
    return {top, right, bottom, left};
};

/**
 * Get the top, right, bottom, left of the Rect.
 */
export const getRectSides = (box) => {
    const {x: left, y: top, width, height} = box;
    const right = left + width;
    const bottom = top + height;
    return {top, right, bottom, left};
};

export const getRectVerticesFromSides = ({top, right, bottom, left}) => {
    return [
        {id: uuid(), x: left, y: top}, // topLeft
        {id: uuid(), x: right, y: top}, // topRight
        {id: uuid(), x: right, y: bottom}, // bottomRight
        {id: uuid(), x: left, y: bottom}, // bottomLeft
    ];
};

export const getRectVertices = (box) => {
    const sides = getRectSides(box);
    return getRectVerticesFromSides(sides);
};

export const mergeRects = (...boxes) => {
    const left = Math.min(
        ...boxes.reduce((pre, e) => [...pre, e.x, e.x + e.width], [])
    );
    const right = Math.max(
        ...boxes.reduce((pre, e) => [...pre, e.x, e.x + e.width], [])
    );
    const top = Math.min(
        ...boxes.reduce((pre, e) => [...pre, e.y, e.y + e.height], [])
    );
    const bottom = Math.max(
        ...boxes.reduce((pre, e) => [...pre, e.y, e.y + e.height], [])
    );
    return {
        x: left,
        y: top,
        width: right - left,
        height: bottom - top,
    };
};

/**
 * 0 ---------> X
 * |
 * |
 * |
 * v
 *
 * Y
 */
export const getOffsetPoint = (box, offset) => {
    switch (box.position) {
        case Position.Top:
            return {
                id: uuid(),
                x: box.x,
                y: box.y - offset,
            };
        case Position.Bottom:
            return {id: uuid(), x: box.x, y: box.y + offset};
        case Position.Left:
            return {id: uuid(), x: box.x - offset, y: box.y};
        case Position.Right:
            return {id: uuid(), x: box.x + offset, y: box.y};
    }
};

/**
 * Determine whether a point is in the segment
 */
export const isInLine = (p, p1, p2) => {
    const xPoints = p1.x < p2.x ? [p1.x, p2.x] : [p2.x, p1.x];
    const yPoints = p1.y < p2.y ? [p1.y, p2.y] : [p2.y, p1.y];
    return (
        (p1.x === p.x &&
            p.x === p2.x &&
            p.y >= yPoints[0] &&
            p.y <= yPoints[1]) ||
        (p1.y === p.y && p.y === p2.y && p.x >= xPoints[0] && p.x <= xPoints[1])
    );
};

/**
 * Determine whether a point is on the straight line
 */
export const isOnLine = (p, p1, p2) => {
    return (p1.x === p.x && p.x === p2.x) || (p1.y === p.y && p.y === p2.y);
};

/**
 * Optimize the control points of edges.
 *
 * - Merge points with similar coordinates.
 * - Delete duplicate coordinate points.
 * - Correct source and target points.
 */
export const optimizeInputPoints = (p) => {
    // Merge points with similar coordinates
    let edgePoints = mergeClosePoints([
        p.source,
        p.sourceOffset,
        ...p.edgePoints,
        p.targetOffset,
        p.target,
    ]);
    const source = edgePoints.shift();
    const target = edgePoints.pop();
    const sourceOffset = edgePoints[0];
    const targetOffset = edgePoints[edgePoints.length - 1];
    // Correct source and target points.
    if (isHorizontalFromPosition(p.source.position)) {
        source.x = p.source.x;
    } else {
        source.y = p.source.y;
    }
    if (isHorizontalFromPosition(p.target.position)) {
        target.x = p.target.x;
    } else {
        target.y = p.target.y;
    }
    // Remove duplicate coordinate points
    edgePoints = removeRepeatPoints(edgePoints).map((p, idx) => ({
        ...p,
        id: `${idx + 1}`,
    }));
    return {source, target, sourceOffset, targetOffset, edgePoints};
};

/**
 * Reduce the control points of edges.
 *
 * - Ensure that there are only 2 endpoints on a straight line.
 * - Remove control points inside the straight line.
 */
export function reducePoints(points) {
    const optimizedPoints = [points[0]];
    for (let i = 1; i < points.length - 1; i++) {
        const inSegment = isInLine(points[i], points[i - 1], points[i + 1]);
        if (!inSegment) {
            optimizedPoints.push(points[i]);
        }
    }
    optimizedPoints.push(points[points.length - 1]);
    return optimizedPoints;
}

/**
 * Merge nearby coordinates while rounding the coordinates to integers.
 */
export function mergeClosePoints(points, threshold = 4) {
    // Discrete coordinates
    const positions = {x: [], y: []};
    const findPosition = (axis, v) => {
        // eslint-disable-next-line no-param-reassign
        v = Math.floor(v);
        const ps = positions[axis];
        let p = ps.find((e) => Math.abs(v - e) < threshold);
        // eslint-disable-next-line eqeqeq
        if (p === null) {
            p = v;
            positions[axis].push(v);
        }
        return p;
    };

    const finalPoints = points.map((point) => {
        return {
            ...point,
            x: findPosition('x', point.x),
            y: findPosition('y', point.y),
        };
    });

    return finalPoints;
}

export function isEqualPoint(p1, p2) {
    return p1.x === p2.x && p1.y === p2.y;
}

/**
 * Remove the duplicate point (retain the starting point and end point)
 */
export function removeRepeatPoints(points) {
    const lastP = points[points.length - 1];
    const uniquePoints = new Set([`${lastP.x}-${lastP.y}`]);
    const finalPoints = [];
    points.forEach((p, idx) => {
        if (idx === points.length - 1) {
            return finalPoints.push(p);
        }
        const key = `${p.x}-${p.y}`;
        if (!uniquePoints.has(key)) {
            uniquePoints.add(key);
            finalPoints.push(p);
        }
    });
    return finalPoints;
}

/**
 * Determine whether the line segment intersects
 */
const isSegmentsIntersected = (p0, p1, p2, p3) => {
    const s1x = p1.x - p0.x;
    const s1y = p1.y - p0.y;
    const s2x = p3.x - p2.x;
    const s2y = p3.y - p2.y;

    if (s1x * s2y - s1y * s2x === 0) {
        // Lines are parallel, no intersection
        return false;
    }

    const denominator = -s2x * s1y + s1x * s2y;
    const s = (s1y * (p2.x - p0.x) - s1x * (p2.y - p0.y)) / denominator;
    const t = (s2x * (p0.y - p2.y) - s2y * (p0.x - p2.x)) / denominator;

    return s >= 0 && s <= 1 && t >= 0 && t <= 1;
};

/**
 * Determine whether the line segment intersects the rectangle
 */
export const isSegmentCrossingRect = (p1, p2, box) => {
    if (box.width === 0 && box.height === 0) {
        return false;
    }
    const [topLeft, topRight, bottomRight, bottomLeft] = getRectVertices(box);
    return (
        isSegmentsIntersected(p1, p2, topLeft, topRight) ||
        isSegmentsIntersected(p1, p2, topRight, bottomRight) ||
        isSegmentsIntersected(p1, p2, bottomRight, bottomLeft) ||
        isSegmentsIntersected(p1, p2, bottomLeft, topLeft)
    );
};
