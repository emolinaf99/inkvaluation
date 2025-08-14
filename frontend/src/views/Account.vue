<script setup>
    import {reactive,ref, onMounted, computed} from 'vue'
    import NewPassword from '../components/NewPassword.vue'
    import { RouterLink } from 'vue-router';
    import {checkOptAssistant} from '/src/js/checkOpt.js'
    import {mostrarNotificacion} from '/src/js/notificationsRequest.js'
    import {services} from '/src/data/services.js'
    import {userLogged} from '/src/data/userInSession.js'
    import { useUserStore } from '../js/stores/userLogged.js'; // cuando exista sesion

    // import {suscriptions} from '/src/data/suscriptions.js'
    import {useApi} from '/src/js/useFetch.js'
    import {mostrarFileEnImgPreview} from '/src/js/previewFile.js'
    import {validateForm} from '/src/js/validateForm.js'
    import AccountSkeleton from '../components/skeletons/AccountSkeleton.vue'
    import { useSkeletonDev } from '../js/useSkeletonDev.js'

    const { isLoading, isFading } = useSkeletonDev('account', 1800)

    // const userStore = useUserStore(); // cuando haya sesión
    // const userLogged = computed(() => userStore.userLogged);

    const countries = ref(null) // valor de paises inicialmente

    const isAutomaticRenewalEnabled = computed(() => {
        return userLogged.UserSuscription?.Automatic_Renovation === 1 || userLogged.UserSuscription?.Automatic_Renovation === true;
    });

    const imgPreview = ref(null); // Referencia a la imagen

    // Cambiar imagen de perfil inmediatamente se suba al input
    const handleImageChange = (event) => {
        const file = event.target.files[0]; // Obtiene el archivo seleccionado
        if (file) {
            formPersonalData.imgPerfil = file; // Almacena el archivo en el estado
            console.log("Archivo seleccionado:", file);
            
            // Si quieres mostrar la imagen en una vista previa
            if (imgPreview.value) {
                mostrarFileEnImgPreview(event, imgPreview.value);
            }
        }
    };

    

    // Estado del formulario para actualizar datos personales
    const formPersonalData = reactive({
        imgPerfil: userLogged.Profile_Picture,
        nombre: userLogged.Nombre,
        apellido: userLogged.Apellido,
        paisResidencia: userLogged.Pais_Residencia,
        telefono: userLogged.Telefono,
        correo: userLogged.Email
    })

    // Errores del formulario actualizar datos personales
    const errorsPersonalData= ref({});
   
    // Enviar formulario
    const submitForm = (formType) => {

        if(formType === 'personalData') { // formulario datos personales
            // Definir las reglas de validación
            const validationRules = {
                imgPerfil: { required: true },
                nombre: { required: true, maxLength: 10 },
                apellido: { required: true, },
                paisResidencia: { required: true },
                telefono: { required: true, numeric: true },
                correo: { required: true, email: true }
            };

            // Validar el formulario
            const errors = validateForm(formPersonalData, validationRules);
            errorsPersonalData.value = errors; // Guardar los errores para mostrarlos en la vista

            // Si hay errores, detener el envío
            if (Object.keys(errors).length > 0) {
                console.log("Errores en el formulario:", errors);
                return;
            }

            // Si todo es válido, enviar los datos
            mostrarNotificacion("Datos personales actualizados con éxito",1);
            console.log("Datos enviados:", formPersonalData);
            
        }

        
    };

    onMounted(() => {

        async function obtenerPaises(){ // para el select pais residencia
            
            try {
                const { data, error, loading } = await useApi('https://restcountries.com/v3.1/all?fields=name,ccn3', 'GET');
                
                // Esperar hasta que los datos estén listos
                if (!error.value && data.value) { 
                    countries.value = data.value; // Asigna los datos a countries
                    
                } else {
                    console.error('Error al cargar los datos de países:', error.value);
                }
            } catch (error) {
                console.error('Error al cargar los datos de países en el componente:', error);
            }
        }

        obtenerPaises()

    });
    
</script>

