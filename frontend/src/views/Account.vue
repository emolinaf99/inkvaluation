<script setup>
    import {reactive,ref, onMounted, computed, watch} from 'vue'
    import NewPassword from '../components/NewPassword.vue'
    import { RouterLink } from 'vue-router';
    import {checkOptAssistant} from '/src/js/checkOpt.js'
    import {mostrarNotificacion} from '/src/js/mensajeNotificacionFront.js'
    import {services} from '/src/data/services.js'

    const state = reactive({
        services: services
    })
    
    // Estado para servicios del usuario
    const userServices = ref([])
    const loadingUserServices = ref(false)
    import { useUserStore } from '../js/stores/userLogged.js';

    const userStore = useUserStore();
    const userLogged = computed(() => userStore.userLogged);
    import {useApi} from '/src/js/useFetch.js'
    import {mostrarFileEnImgPreview} from '/src/js/previewFile.js'
    import {validateForm} from '/src/js/validateForm.js'
    import AccountSkeleton from '../components/skeletons/AccountSkeleton.vue'
    import { useSkeleton } from '../js/useSkeleton.js'
    import { useI18n } from 'vue-i18n'

    const { isLoading, isFading, startLoading, finishLoading } = useSkeleton()
    const { t } = useI18n()

    const countries = ref(null) // valor de paises inicialmente
    const selectedCountryForPhone = ref(null) // país seleccionado para prefijo telefónico

    const isAutomaticRenewalEnabled = computed(() => {
        return userLogged.value?.UserSuscription?.Automatic_Renovation === 1 || userLogged.value?.UserSuscription?.Automatic_Renovation === true;
    });


    const imgPreview = ref(null); // Referencia a la imagen

    // Computed property para la URL de la imagen
    const imageUrl = computed(() => {
        if (!formPersonalData.imgPerfil) {
            // Si no hay imagen, mostrar por defecto
            return '/img/perfilSinImagen.png';
        }
        
        if (formPersonalData.imgPerfil instanceof File) {
            // Si es un archivo seleccionado, crear URL temporal
            return URL.createObjectURL(formPersonalData.imgPerfil);
        } 
        
        if (typeof formPersonalData.imgPerfil === 'string' && formPersonalData.imgPerfil.length > 0) {
            // Si es una string (URL del servidor)
            return formPersonalData.imgPerfil.startsWith('http') 
                ? formPersonalData.imgPerfil 
                : `${formPersonalData.imgPerfil}`;
        }
        
        // Fallback por defecto
        return '/img/perfilSinImagen.png';
    });

    // Cambiar imagen de perfil inmediatamente se suba al input
    const handleImageChange = (event) => {
        const file = event.target.files[0]; // Obtiene el archivo seleccionado
        if (file) {
            formPersonalData.imgPerfil = file; // Almacena el archivo en el estado
            console.log("Archivo seleccionado:", file);
            // El computed property imageUrl se encargará de mostrar la vista previa automáticamente
        }
    };

    // Función para eliminar imagen de perfil
    const removeProfileImage = async () => {
        if (formPersonalData.imgPerfil && typeof formPersonalData.imgPerfil === 'string') {
            // Si hay una imagen en el servidor, eliminarla
            try {
                const { data, error } = await useApi('/api/user/upload-profile-image', 'DELETE');
                if (data.value?.success) {
                    formPersonalData.imgPerfil = '';
                    userStore.updateUserProfilePicture('');
                    mostrarNotificacion('Imagen de perfil eliminada', 1);
                } else if (error.value) {
                    mostrarNotificacion(error.value.message || 'Error eliminando imagen', 0);
                }
            } catch (error) {
                mostrarNotificacion('Error eliminando imagen', 0);
            }
        } else {
            // Si es solo una imagen temporal (File) o está vacía, simplemente limpiarla
            formPersonalData.imgPerfil = '';
            // El computed property imageUrl se encargará de mostrar la imagen por defecto automáticamente
        }
    };

    

    // Estado del formulario para actualizar datos personales
    const formPersonalData = reactive({
        imgPerfil: '',
        nombre: '',
        apellido: '',
        paisResidencia: '',
        telefono: '',
        correo: ''
    })
    
    // Función para obtener servicios activos del usuario (funcionalidad deshabilitada)
    const getUserServices = async () => {
        loadingUserServices.value = true
        try {
            // Simular carga ya que los servicios fueron removidos del microservicio
            userServices.value = []
            console.log('Servicios deshabilitados en el microservicio de autenticación')
        } catch (error) {
            console.error('Error al cargar servicios:', error)
        } finally {
            loadingUserServices.value = false
        }
    }
    
    // Función para activar/desactivar servicio (deshabilitada)
    const toggleService = async (service) => {
        mostrarNotificacion('Funcionalidad de servicios no disponible en este microservicio', 0)
        console.log('Toggle de servicios deshabilitado - microservicio de autenticación pura')
    }
    
    // Computed para verificar si un servicio está activo
    const isServiceActive = (serviceId) => {
        return userServices.value.some(userService => 
            userService.Service_Id === serviceId && userService.Is_Active
        )
    }
    
    // Watch para actualizar form cuando userLogged cambie
    watch(() => userLogged.value, (newUser) => {
        if (newUser) {
            formPersonalData.imgPerfil = newUser.Profile_Picture || '';
            formPersonalData.nombre = newUser.Nombre || '';
            formPersonalData.apellido = newUser.Apellido || '';
            formPersonalData.paisResidencia = newUser.Pais_Residencia || '';
            
            // Procesar teléfono para separar prefijo del número
            if (newUser.Telefono) {
                // Si el teléfono ya tiene prefijo, separarlo
                if (newUser.Telefono.startsWith('+') && countries.value) {
                    // Buscar el país que coincida con el prefijo
                    let phoneNumber = newUser.Telefono;
                    for (const country of countries.value) {
                        if (newUser.Telefono.startsWith(country.phoneCode)) {
                            phoneNumber = newUser.Telefono.substring(country.phoneCode.length);
                            break;
                        }
                    }
                    formPersonalData.telefono = phoneNumber;
                } else {
                    formPersonalData.telefono = newUser.Telefono;
                }
            }
            
            formPersonalData.correo = newUser.Email || '';
        }
    }, { immediate: true })

    // Watch para actualizar prefijo telefónico cuando cambie el país
    watch(() => formPersonalData.paisResidencia, (newCountryCode) => {
        if (newCountryCode && countries.value) {
            const country = countries.value.find(c => c.cca2 === newCountryCode);
            if (country) {
                selectedCountryForPhone.value = country;
            }
        }
    })

    // Watch para procesar teléfono cuando se carguen los países
    watch(() => countries.value, (newCountries) => {
        if (newCountries && userLogged.value?.Telefono) {
            // Reprocessar el teléfono para separar prefijo
            if (userLogged.value.Telefono.startsWith('+')) {
                let phoneNumber = userLogged.value.Telefono;
                for (const country of newCountries) {
                    if (userLogged.value.Telefono.startsWith(country.phoneCode)) {
                        phoneNumber = userLogged.value.Telefono.substring(country.phoneCode.length);
                        break;
                    }
                }
                formPersonalData.telefono = phoneNumber;
            }
        }
    })

    // Errores del formulario actualizar datos personales
    const errorsPersonalData= ref({});
   
    const isSubmittingPersonalData = ref(false);

    // Enviar formulario
    const submitForm = async (formType) => {

        if(formType === 'personalData') { // formulario datos personales
            if (isSubmittingPersonalData.value) return;

            // Definir las reglas de validación frontend (excluir imagen)
            const validationRules = {
                nombre: { required: true, maxLength: 50, minLength: 2 },
                apellido: { required: true, maxLength: 50, minLength: 2 },
                paisResidencia: { required: false, maxLength: 10 },
                telefono: { required: false, maxLength: 20, phone: true }
            };

            // Crear objeto de datos sin la imagen para validación
            const dataToValidate = {
                nombre: formPersonalData.nombre,
                apellido: formPersonalData.apellido,
                paisResidencia: formPersonalData.paisResidencia,
                telefono: formPersonalData.telefono
            };

            // Validar el formulario frontend
            const frontendErrors = validateForm(dataToValidate, validationRules);
            errorsPersonalData.value = frontendErrors;

            // Si hay errores, detener el envío
            if (Object.keys(frontendErrors).length > 0) {
                mostrarNotificacion("Por favor corrige los errores en el formulario", 0);
                return;
            }

            isSubmittingPersonalData.value = true;

            try {
                // Preparar teléfono completo con prefijo
                let telefonoCompleto = formPersonalData.telefono;
                if (selectedCountryForPhone.value && formPersonalData.telefono) {
                    // Si el teléfono no empieza con +, agregar el prefijo del país
                    if (!formPersonalData.telefono.startsWith('+')) {
                        telefonoCompleto = selectedCountryForPhone.value.phoneCode + formPersonalData.telefono;
                    }
                }

                // Si hay una nueva imagen, subirla primero
                if (formPersonalData.imgPerfil instanceof File) {
                    const formData = new FormData();
                    formData.append('profileImage', formPersonalData.imgPerfil);

                    const { data: imageData, error: imageError } = await useApi('/api/user/upload-profile-image', 'POST', formData, {
                        'Content-Type': 'multipart/form-data'
                    });

                    if (imageError.value) {
                        mostrarNotificacion(imageError.value.message || 'Error al subir la imagen', 0);
                        return;
                    }

                    if (imageData.value?.success) {
                        // Actualizar store con nueva imagen
                        userStore.updateUserProfilePicture(imageData.value.imagePath);
                        // Actualizar también el formulario para mostrar la imagen del servidor
                        formPersonalData.imgPerfil = imageData.value.imagePath;
                        mostrarNotificacion('Imagen de perfil actualizada exitosamente', 1);
                    }
                }

                // Preparar datos para backend
                const updateData = {
                    Nombre: formPersonalData.nombre,
                    Apellido: formPersonalData.apellido,
                    Telefono: telefonoCompleto,
                    Pais_Residencia: formPersonalData.paisResidencia
                };


                const { data, error } = await useApi('/api/user/profile', 'PUT', updateData);

                if (error.value) {
                    // Manejar errores del backend
                    if (error.value.errors) {
                        const backendErrors = {};
                        error.value.errors.forEach(err => {
                            const fieldMap = {
                                'Nombre': 'nombre',
                                'Apellido': 'apellido',
                                'Telefono': 'telefono',
                                'Pais_Residencia': 'paisResidencia'
                            };
                            const frontendField = fieldMap[err.path] || err.path;
                            backendErrors[frontendField] = err.msg;
                        });
                        errorsPersonalData.value = { ...errorsPersonalData.value, ...backendErrors };
                        mostrarNotificacion('Por favor corrige los errores señalados', 0);
                    } else {
                        mostrarNotificacion(error.value.message || 'Error actualizando datos', 0);
                    }
                } else if (data.value?.success) {
                    mostrarNotificacion("Datos personales actualizados con éxito", 1);
                    
                    // Los datos del usuario se actualizan automáticamente via cookies
                    // No necesitamos localStorage
                }

            } catch (error) {
                console.error('Error actualizando perfil:', error);
                mostrarNotificacion('Error de conexión', 0);
            } finally {
                isSubmittingPersonalData.value = false;
            }
        }
    };

    onMounted(() => {
        async function obtenerPaises(){ // para el select pais residencia y prefijos telefónicos
            try {
                const { data, error, loading } = await useApi('https://restcountries.com/v3.1/all?fields=name,ccn3,cca2,idd', 'GET');
                
                // Esperar hasta que los datos estén listos
                if (!error.value && data.value) { 
                    // Procesar países con códigos telefónicos
                    const processedCountries = data.value
                        .filter(country => 
                            country.idd?.root && 
                            country.idd?.suffixes && 
                            country.name?.common
                        )
                        .map(country => {
                            return {
                                ...country,
                                phoneCode: country.idd.root + (country.idd.suffixes[0] || '')
                            };
                        });
                    
                    countries.value = processedCountries; // Asigna los datos procesados
                    
                    // Buscar país actual del usuario para mostrar el prefijo telefónico
                    if (userLogged.value?.Pais_Residencia) {
                        const userCountry = processedCountries.find(country => 
                            country.cca2 === userLogged.value.Pais_Residencia
                        );
                        if (userCountry) {
                            selectedCountryForPhone.value = userCountry;
                        }
                    }
                    
                } else {
                    console.error('Error al cargar los datos de países:', error.value);
                    // Usar países mock en caso de error
                    countries.value = [
                        { name: { common: 'Colombia' }, ccn3: '170', cca2: 'CO', phoneCode: '+57' },
                        { name: { common: 'México' }, ccn3: '484', cca2: 'MX', phoneCode: '+52' },
                        { name: { common: 'España' }, ccn3: '724', cca2: 'ES', phoneCode: '+34' }
                    ];
                    
                    // También buscar país del usuario en países mock
                    if (userLogged.value?.Pais_Residencia) {
                        const userCountry = countries.value.find(country => 
                            country.cca2 === userLogged.value.Pais_Residencia
                        );
                        if (userCountry) {
                            selectedCountryForPhone.value = userCountry;
                        }
                    }
                }
            } catch (error) {
                console.error('Error al cargar los datos de países en el componente:', error);
                // Usar países mock en caso de error
                countries.value = [
                    { name: { common: 'Colombia' }, ccn3: '170', cca2: 'CO', phoneCode: '+57' },
                    { name: { common: 'México' }, ccn3: '484', cca2: 'MX', phoneCode: '+52' },
                    { name: { common: 'España' }, ccn3: '724', cca2: 'ES', phoneCode: '+34' }
                ];
                
                // También buscar país del usuario en países mock
                if (userLogged.value?.Pais_Residencia) {
                    const userCountry = countries.value.find(country => 
                        country.cca2 === userLogged.value.Pais_Residencia
                    );
                    if (userCountry) {
                        selectedCountryForPhone.value = userCountry;
                    }
                }
            }
        }

        obtenerPaises()
        getUserServices() // Cargar servicios del usuario al montar el componente

    });
    
