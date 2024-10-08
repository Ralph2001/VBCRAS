const obj = { char: 'Ñ Ñ' };
const jsonString = JSON.stringify(obj);
console.log(jsonString); // Check the JSON string
const parsed = JSON.parse(jsonString);
console.log(parsed.char); // Log the parsed character