<template>
    <!-- Skeleton Loader -->
    <div v-if="isLoading" class="skeleton-container" :class="{ 'skeleton-fade-out': isFading }">
        <AccountSkeleton />
    </div>

    <!-- Contenido Real -->
    <section v-else class="sectionAccount ux-container">
        <h1 class="ux-header">Mi cuenta</h1>
        <div class="containerAccount ux-content">
            
            <div class="blocksContainer ux-slide-in-left">
                
                <form class="accountBlock ux-card ux-stagger-1" @submit.prevent="submitForm('personalData')" >
                    <h4>Datos Personales</h4>
                    <div class="rowSpaceBetween">
                        <img ref="imgPreview" :src="formPersonalData.imgPerfil" alt="">
                        <div class="btnsImgPerfil">
                            <input hidden type="file" @change="handleImageChange" id="imgPerfil">
                            <label class="BGDarkGray" for="imgPerfil">Subir imagen</label>
                            <button>Eliminar</button>
                        </div>
                    </div>
                    <div class="error" v-if="errorsPersonalData.imgPerfil">{{ errorsPersonalData.imgPerfil }}</div>
            
                    
                    <div class="divInput">
                        <label for="">Nombre</label>
                        <div class="inputIcon">
                            <i class="fa-solid fa-user"></i>
                            <input type="text" class="inputSelectWoBorderOLeft" v-model="formPersonalData.nombre">
                        </div>
                        <div class="error" v-if="errorsPersonalData.nombre">{{ errorsPersonalData.nombre }}</div>
                    </div>
                    <div class="divInput">
                        <label for="">Apellido</label>
                        <div class="inputIcon">
                            <i class="fa-solid fa-user"></i>
                            <input type="text" class="inputSelectWoBorderOLeft" v-model="formPersonalData.apellido">
                        </div>
                        <div class="error" v-if="errorsPersonalData.apellido">{{ errorsPersonalData.apellido }}</div>
                    </div>
                    <div class="divInput">
                        <label for="">País de residencia</label>
                        <div class="inputIcon">
                            <i class="fa-solid fa-globe"></i>
                            <select v-model="formPersonalData.paisResidencia" class="inputSelectWoBorderOLeft" style="padding: 0; padding-left: 0.5rem;" >
                                <option 
                                    v-for="country in countries"
                                    :key="country.ccn3" 
                                    :value="country.ccn3"
                                    
                                >
                                    {{country.name.common}}
                                </option>
                            </select>
                        </div>
                        <div class="error" v-if="errorsPersonalData.paisResidencia">{{ errorsPersonalData.paisResidencia }}</div>
                    </div>
                    
                    <div class="divInput">
                        <label for="">Telefono</label>
                        <div class="inputIcon">
                            <i class="fa-solid fa-phone"></i>
                            <input type="text" class="inputSelectWoBorderOLeft" name="" v-model="formPersonalData.telefono">
                        </div>
                        <div class="error" v-if="errorsPersonalData.telefono">{{ errorsPersonalData.telefono }}</div>
                    </div>
                    <div class="divInput">
                        <label for="">Correo</label>
                        <div class="inputIcon">
                            <i class="fa-solid fa-envelope"></i>
                            <input type="text" class="inputSelectWoBorderOLeft" v-model="formPersonalData.correo">
                        </div>
                        <div class="error" v-if="errorsPersonalData.correo">{{ errorsPersonalData.correo }}</div>
                    </div>
                    <button class="btnAccountBlock BGYellow" type="submit">Actualizar</button>
                </form>
                <div class="accountBlock ux-card ux-stagger-2">
                    <h4>Servicios</h4>
                    <!-- <p class="parOptForm">Activa los servicios para los que tu cliente puede solicitar presupuesto y selecciona cómo quieres recibir las solicitudes.</p>
                    <p class="parOptForm bold">Lista de servicios</p> -->
                    <div class="contOpts">
                        <div v-for="service in services" class="btnDescInfo">
                            <div class="btnYDesc">
                                <div class="simBtnWithAnimation" @click="checkOptAssistant($event.currentTarget)">
                                    <div class="circleMove"></div>
                                    <input class="inputCheck" type="checkbox" name="" id="">
                                </div>
                                <p>{{service.Services_Name}}</p>
                                
                            </div>
                            
                        </div>
                        
                        <button class="btnAccountBlock BGYellow" type="button">Guardar</button>
                        
                        
                    </div>
                </div>
            </div>

            <div class="blocksContainer ux-slide-in-right">
                <div class="accountBlock ux-card ux-stagger-3">
                    <h4>Suscripción de plan </h4>
                    <div class="divInput">
                        <label for="">Nombre del plan</label>
                        <div class="inputIcon">
                            <i class="fa-solid fa-user-tag"></i>
                            <input type="text" disabled name="" class="inputSelectWoBorderOLeft" :value="userLogged.UserSuscription.SuscriptionPlan.Plan_Name">
                        </div>
                    </div>
                    <div class="divInput">
                        <label for="">Vigencia hasta</label>
                        <div class="inputIcon">
                            <i class="fa-solid fa-hourglass-end"></i>
                            <input type="text" disabled class="inputSelectWoBorderOLeft" name="" :value="userLogged.UserSuscription.End_Date">
                        </div>
                    </div>
                    <div class="btnDescInfo">
                        <div class="btnYDesc">
                            <p>Renovación automatica</p>
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
                    <RouterLink to=""><button class="btnAccountBlock BGBlue" type="button">Actualizar suscripción</button></RouterLink>
                    
                </div>

                <NewPassword class="ux-card ux-stagger-4"> 
                    
                </NewPassword>
                
           
                
            </div>

           
            
            
        </div>
    </section>
</template>


