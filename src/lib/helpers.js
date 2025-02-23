export function isValidEmail(email) {
  // Define a regular expression to validate email addresses
  // The pattern checks for the following:
  // 1. The local part (before @) allows letters, numbers, and special characters like . _ % + -
  // 2. The domain part (after @) allows letters, numbers, and hyphens, followed by a dot and at least 2 letters
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Test the input email against the regex and return true if it matches, false otherwise
  return emailRegex.test(email);
}
