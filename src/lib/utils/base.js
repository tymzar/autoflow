/* eslint-disable @typescript-eslint/no-explicit-any */

export const nextTick = async (frames = 1) => {
    const _nextTick = async (idx) => {
        return new Promise((resolve) => {
            requestAnimationFrame(() => resolve(idx));
        });
    };
    for (let i = 0; i < frames; i++) {
        await _nextTick(i);
    }
};

export const firstOf = (datas) =>
    datas ? (datas.length < 1 ? undefined : datas[0]) : undefined;

export const lastOf = (datas) =>
    datas
        ? datas.length < 1
            ? undefined
            : datas[datas.length - 1]
        : undefined;

export const randomInt = (min, max) => {
    if (!max) {
        max = min;
        min = 0;
    }
    return Math.floor(Math.random() * (max - min + 1) + min);
};

export const pickOne = (datas) =>
    datas.length < 1 ? undefined : datas[randomInt(datas.length - 1)];

export const range = (start, end) => {
    if (!end) {
        end = start;
        start = 0;
    }
    return Array.from({length: end - start}, (_, index) => start + index);
};

/**
 * clamp(-1,0,1)=0
 */
export function clamp(num, min, max) {
    return num < max ? (num > min ? num : min) : max;
}

export const toSet = (datas, byKey) => {
    if (byKey) {
        const keys = {};
        const newDatas = [];
        datas.forEach((e) => {
            const key = jsonEncode({key: byKey(e)});
            if (!keys[key]) {
                newDatas.push(e);
                keys[key] = true;
            }
        });
        return newDatas;
    }
    return Array.from(new Set(datas));
};

export function jsonEncode(obj, prettier = false) {
    try {
        return prettier
            ? JSON.stringify(obj, undefined, 4)
            : JSON.stringify(obj);
    } catch (error) {
        return undefined;
    }
}

export function jsonDecode(json) {
    if (json == undefined) return undefined;
    try {
        return JSON.parse(json);
    } catch (error) {
        return undefined;
    }
}

export function removeEmpty(data) {
    if (Array.isArray(data)) {
        return data.filter((e) => e != undefined);
    }
    const res = {};
    for (const key in data) {
        if (data[key] != undefined) {
            res[key] = data[key];
        }
    }
    return res;
}

export const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        const copy = [];
        obj.forEach((item, index) => {
            copy[index] = deepClone(item);
        });

        return copy;
    }

    const copy = {};

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            copy[key] = deepClone(obj[key]);
        }
    }

    return copy;
};
