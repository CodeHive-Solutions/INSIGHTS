const fullName = "RAMIREZ JULIO CESAR";

// Split the full name into individual names and last names
const nameParts = fullName.split(" ");

console.log(nameParts.length)
// Extract the first name
const firstName = nameParts.length === 2 ? nameParts[1] : nameParts.length > 2 ? nameParts[2] : "";
console.log(firstName)

// Extract the first last name (if exists)
const firstLastName = nameParts.length > 0 ? nameParts[0] : "";

// Create the formatted name
const formattedName = `${firstName} ${firstLastName}`.trim();

console.log(formattedName);