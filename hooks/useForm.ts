import { useState } from "react";

interface ValidationRules {
  [key: string]: {
    required?: boolean;
    pattern?: RegExp;
    minLength?: number;
    errorMessage: string;
  };
}

interface FormErrors {
  [key: string]: string;
}

const useForm = (
  initialValues: Record<string, string>,
  validationRules: ValidationRules,
) => {
  const [form, setForm] = useState(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateField = (name: string, value: string): string => {
    const rules = validationRules[name];
    if (rules) {
      if (rules.required && !value) {
        return rules.errorMessage;
      }
      if (rules.pattern && !rules.pattern.test(value)) {
        return rules.errorMessage;
      }
      if (rules.minLength && value.length < rules.minLength) {
        return rules.errorMessage;
      }
    }
    return "";
  };

  const handleInputChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    Object.keys(form).forEach((key) => {
      const error = validateField(key, form[key]);
      if (error) {
        newErrors[key] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { form, errors, handleInputChange, validateForm };
};

export default useForm;
