export const formatError = (label: String, override: object = {}) => {
        return {
                'string.base': `${label} should be a string`,
                'string.min': `${label} should contain at least {#limit} characters`,
                'string.max': `${label} should contain less than or equal {#limit} characters`,
                'string.alphanum': `${label} should contain letters and numbers`,
                'string.pattern.base': `${label} should follow pattern`,
                'number.base': `${label} should be a number`,
                'number.min': `${label} should be greater than or equal {#limit}`,
                'number.max': `${label} should be less than or equal {#limit}`,
                'any.required': `${label} should not be empty`,
                'any.only': `${label} should be`,
                'boolean.base': `${label} should be a boolean`,
                ...override,
        };
};
