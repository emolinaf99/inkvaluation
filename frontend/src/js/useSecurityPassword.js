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
    minLength: 8,
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

  // Calcular fortaleza de la contraseña (0-100)
  const passwordStrength = computed(() => {
    let score = 0
    const pwd = password.value

    if (pwd.length === 0) return 0

    // Longitud base (0-30 puntos)
    score += Math.min(pwd.length * 2, 30)

    // Diversidad de caracteres (0-40 puntos)
    if (hasUppercase.value) score += 10
    if (hasLowercase.value) score += 10
    if (hasNumbers.value) score += 10
    if (hasSpecialChars.value) score += 10

    // Bonus por longitud extra (0-20 puntos)
    if (pwd.length >= 12) score += 10
    if (pwd.length >= 16) score += 10

    // Penalizaciones (-30 puntos)
    if (!hasNoForbiddenPatterns.value) score -= 15
    if (!hasNoForbiddenWords.value) score -= 15

    return Math.max(0, Math.min(100, score))
  })

  // Nivel de fortaleza textual
  const strengthLevel = computed(() => {
    const strength = passwordStrength.value
    if (strength < 30) return 'Muy débil'
    if (strength < 50) return 'Débil'
    if (strength < 70) return 'Moderada'
    if (strength < 90) return 'Fuerte'
    return 'Muy fuerte'
  })

  // Color para mostrar la fortaleza
  const strengthColor = computed(() => {
    const strength = passwordStrength.value
    if (strength < 30) return '#ef4444' // Rojo
    if (strength < 50) return '#f97316' // Naranja
    if (strength < 70) return '#eab308' // Amarillo
    if (strength < 90) return '#22c55e' // Verde
    return '#16a34a' // Verde oscuro
  })

  // Validación completa de la contraseña
  const isPasswordValid = computed(() => {
    return hasValidLength.value &&
           hasUppercase.value &&
           hasLowercase.value &&
           hasNumbers.value &&
           hasSpecialChars.value &&
           hasNoForbiddenPatterns.value &&
           hasNoForbiddenWords.value
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