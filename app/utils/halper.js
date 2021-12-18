/**
 * @param {string} email
 * @returns {boolean}
 */
const isValidEmail = (email) => Boolean(
  email
  && email.length
  && email.length > 0
  && /^[a-zA-Z0-9.]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email),
);

export {
  isValidEmail,
};
