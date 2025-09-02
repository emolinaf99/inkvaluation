/**
 * Composable para validaciones de seguridad de contraseñas
 * Implementa validaciones robustas para contraseñas seguras
 */

import { ref, computed } from 'vue'

export function useSecurityPassword() {
  const password = ref('')
  const confirmPassword = ref('')

  // Reglas de validación de contraseña segura
  const passwordRules = {
    minLength: 6,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    forbiddenPatterns: [
      /(.)\1{2,}/g, // Más de 2 caracteres repetidos consecutivos
      /123|234|345|456|567|678|789|890/g, // Secuencias numéricas
      /abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/gi // Secuencias alfabéticas
    ],
    forbiddenWords: [
      'password', 'contraseña', 'admin', 'usuario', 'user', 'login',
      'qwerty', 'asdf', 'zxcvbn', '12345', 'abc123', 'password123'
    ]
  }

  // Validar longitud
  const hasValidLength = computed(() => {
    return password.value.length >= passwordRules.minLength && 
           password.value.length <= passwordRules.maxLength
  })

  // Validar mayúsculas
  const hasUppercase = computed(() => {
    return /[A-Z]/.test(password.value)
  })

  // Validar minúsculas
  const hasLowercase = computed(() => {
    return /[a-z]/.test(password.value)
  })

  // Validar números
  const hasNumbers = computed(() => {
    return /[0-9]/.test(password.value)
  })

  // Validar caracteres especiales
  const hasSpecialChars = computed(() => {
    return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password.value)
  })

  // Validar patrones prohibidos
  const hasNoForbiddenPatterns = computed(() => {
    return !passwordRules.forbiddenPatterns.some(pattern => pattern.test(password.value))
  })

  // Validar palabras prohibidas
  const hasNoForbiddenWords = computed(() => {
    const lowerPassword = password.value.toLowerCase()
    return !passwordRules.forbiddenWords.some(word => lowerPassword.includes(word))
  })

  // Validar que las contraseñas coincidan
  const passwordsMatch = computed(() => {
    return password.value === confirmPassword.value && password.value.length > 0
  })

  // Calcular fortaleza de la contraseña (0-3 niveles)
  const passwordStrength = computed(() => {
    const pwd = password.value

    if (pwd.length === 0) return 0

    let criteriaCount = 0
    
    // Contar criterios cumplidos
    if (hasValidLength.value) criteriaCount++
    if (hasUppercase.value) criteriaCount++
    if (hasLowercase.value) criteriaCount++
    if (hasNumbers.value) criteriaCount++
    if (hasSpecialChars.value) criteriaCount++

    // Penalizar si tiene patrones o palabras prohibidas
    if (!hasNoForbiddenPatterns.value || !hasNoForbiddenWords.value) {
      criteriaCount = Math.max(0, criteriaCount - 1)
    }

    return criteriaCount
  })

  // Nivel de fortaleza textual
  const strengthLevel = computed(() => {
    const strength = passwordStrength.value
    if (strength <= 2) return 'Débil'
    if (strength <= 4) return 'Medio' 
    if (strength === 5) return 'Fuerte'
    return 'Débil'
  })

  // Color para mostrar la fortaleza
  const strengthColor = computed(() => {
    const strength = passwordStrength.value
    if (strength <= 2) return '#ef4444' // Rojo
    if (strength <= 4) return '#eab308' // Amarillo
    if (strength === 5) return '#22c55e' // Verde
    return '#ef4444' // Rojo por defecto
  })

  // Validación completa de la contraseña (requiere los 5 criterios)
  const isPasswordValid = computed(() => {
    return passwordStrength.value === 5
  })

  // Obtener errores de validación
  const getPasswordErrors = () => {
    const errors = []

    if (!hasValidLength.value) {
      errors.push(`La contraseña debe tener entre ${passwordRules.minLength} y ${passwordRules.maxLength} caracteres`)
    }
    if (!hasUppercase.value) {
      errors.push('Debe contener al menos una letra mayúscula')
    }
    if (!hasLowercase.value) {
      errors.push('Debe contener al menos una letra minúscula')
    }
    if (!hasNumbers.value) {
      errors.push('Debe contener al menos un número')
    }
    if (!hasSpecialChars.value) {
      errors.push('Debe contener al menos un carácter especial (!@#$%^&*)')
    }
    if (!hasNoForbiddenPatterns.value) {
      errors.push('No debe contener patrones repetitivos o secuencias obvias')
    }
    if (!hasNoForbiddenWords.value) {
      errors.push('No debe contener palabras comunes o predecibles')
    }

    return errors
  }

  // Obtener errores de confirmación
  const getConfirmErrors = () => {
    const errors = []
    
    if (confirmPassword.value.length > 0 && !passwordsMatch.value) {
      errors.push('Las contraseñas no coinciden')
    }

    return errors
  }

  // Validar contraseña y devolver resultado completo
  const validatePassword = (pwd, confirmPwd = '') => {
    password.value = pwd
    confirmPassword.value = confirmPwd

    const passwordErrors = getPasswordErrors()
    const confirmErrors = getConfirmErrors()

    return {
      isValid: isPasswordValid.value && (confirmPwd ? passwordsMatch.value : true),
      strength: passwordStrength.value,
      strengthLevel: strengthLevel.value,
      strengthColor: strengthColor.value,
      errors: {
        password: passwordErrors,
        confirm: confirmErrors
      },
      checks: {
        hasValidLength: hasValidLength.value,
        hasUppercase: hasUppercase.value,
        hasLowercase: hasLowercase.value,
        hasNumbers: hasNumbers.value,
        hasSpecialChars: hasSpecialChars.value,
        hasNoForbiddenPatterns: hasNoForbiddenPatterns.value,
        hasNoForbiddenWords: hasNoForbiddenWords.value,
        passwordsMatch: passwordsMatch.value
      }
    }
  }

  return {
    password,
    confirmPassword,
    passwordStrength,
    strengthLevel,
    strengthColor,
    isPasswordValid,
    passwordsMatch,
    validatePassword,
    getPasswordErrors,
    getConfirmErrors,
    passwordRules
  }
}