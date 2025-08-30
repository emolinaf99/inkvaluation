<script setup>
    import {reactive,ref,onMounted,watch} from 'vue'
    import { RouterLink, RouterView } from 'vue-router'
    import { useApi } from '../js/useFetch.js'
    import { useI18n } from 'vue-i18n'
    const countries = ref([])
    const selectedCountry = ref(null)
    const isCountryDropdownOpen = ref(false)
    const countrySearchText = ref('')
    const filteredCountries = ref([])
    
    const { t, locale } = useI18n()

    const formData = ref({
        nombre: '',
        apellido:'',
        fechaDeNacimiento: '',
        pais: '',
        telefono: '',
        email: '',
        contrasena: '',
        comoNosConociste: ''
    });

    const submitRegister = () => {
        // Aquí puedes manejar la lógica para enviar los datos del formulario
        console.log('Datos enviados:', formData.value);
        // Por ejemplo, puedes llamar a una función para enviar los datos a través de una API
        // o realizar alguna acción específica con los datos del formulario.
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
                    .map(country => ({
                        name: country.name.common,
                        nameSpanish: country.name.common,
                        code: country.idd.root + (country.idd.suffixes[0] || ''),
                        flag: `https://flagcdn.com/24x18/${country.cca2.toLowerCase()}.png`,
                        cca2: country.cca2
                    }))
                    .filter(country => {
                        // Excluir solo códigos de 2 letras que no sean nombres reales
                        const isCodeOnly = country.name.length <= 2 && /^[A-Z]{2}$/.test(country.name);
                        return !isCodeOnly;
                    })
                    .sort((a, b) => a.nameSpanish.localeCompare(b.nameSpanish));
                
                countries.value = processedCountries;
                filteredCountries.value = processedCountries;
                
                // Seleccionar Colombia por defecto
                const colombia = processedCountries.find(c => c.nameSpanish.includes('Colombia') || c.code === '+57');
                if (colombia) {
                    selectedCountry.value = colombia;
                    formData.value.pais = colombia.nameSpanish;
                }
                
                console.log('Países cargados:', processedCountries.length);
            }
        } catch (error) {
            console.error('Error cargando países:', error);
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
            filteredCountries.value = countries.value.filter(country =>
                country.nameSpanish.toLowerCase().includes(searchValue.toLowerCase())
            );
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
        loadCountries();
        setTimeout(textoDinamico, 100);
    });

    
        
    

</script>

<template>
    <section class="sectionLoginAndRegister">
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
                </div>
                <div class="blockForm">
                    <label class="labelForm"for="">{{ $t('Apellido') }}</label>
                    <div class="blockInput">
                        <span class="blockIcon"><i class="fa-solid fa-file-signature"></i></span>
                        <input class="inputForm" type="text" placeholder="Ej: Gomez" v-model="formData.apellido">
                    </div>
                </div>
                <div class="blockForm">
                    <label class="labelForm"for="">{{ $t('Fecha de nacimiento') }}</label>
                    <div class="blockInput">
                        <span class="blockIcon"><i class="fa-regular fa-calendar"></i></span>
                        <input class="inputForm" type="date" v-model="formData.fechaDeNacimiento">
                    </div>
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
                                    v-for="country in filteredCountries" 
                                    :key="country.code" 
                                    class="country-option"
                                    @click="selectCountry(country)"
                                >
                                    <img :src="country.flag" :alt="country.nameSpanish" />
                                    <span>{{ country.nameSpanish }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
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
                </div>
                <div class="blockForm">
                    <label class="labelForm"for="">{{ $t('Correo') }}</label>
                    <div class="blockInput">
                        <span class="blockIcon"><i class="fa-regular fa-envelope"></i></span>
                        <input class="inputForm" type="email" v-model="formData.correo">
                    </div>
                </div>
                <div class="blockForm" style="margin-bottom: 1rem;">
                    <label class="labelForm"for="">{{ $t('Contraseña') }}</label>
                    <div class="blockInput">
                        <span class="blockIcon"><i class="fa-solid fa-key"></i></span>
                        <input class="inputForm" type="password" v-model="formData.contrasena">
                    </div>
                    <span class="passwordText">{{ $t('Mínimo 8 caracteres') }}</span>
                </div>
                <div class="blockForm">
                    <label class="labelForm"for="">{{ $t('Cómo nos conociste') }}</label>
                    <div class="blockInput">
                        <span class="blockIcon"><i class="fa-solid fa-globe"></i></span>
                        <select class="inputForm inputWithIcon" v-model="formData.comoNosConociste">
                            <option value="">{{ $t('Seleccione') }}</option>
                        </select>
                    </div>
                </div>

                <button class="btnSubmit" type="submit" style="margin-top: 1rem">{{ $t('Registrarse') }}</button>
                
                
            </form>
            
            

        </div>
        <div class="contenedorImagenRegister" id="contenedorImgRegister">
            <div class="alreadyExist" id="alreadyExistRegister"><span>{{ $t('¿Ya tienes una cuenta?') }}</span><RouterLink to="/login" class="btnLogin">{{ $t('Login') }}</RouterLink></div>
            <div class="contenedorTextoDinamico">
                <h2 style="height: 17rem;">{{ $t('Atiende a tus clientes mientras') }} <br><span id="dynamicText">{{ $t('Descansas') }}</span></h2>
            </div>
        </div>
    </section>
</template>


