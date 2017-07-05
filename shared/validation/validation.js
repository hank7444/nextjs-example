const isEmpty = value => value === undefined || value === null || value === '';
const join = (rules) => (value, data) => rules.map(rule => rule(value, data)).filter(error => !!error)[0 /* first error */ ];

export function email(value) {
  // Let's not start a debate on email regex. This is just for an example app!
  if (!/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/i.test(value)) {
    return 'email';
  }
}

export function password(value) {
  if (isEmpty(value)) {
    return 'password';
  }
}

export function required(value) {
  if (isEmpty(value)) {
    return 'required';
  }
}

export function minLength(min) {
  return (value) => {
    if (!isEmpty(value) && value.length < min) {
      return `Please enter at least ${min} characters.`;
    }
  };
}

export function maxLength(max) {
  return (value) => {
    if (!isEmpty(value) && value.length > max) {
      return `Please enter no more than ${max} characters.`;
    }
  };
}

export function number(value) {
  if (!/^(?:(?:0|[1-9][0-9]*)(?:\.[0-9]*)?|\.[0-9]+)$/.test(value)) {
    return 'number';
  }
}

export function match(field, msg) {
  return (value, data) => {
    if (data) {
      if (value !== data[field]) {
        return msg || `Do not match field ${field}`;
      }
    }
  };
}

const ruleBuilder = (rules, value, data, pkey, index) => {
  // 如果欄位沒有驗證規則，直接通過
  if (!rules) {
    return '';
  }
  return rules.map((rule) => {
    if (Array.isArray(value)) {
      return value.map((valueChild, i) => {
        return ruleBuilder(rules, valueChild, data, pkey, i);
      });
    } else if (value && typeof value === 'object') {
      const error = {};
      Object.keys(value).forEach((key) => {
        error[key] = ruleBuilder(rule[key], value[key], data, pkey, index);
      });
      return error;
    }
    return rule(value, data, pkey, index);
  }).filter(error => !!error)[0]; // first error
};

export function joinRules(rules) {
  return (value, data, key) => {
    return ruleBuilder(rules, value, data, key);
  };
}

export function createValidator(rules, i18nHash = {}) {
  return (data = {}) => {
    const errors = {};
    Object.keys(rules).forEach((key) => {
      const rule = joinRules([].concat(rules[key])); // concat enables both functions and arrays of functions
      let error = rule(data[key], data, key);

      if (i18nHash[key] && i18nHash[key][error]) {
        error = i18nHash[key][error];
      }

      if (error) {
        errors[key] = error;
      }
    });
    return errors;
  };
}

export function passwordLength(value) {
  if (!/^.{8,16}$/.test(value)) {
    return 'passwordLength';
  }
}

export function passwordOneUppercaseLetter(value) {
  if (!/.*[A-Z]/.test(value)) {
    return 'passwordOneUppercaseLetter';
  }
}

export function passwordOneLowercaseLetter(value) {
  if (!/.*[a-z]/.test(value)) {
    return 'passwordOneLowercaseLetter';
  }
}

export function passwordOneNumber(value) {
  if (!/.*[0-9]/.test(value)) {
    return 'passwordOneNumber';
  }
}

export function passwordNoSpace(value) {
  if (!/^\S(?:[^\s]*)?$/.test(value)) {
    return 'passwordNoSpace';
  }
}
