export const passwordValidation = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
);

export const numberValidation = new RegExp(/^\d+$/);

export const validationMessage = {
  require: "This field is required",
  number: "Value is not a number.",
  password: "Must include Uppercase,Lowercase,Number and Special Character",
};
