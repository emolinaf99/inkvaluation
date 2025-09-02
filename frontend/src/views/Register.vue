<script setup>
    import {reactive,ref,onMounted,onUnmounted,watch} from 'vue'
    import { RouterLink, RouterView, useRouter } from 'vue-router'
    import { useApi } from '../js/useFetch.js'
    import { validateForm } from '../js/validateForm.js'
    import { mostrarNotificacion } from '../js/mensajeNotificacionFront.js'
    import { useI18n } from 'vue-i18n'
    import { useSecurityPassword } from '../js/useSecurityPassword.js'
    const countries = ref([])
    const selectedCountry = ref(null)
    const isCountryDropdownOpen = ref(false)
    const countrySearchText = ref('')
    const filteredCountries = ref([])
    const comoNosConociste_opciones = ref([])
    
    const { t, locale } = useI18n()
    const router = useRouter()

    const formData = ref({
        nombre: '',
        apellido:'',
        fechaDeNacimiento: '',
        pais: '',
        telefono: '',
        email: '',
        contrasena: '',
        confirmarContrasena: '',
        comoNosConociste: ''
    });

    const errors = ref({});
    const isSubmitting = ref(false);

    // Usar el composable de seguridad de contraseñas
    const { validatePassword } = useSecurityPassword();
    const passwordValidation = ref(null);

    // Validar contraseña en tiempo real
    const validatePasswordStrength = () => {
        if (formData.value.contrasena) {
            passwordValidation.value = validatePassword(formData.value.contrasena, formData.value.confirmarContrasena);
        } else {
            passwordValidation.value = null;
        }
    };

    // Watch para validar contraseña en tiempo real
    watch(() => formData.value.contrasena, validatePasswordStrength);
    watch(() => formData.value.confirmarContrasena, validatePasswordStrength);
    const showPassword = ref(false);
    const showConfirmPassword = ref(false);

    const togglePasswordVisibility = () => {
        showPassword.value = !showPassword.value;
    };

    const toggleConfirmPasswordVisibility = () => {
        showConfirmPassword.value = !showConfirmPassword.value;
    };

    const submitRegister = async () => {
        if (isSubmitting.value) return;

        // Validaciones frontend básicas
        const validationRules = {
            nombre: { required: true, minLength: 1, maxLength: 50 },
            apellido: { required: true, minLength: 1, maxLength: 50 },
            fechaDeNacimiento: { required: true },
            telefono: { required: true, minLength: 7, maxLength: 20 },
            email: { required: true, email: true },
            comoNosConociste: { required: true }
        };

        // Limpiar errores previos
        errors.value = {};

        // Validación personalizada para país
        if (!selectedCountry.value) {
            errors.value.pais = 'Debe seleccionar un país';
        }

        // Validar contraseña con useSecurityPassword
        const passwordValidationResult = validatePassword(formData.value.contrasena, formData.value.confirmarContrasena);
        
        if (!passwordValidationResult.isValid) {
            if (passwordValidationResult.errors.password.length > 0) {
                errors.value.contrasena = passwordValidationResult.errors.password[0];
            }
            if (passwordValidationResult.errors.confirm.length > 0) {
                errors.value.confirmarContrasena = passwordValidationResult.errors.confirm[0];
            }
        }

        const frontendErrors = validateForm(formData.value, validationRules);
        errors.value = { ...errors.value, ...frontendErrors };

        if (Object.keys(errors.value).length > 0) {
            mostrarNotificacion('Por favor corrige los errores en el formulario', 0);
            return;
        }

        isSubmitting.value = true;

        try {
            // Preparar datos para backend
            const registerData = {
                nombre: formData.value.nombre,
                apellido: formData.value.apellido,
                email: formData.value.email,
                password: formData.value.contrasena,
                telefono: formData.value.telefono,
                pais_residencia: selectedCountry.value?.cca2 || formData.value.pais,
                fecha_nacimiento: formData.value.fechaDeNacimiento,
                como_nos_conociste_id: formData.value.comoNosConociste
            };

            const { data, error } = await useApi('/api/auth/register', 'POST', registerData);

            if (error.value) {
                // Manejar errores del backend
                if (error.value.response?.data?.errors) {
                    // Errores de validación express-validator
                    const backendErrors = {};
                    error.value.response.data.errors.forEach(err => {
                        // Mapear campos del backend al frontend
                        const fieldMap = {
                            'nombre': 'nombre',
                            'apellido': 'apellido',
                            'email': 'email',
                            'contrasena': 'contrasena',
                            'confirmarContrasena': 'confirmarContrasena',
                            'fechaDeNacimiento': 'fechaDeNacimiento',
                            'telefono': 'telefono',
                            'paisDeResidencia': 'pais',
                            'comoNosConociste': 'comoNosConociste'
                        };
                        const frontendField = fieldMap[err.path] || err.path;
                        backendErrors[frontendField] = err.msg;
                    });
                    errors.value = { ...errors.value, ...backendErrors };
                    mostrarNotificacion('Por favor corrige los errores señalados', 0);
                } else {
                    mostrarNotificacion(error.value.response?.data?.message || 'Error en el registro', 0);
                }
            } else if (data.value?.success) {
                mostrarNotificacion('¡Cuenta creada exitosamente! Revisa tu correo para la confirmación.', 1);
                // Redirigir al dashboard ya que el usuario está automáticamente logueado
                setTimeout(() => {
                    router.push('/account');
                }, 2000);
            }

        } catch (error) {
            console.error('Error en registro:', error);
            mostrarNotificacion('Error de conexión', 0);
        } finally {
            isSubmitting.value = false;
        }
    };

    // Cargar países con prefijos telefónicos
    const loadCountries = async () => {
        try {
            const { data, error } = await useApi('https://restcountries.com/v3.1/all?fields=name,idd,flag,cca2');
            
            if (!error.value && data.value) {
                // Procesar y ordenar países
                const processedCountries = data.value
                    .filter(country => 
                        country.idd?.root && 
                        country.idd?.suffixes && 
                        country.name?.common &&
                        country.name.common.length > 2 // Filtrar códigos muy cortos
                    )
                    .map(country => {
                        const countryData = {
                            name: country.name.common,
                            nameSpanish: country.name.common,
                            code: country.idd.root + (country.idd.suffixes[0] || ''),
                            flag: `https://flagcdn.com/24x18/${country.cca2.toLowerCase()}.png`,
                            cca2: country.cca2
                        };
                        
                        
                        return countryData;
                    })
                    .filter(country => {
                        // Excluir solo códigos de 2 letras que no sean nombres reales
                        const isCodeOnly = country.name.length <= 2 && /^[A-Z]{2}$/.test(country.name);
                        return !isCodeOnly;
                    })
                    .sort((a, b) => a.nameSpanish.localeCompare(b.nameSpanish));
                
                countries.value = processedCountries;
                filteredCountries.value = processedCountries;
                
                // No seleccionar país por defecto para forzar validación
                // const colombia = processedCountries.find(c => c.nameSpanish.includes('Colombia') || c.code === '+57');
                // if (colombia) {
                //     selectedCountry.value = colombia;
                //     formData.value.pais = colombia.nameSpanish;
                // }
                
                console.log('Países cargados:', processedCountries.length);
            }
        } catch (error) {
            console.error('Error cargando países:', error);
        }
    };

    // Cargar opciones de "Cómo nos conociste"
    const loadComoNosConociste = async () => {
        try {
            const { data, error } = await useApi('/api/user/como-nos-conociste');
            
            if (!error.value && data.value?.success) {
                comoNosConociste_opciones.value = data.value.opciones;
                console.log('Opciones "Cómo nos conociste" cargadas:', data.value.opciones.length);
            }
        } catch (error) {
            console.error('Error cargando opciones "Cómo nos conociste":', error);
        }
    };

    // Manejar cambio de país
    const handleCountryChange = (event) => {
        const countryName = event.target.value;
        const country = countries.value.find(c => c.nameSpanish === countryName);
        selectedCountry.value = country;
        formData.value.pais = countryName;
    };

    // Manejar custom dropdown
    const toggleCountryDropdown = () => {
        isCountryDropdownOpen.value = !isCountryDropdownOpen.value;
        if (isCountryDropdownOpen.value) {
            countrySearchText.value = '';
            filteredCountries.value = countries.value;
        }
    };

    const selectCountry = (country) => {
        selectedCountry.value = country;
        formData.value.pais = country.nameSpanish;
        countrySearchText.value = '';
        isCountryDropdownOpen.value = false;
    };

    const handleCountrySearch = (event) => {
        const searchValue = event.target.value;
        countrySearchText.value = searchValue;
        
        if (searchValue.trim() === '') {
            filteredCountries.value = countries.value;
        } else {
            const search = searchValue.toLowerCase().trim();
            
            filteredCountries.value = countries.value.filter(country => {
                const countryName = country.nameSpanish.toLowerCase();
                
                // Solo mostrar países que contengan exactamente la secuencia escrita
                return countryName.includes(search);
            });
        }
        
        if (!isCountryDropdownOpen.value) {
            isCountryDropdownOpen.value = true;
        }
    };

    const handleCountryInputFocus = () => {
        isCountryDropdownOpen.value = true;
        filteredCountries.value = countries.value;
    };


    
    function textoDinamico() {
        const textElement = document.getElementById('dynamicText');
        
        if (!textElement) {
            console.warn('Element dynamicText not found');
            return;
        }
        
        // Obtener las traducciones según el idioma actual
        const getTranslatedWords = () => {
            return [
                t('tatúas'),
                t('diseñas'), 
                t('descansas')
            ];
        };
        
        let words = getTranslatedWords();
        let currentWordIndex = 0;
        let currentCharIndex = 0;
        let isDeleting = false;
        let pause = false;

        function type() {
            if (!textElement) return;
            
            if (pause) {
            setTimeout(() => {
                pause = false;
                type();
            }, 500);
            return;
            }

            const currentWord = words[currentWordIndex];
            if (isDeleting) {
            textElement.textContent = currentWord.substring(0, currentCharIndex - 1);
            currentCharIndex--;
            if (currentCharIndex === 0) {
                isDeleting = false;
                currentWordIndex = (currentWordIndex + 1) % words.length;
                pause = true;
            }
            } else {
            textElement.textContent = currentWord.substring(0, currentCharIndex + 1);
            currentCharIndex++;
            if (currentCharIndex === currentWord.length) {
                isDeleting = true;
                pause = true;
            }
            }

            const speed = isDeleting ? 80 : 130;
            setTimeout(type, speed);
        }

        // Actualizar palabras cuando cambie el idioma
        watch(locale, () => {
            words = getTranslatedWords();
            currentWordIndex = 0;
            currentCharIndex = 0;
            isDeleting = false;
        });

        type();
    }

    onMounted(() => {
        // Agregar clase específica al body para estilos de registro
        document.body.classList.add('register-page');
        
        loadCountries();
        loadComoNosConociste();
        setTimeout(textoDinamico, 100);
    });

    // Limpiar la clase al desmontar el componente
    onUnmounted(() => {
        document.body.classList.remove('register-page');
    });

    
        
    

