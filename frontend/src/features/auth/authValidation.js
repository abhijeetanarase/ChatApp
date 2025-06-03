function validate(state, type) {
  const errors = {};

  if (type === "register") {
    const name = state.name.trim();
    if (!name) {
      errors.name = "Full Name is required";
    } else if (name.length < 4) {
      errors.name = "Full Name must be at least 4 characters long";
    } else if (name.length > 40) {
      errors.name = "Full Name must be at most 40 characters long";
    }
  }

  const email = state.email.trim();
  if (!email) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Email is invalid";
  } else if (email.length > 40) {
    errors.email = "Email must be at most 40 characters long";
  }

  const password = state.password.trim();
  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  } else if (password.length > 64) {
    errors.password = "Password must be at most 64 characters";
  }

  return errors;
}

export default validate;