// @ts-nocheck

// Source: https://github.com/AsyncBanana/microdiff

const t = true;
const richTypes = {Date: t, RegExp: t, String: t, Number: t};

export function isEqual(oldObj, newObj) {
    return (
        diff(
            {
                obj: oldObj,
            },
            {obj: newObj}
        ).length < 1
    );
}

export const isNotEqual = (oldObj, newObj) => !isEqual(oldObj, newObj);

function diff(obj, newObj, options = {cyclesFix: true}, _stack = []) {
    const diffs = [];
    const isObjArray = Array.isArray(obj);

    for (const key in obj) {
        const objKey = obj[key];
        const path = isObjArray ? Number(key) : key;
        if (!(key in newObj)) {
            diffs.push({
                type: 'REMOVE',
                path: [path],
            });
            continue;
        }
        const newObjKey = newObj[key];
        const areObjects =
            typeof objKey === 'object' && typeof newObjKey === 'object';
        if (
            objKey &&
            newObjKey &&
            areObjects &&
            !richTypes[Object.getPrototypeOf(objKey).constructor.name] &&
            (options.cyclesFix ? !_stack.includes(objKey) : true)
        ) {
            const nestedDiffs = diff(
                objKey,
                newObjKey,
                options,
                options.cyclesFix ? _stack.concat([objKey]) : []
            );
            // eslint-disable-next-line prefer-spread
            diffs.push.apply(
                diffs,
                nestedDiffs.map((difference) => {
                    difference.path.unshift(path);

                    return difference;
                })
            );
        } else if (
            objKey !== newObjKey &&
            !(
                areObjects &&
                (Number.isNaN(objKey)
                    ? String(objKey) === String(newObjKey)
                    : Number(objKey) === Number(newObjKey))
            )
        ) {
            diffs.push({
                path: [path],
                type: 'CHANGE',
                value: newObjKey,
            });
        }
    }

    const isNewObjArray = Array.isArray(newObj);

    for (const key in newObj) {
        if (!(key in obj)) {
            diffs.push({
                type: 'CREATE',
                path: [isNewObjArray ? Number(key) : key],
                value: newObj[key],
            });
        }
    }

    return diffs;
}