</script>

<template>
    <section class="sectionLoginAndRegister sRegister">
        <div class="contenedorForm" id="contenedorFormRegister">
            <div class="contenedorLogoForm">
                <RouterLink to="/"><img class="logoApp" src="/img/InkValuationLogo.png" alt=""></RouterLink>
            </div>
            <h2>{{ $t('Registro') }}</h2>
            
            <div class="alreadyEx"><RouterLink to="/login" style="color: #039BE5;"><span>{{ $t('¿Ya tienes una cuenta?') }}</span> {{ $t('haz click aquí') }}</RouterLink></div>
            
            <form class="generalForm" @submit.prevent="submitRegister" >
                <!-- <div class="blockForm">
                    <label class="labelForm"for="">Tipo de cuenta</label>
                    <div class="blockInput">
                        <span class="blockIcon"><i class="fa-regular fa-user"></i></span>
                        <select class="inputForm" v-model="formData.tipoCuenta">
                            <option value="">Seleccione</option>
                        </select>
                    </div>
                </div> -->
                <!-- <div class="blockForm">
                    <label class="labelForm"for="">Nombre de tu negocio</label>
                    <div class="blockInput">
                        <span class="blockIcon"><i class="fa-solid fa-shop"></i></span>
                        <input class="inputForm" type="text" placeholder="Ej: InkValuation" v-model="formData.nombreNegocio">
                    </div>
                </div> -->
                <div class="blockForm">
                    <label class="labelForm"for="">{{ $t('Nombre') }}</label>
                    <div class="blockInput">
                        <span class="blockIcon"><i class="fa-regular fa-user"></i></span>
                        <input class="inputForm" type="text" placeholder="Ej: Sergio" v-model="formData.nombre">
                    </div>
                    <div class="error" v-if="errors.nombre">{{ errors.nombre }}</div>
                </div>
                <div class="blockForm">
                    <label class="labelForm"for="">{{ $t('Apellido') }}</label>
                    <div class="blockInput">
                        <span class="blockIcon"><i class="fa-solid fa-file-signature"></i></span>
                        <input class="inputForm" type="text" placeholder="Ej: Gomez" v-model="formData.apellido">
                    </div>
                    <div class="error" v-if="errors.apellido">{{ errors.apellido }}</div>
                </div>
                <div class="blockForm">
                    <label class="labelForm"for="">{{ $t('Fecha de nacimiento') }}</label>
                    <div class="blockInput">
                        <span class="blockIcon"><i class="fa-regular fa-calendar"></i></span>
                        <input class="inputForm" type="date" v-model="formData.fechaDeNacimiento">
                    </div>
                    <div class="error" v-if="errors.fechaDeNacimiento">{{ errors.fechaDeNacimiento }}</div>
                </div>
                <div class="blockForm">
                    <label class="labelForm"for="">{{ $t('País de residencia') }}</label>
                    <div class="blockInput">
                        <span class="blockIcon"><i class="fa-solid fa-earth-americas"></i></span>
                        <div class="custom-country-selector" :class="{ 'focused': isCountryDropdownOpen }">
                            <div v-if="!isCountryDropdownOpen" class="country-selector-display" @click="toggleCountryDropdown">
                                <div v-if="selectedCountry" class="selected-country">
                                    <img :src="selectedCountry.flag" :alt="selectedCountry.nameSpanish" />
                                    <span>{{ selectedCountry.nameSpanish }}</span>
                                </div>
                                <div v-else class="placeholder-country">
                                    <span>{{ $t('Seleccione') }}</span>
                                </div>
                                <i class="fa-solid fa-chevron-down dropdown-arrow"></i>
                            </div>
                            <div v-else class="search-mode">
                                <input 
                                    class="country-search-input"
                                    type="text"
                                    :placeholder="$t('Seleccione')"
                                    v-model="countrySearchText"
                                    @input="handleCountrySearch"
                                    ref="countryInput"
                                />
                                <i class="fa-solid fa-chevron-up dropdown-arrow" @click="toggleCountryDropdown"></i>
                            </div>
                            <div v-if="isCountryDropdownOpen" class="country-dropdown">
                                <div 
                                    v-for="(country, index) in filteredCountries" 
                                    :key="`${country.cca2}-${index}`" 
                                    class="country-option"
                                    @click="selectCountry(country)"
                                >
                                    <img :src="country.flag" :alt="country.nameSpanish" />
                                    <span>{{ country.nameSpanish }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="error" v-if="errors.pais">{{ errors.pais }}</div>
                </div>
                <div class="blockForm">
                    <label class="labelForm"for="">{{ $t('Teléfono') }}</label>
                    <div class="blockInput" style="position: relative;">
                        <span class="blockIcon"><i class="fa-solid fa-phone"></i></span>
                        <div v-if="selectedCountry" class="phone-prefix">{{ selectedCountry.code }}</div>
                        <input 
                            class="inputForm" 
                            type="tel" 
                            :placeholder="selectedCountry ? 'Ej: 3001234567' : $t('Seleccione país primero')"
                            v-model="formData.telefono"
                            :style="selectedCountry ? 'padding-left: 70px;' : ''"
                        >
                    </div>
                    <div class="error" v-if="errors.telefono">{{ errors.telefono }}</div>
                </div>
                <div class="blockForm">
                    <label class="labelForm"for="">{{ $t('Correo') }}</label>
                    <div class="blockInput">
                        <span class="blockIcon"><i class="fa-regular fa-envelope"></i></span>
                        <input class="inputForm" type="email" v-model="formData.email">
                    </div>
                    <div class="error" v-if="errors.email">{{ errors.email }}</div>
                </div>
                <div class="blockForm">
                    <label class="labelForm"for="">{{ $t('Contraseña') }}</label>
                    <div class="blockInput">
                        <span class="blockIcon"><i class="fa-solid fa-key"></i></span>
                        <input class="inputForm" :type="showPassword ? 'text' : 'password'" v-model="formData.contrasena">
                        <span class="eyePassword" @click="togglePasswordVisibility">
                            <i :class="showPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'"></i>
                        </span>
                    </div>
                    
                    <!-- Indicador de fortaleza de contraseña -->
                    <div v-if="passwordValidation && formData.contrasena" class="password-strength">
                        <div class="strength-bar">
                            <div 
                                class="strength-fill" 
                                :style="{ 
                                    width: (passwordValidation.strength / 5) * 100 + '%', 
                                    backgroundColor: passwordValidation.strengthColor 
                                }"
                            ></div>
                        </div>
                        <div class="strength-text" :style="{ color: passwordValidation.strengthColor }">
                            {{ $t('Fortaleza') }}: {{ $t(passwordValidation.strengthLevel) }}
                        </div>
                    </div>
                    
                    <div class="error" v-if="errors.contrasena">{{ errors.contrasena }}</div>
                    <span class="passwordText" v-if="!formData.contrasena">{{ $t('Crea una contraseña segura con mayúsculas, minúsculas, números y símbolos') }}</span>
                </div>
                <div class="blockForm" style="margin-bottom: 1rem;">
                    <label class="labelForm"for="">{{ $t('Confirmar contraseña') }}</label>
                    <div class="blockInput">
                        <span class="blockIcon"><i class="fa-solid fa-key"></i></span>
                        <input class="inputForm" :type="showConfirmPassword ? 'text' : 'password'" v-model="formData.confirmarContrasena">
                        <span class="eyePassword" @click="toggleConfirmPasswordVisibility" >
    
                            <i :class="showConfirmPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'"></i>
                        </span>
                    </div>
                    <div class="error" v-if="errors.confirmarContrasena">{{ errors.confirmarContrasena }}</div>
                </div>
                <div class="blockForm">
                    <label class="labelForm"for="">{{ $t('Cómo nos conociste') }}</label>
                    <div class="blockInput">
                        <span class="blockIcon"><i class="fa-solid fa-globe"></i></span>
                        <select class="inputForm inputWithIcon" v-model="formData.comoNosConociste">
                            <option value="">{{ $t('Seleccione') }}</option>
                            <option 
                                v-for="opcion in comoNosConociste_opciones" 
                                :key="opcion.Id" 
                                :value="opcion.Id"
                            >
                                {{ $t(opcion.Descripcion) }}
                            </option>
                        </select>
                    </div>
                    <div class="error" v-if="errors.comoNosConociste">{{ errors.comoNosConociste }}</div>
                </div>

                <button class="btnSubmit" type="submit" style="margin-top: 1rem" :disabled="isSubmitting">
                    {{ isSubmitting ? $t('Registrando...') : $t('Registrarse') }}
                </button>
                
                
            </form>
            
            

        </div>
        <div class="contenedorImagenRegisterNew" id="contenedorImgRegister">
            <div class="alreadyExist" id="alreadyExistRegister"><span>{{ $t('¿Ya tienes una cuenta?') }}</span><RouterLink to="/login" class="btnLogin">{{ $t('Login') }}</RouterLink></div>
            <div class="contenedorTextoDinamico">
                <h2 style="height: 17rem;">{{ $t('Atiende a tus clientes mientras') }} <br><span id="dynamicText">{{ $t('Descansas') }}</span></h2>
            </div>
        </div>
    </section>
</template>

<style scoped>
.password-strength {
    margin-top: 8px;
    margin-bottom: 4px;
    width: 100%;
}

.strength-bar {
    width: 100%;
    height: 6px;
    background-color: #e5e7eb;
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 6px;
}

.strength-fill {
    height: 100%;
    transition: width 0.3s ease, background-color 0.3s ease;
    border-radius: 3px;
}

.strength-text {
    font-size: 12px;
    font-weight: 500;
    margin-top: 4px;
}

.passwordText {
    font-size: 12px;
    color: white;
    margin-top: 4px;
}
</style>


