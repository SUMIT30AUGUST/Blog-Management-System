function objectTrim(obj) {
    for (i in obj) {
        obj[i] = obj[i].trim();
    }
    return obj;
}

const checkConditionMulti = (arr) => {
    for (let val of arr) {
        val = val?.trim();
        if (!(val && val !== undefined && val !== "")) {
            return false;
        }
    }
    return true;
}

const generateSlug = (title) => {
    return title
      .toLowerCase()                    // Convert to lowercase
      .replace(/[^a-z0-9 ]/g, '')       // Remove special characters
      .trim()                           // Remove leading/trailing whitespace
      .split(' ')                       // Split by space
      .filter(Boolean)                 // Remove empty strings
      .join('-');                       // Join with dashes
  };
  

module.exports = {objectTrim , generateSlug ,checkConditionMulti}