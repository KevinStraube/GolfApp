/**
 * Helper function to concatenate 2 matched user IDs
 * Used to create new doc of 2 matched users
 * @param {*} id1 - first ID
 * @param {*} id2 - second ID
 * @returns concatenated string of 2 IDs
 */

const generateId = (id1, id2) => {
    if (id1 > id2) {
        return id1 + id2;
    } else {
        return id2 + id1;
    }
}

export default generateId;