</script>

<template>
    <!-- Contenido Real -->
    <section class="sectionAccount ux-container">
        <h1 class="ux-header">{{ $t('Mi cuenta') }}</h1>
        <div class="containerAccount ux-content">
            
            <div class="blocksContainer ux-slide-in-left">
                
                <form class="accountBlock ux-card ux-stagger-1" @submit.prevent="submitForm('personalData')" >
                    <h4>{{ $t('Datos Personales') }}</h4>
                    <div class="rowSpaceBetween">
                        <img ref="imgPreview" :src="imageUrl" alt="">
                        <div class="btnsImgPerfil">
                            <input hidden type="file" @change="handleImageChange" id="imgPerfil" accept="image/*">
                            <label class="BGDarkGray" for="imgPerfil">{{ $t('Subir imagen') }}</label>
                            <button @click="removeProfileImage">{{ $t('Eliminar') }}</button>
                        </div>
                    </div>
                    <div class="error" v-if="errorsPersonalData.imgPerfil">{{ errorsPersonalData.imgPerfil }}</div>
            
                    
                    <div class="divInput">
                        <label for="">{{ $t('Nombre') }}</label>
                        <div class="inputIcon">
                            <i class="fa-solid fa-user"></i>
                            <input type="text" class="inputSelectWoBorderOLeft" v-model="formPersonalData.nombre">
                        </div>
                        <div class="error" v-if="errorsPersonalData.nombre">{{ errorsPersonalData.nombre }}</div>
                    </div>
                    <div class="divInput">
                        <label for="">{{ $t('Apellido') }}</label>
                        <div class="inputIcon">
                            <i class="fa-solid fa-user"></i>
                            <input type="text" class="inputSelectWoBorderOLeft" v-model="formPersonalData.apellido">
                        </div>
                        <div class="error" v-if="errorsPersonalData.apellido">{{ errorsPersonalData.apellido }}</div>
                    </div>
                    <div class="divInput">
                        <label for="">{{ $t('País de residencia') }}</label>
                        <div class="inputIcon">
                            <i class="fa-solid fa-globe"></i>
                            <select v-model="formPersonalData.paisResidencia" class="inputSelectWoBorderOLeft" style="padding: 0; padding-left: 0.5rem;" >
                                <option value="" disabled>{{ $t('Selecciona un país') }}</option>
                                <option 
                                    v-for="country in countries"
                                    :key="country.ccn3" 
                                    :value="country.cca2"
                                    
                                >
                                    {{country.name.common}}
                                </option>
                            </select>
                        </div>
                        <div class="error" v-if="errorsPersonalData.paisResidencia">{{ errorsPersonalData.paisResidencia }}</div>
                    </div>
                    
                    <div class="divInput">
                        <label for="">{{ $t('Telefono') }}</label>
                        <div class="inputIcon" style="position: relative;">
                            <i class="fa-solid fa-phone"></i>
                            <div v-if="selectedCountryForPhone" class="phone-prefix">{{ selectedCountryForPhone.phoneCode }}</div>
                            <input 
                                type="tel" 
                                class="inputSelectWoBorderOLeft" 
                                name="" 
                                v-model="formPersonalData.telefono"
                                :placeholder="selectedCountryForPhone ? 'Ej: 3001234567' : 'Teléfono'"
                                :style="selectedCountryForPhone ? 'padding-left: 70px;' : ''"
                            >
                        </div>
                        <div class="error" v-if="errorsPersonalData.telefono">{{ errorsPersonalData.telefono }}</div>
                    </div>
                    <div class="divInput">
                        <label for="">{{ $t('Correo') }}</label>
                        <div class="inputIcon">
                            <i class="fa-solid fa-envelope"></i>
                            <input type="text" class="inputSelectWoBorderOLeft" v-model="formPersonalData.correo" readonly disabled>
                        </div>
                        <div class="error" v-if="errorsPersonalData.correo">{{ errorsPersonalData.correo }}</div>
                    </div>
                    <button class="btnAccountBlock BGYellow" type="submit" :disabled="isSubmittingPersonalData">
                        {{ isSubmittingPersonalData ? $t('Actualizando...') : $t('Actualizar') }}
                    </button>
                </form>
                <div class="accountBlock ux-card ux-stagger-2">
                    <h4>{{ $t('Servicios') }}</h4>
                    <!-- <p class="parOptForm">Activa los servicios para los que tu cliente puede solicitar presupuesto y selecciona cómo quieres recibir las solicitudes.</p>
                    <p class="parOptForm bold">Lista de servicios</p> -->
                    <div class="contOpts">
                        <div v-for="service in state.services" :key="service.id" class="btnDescInfo">
                            <div class="btnYDesc">
                                <div 
                                    class="simBtnWithAnimation" 
                                    @click="toggleService(service)"
                                    :class="{ 'BGGreen': isServiceActive(service.id) }"
                                    :disabled="loadingUserServices"
                                >
                                    <div 
                                        class="circleMove" 
                                        :class="{ 'moveRight': isServiceActive(service.id) }"
                                    ></div>
                                    <input class="inputCheck" type="checkbox" :checked="isServiceActive(service.id)">
                                </div>
                                <p>{{service.description}}</p>
                                
                            </div>
                            
                        </div>
                        
                        <p v-if="loadingUserServices" class="text-center">{{ $t('Cargando servicios...') }}</p>
                        
                    </div>
                </div>
            </div>

            <div class="blocksContainer ux-slide-in-right">
                <div class="accountBlock ux-card ux-stagger-3">
                    <h4>{{ $t('Suscripción de plan') }} </h4>
                    <div class="divInput">
                        <label for="">{{ $t('Nombre del plan') }}</label>
                        <div class="inputIcon">
                            <i class="fa-solid fa-user-tag"></i>
                            <input type="text" disabled name="" class="inputSelectWoBorderOLeft" :value="userLogged?.UserSuscription?.SuscriptionPlan?.Plan_Name || $t('Cargando...')">
                        </div>
                    </div>
                    <div class="divInput">
                        <label for="">{{ $t('Vigencia hasta') }}</label>
                        <div class="inputIcon">
                            <i class="fa-solid fa-hourglass-end"></i>
                            <input type="text" disabled class="inputSelectWoBorderOLeft" name="" :value="userLogged?.UserSuscription?.End_Date || $t('Cargando...')">
                        </div>
                    </div>
                    <div class="btnDescInfo">
                        <div class="btnYDesc">
                            <p>{{ $t('Renovación automatica') }}</p>
                            <div 
                                class="simBtnWithAnimation" 
                                @click="checkOptAssistant($event.currentTarget)"
                                :class="{ 'BGGreen': isAutomaticRenewalEnabled }"
                            >
                                <div :class="{ 'moveRight': isAutomaticRenewalEnabled }" class="circleMove"></div>
                                <input class="inputCheck" type="checkbox" name="" id="">
                            </div>
                        </div>
                        
                    </div>
                    <RouterLink to="/updateSubscription"><button class="btnAccountBlock BGBlue" type="button">{{ $t('Actualizar suscripción') }}</button></RouterLink>
                    
                </div>

                <NewPassword class="ux-card ux-stagger-4"> 
                    
                </NewPassword>
                
           
                
            </div>

           
            
            
        </div>
    </section>
</template>


