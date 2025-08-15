<script setup>
    import { ref, onMounted, computed} from 'vue'
    import { inputFromPasswordToText } from '@/js/inputFromPasswordToText';
    import { RouterLink } from 'vue-router';
    import {checkOptAssistant} from '/src/js/checkOpt.js'
    import {services} from '/src/data/services.js'
    import {mostrarFileEnImgPreview} from '/src/js/previewFile.js'
    import BussinessSkeleton from '../components/skeletons/BussinessSkeleton.vue'
    import { useSkeleton } from '../js/useSkeleton.js'

    const { isLoading, isFading, startLoading, finishLoading } = useSkeleton()

    const imgPreview = ref(null); // Referencia a la imagen

    const handleImageChange = (event) => {
        if (imgPreview.value) {
            mostrarFileEnImgPreview(event, imgPreview.value);
        }
    };

    onMounted(()=>{
        // No hay carga de datos real en esta vista por ahora
        // El skeleton se mostraría solo si hubiera llamadas a API reales
    })

</script>

<template>
    <!-- Skeleton Loader -->
    <div v-if="isLoading" class="skeleton-container" :class="{ 'skeleton-fade-out': isFading }">
        <BussinessSkeleton />
    </div>

    <!-- Contenido Real -->
    <section v-else class="sectionAccount ux-container">
        <h1 class="ux-header">Mi estudio</h1>
        <div class="containerAccount ux-content">
            
            <div class="blocksContainer ux-slide-in-left">
                <div class="accountBlock ux-card ux-stagger-1">
                    <h4>Datos del negocio</h4>
                    <div class="rowSpaceBetween ux-fade-in ux-stagger-1">
                        <img ref="imgPreview" src="/img/sinFoto.jpg" alt="" class="ux-image">
                        <div class="btnsImgPerfil">
                            <input hidden type="file" name="" id="imgPerfilStudio" @change="handleImageChange">
                            <label class="BGDarkGray ux-button ux-hover-lift" for="imgPerfilStudio">Subir imagen</label>
                            <button class="ux-button ux-hover-lift">Eliminar</button>
                        </div>
                    </div>
                    <div class="divInput ux-form-field ux-stagger-2">
                        <label for="">Descripción</label>
                        <textarea rows="3" name="" id=""></textarea>
                    </div>
                    
                    <div class="divInput ux-form-field ux-stagger-3">
                        <label for="">Nombre de tu negocio</label>
                        <div class="inputIcon">
                            <i class="fa-solid fa-shop"></i>
                            <input type="text" name="" value="InkValuation">
                        </div>
                    </div>
                    <div class="divInput ux-form-field ux-stagger-4">
                        <label for="">Dominio</label>
                        <div class="inputIcon">
                            <i class="fa-solid fa-globe"></i>
                            <input type="text" name="" value="studio_inkvaluation">
                        </div>
                    </div>
                
                    <button class="btnAccountBlock BGYellow ux-button ux-stagger-5" type="button">Actualizar</button>
                </div>
                <div class="accountBlock ux-card ux-stagger-2">
                    <h4>Sedes del Negocio</h4>
                    <div class="rowContain ux-fade-in ux-stagger-1">
                        <div class="inputsContain">
                            <div class="divInput ux-form-field ux-stagger-1">
                                <label for="">Ciudad</label>
                                <div class="inputIcon inpIconCity">
                            
                                    <select name="" id="">
                                        <option value="">Seleccione ciudad</option>
                                        <option value="">Medellín</option>
                                    </select>
                                    
                                </div>
                            </div>
                            <div class="divInput ux-form-field ux-stagger-2">
                                <label for="">Dirección</label>
                                <div class="inputIcon inpIconCity">
                                    
                                    <input type="text">
                                </div>
                            </div>

                        </div>
                        <i class="fa-solid fa-circle-plus addCity ux-scale-in ux-stagger-3 ux-hover-scale"></i>
                        
                    </div> 
                   
                    <div class="sectionCities ux-content ux-stagger-2">
                        <div class="itemCity ux-list-item ux-stagger-1">
                            <i class="fa-regular fa-circle-xmark"></i>
                            <p>Medellín</p>
                            <span>|</span>
                            <p>Calle 26 D 26 02</p>
                        </div>
                        <div class="itemCity ux-list-item ux-stagger-2">
                            <i class="fa-regular fa-circle-xmark"></i>
                            <p>Bogota</p>
                            <span>|</span>
                            <p>Calle 26 D 26 02</p>
                        </div>
                    </div>
                
                    <button class="btnAccountBlock BGYellow ux-button ux-stagger-3" type="button">Actualizar</button>
                </div>
                 
            </div>

            <div class="blocksContainer ux-slide-in-right">
                <div class="accountBlock ux-card ux-stagger-3">
                    <h4>Artistas</h4>
                    <p class="parOptForm ux-fade-in ux-stagger-1">Gestiona los artistas que trabajan contigo.</p>
                    
                    <div class="contOpts">
                        
                        <div class="rowContain ux-fade-in ux-stagger-2">
                            <div class="inputsContain">
                                <div class="divInput ux-form-field ux-stagger-1">
                                    <label for="">Correo Electrónico</label>
                                    <div class="inputIcon inpIconCity">
                                        
                                        <input type="text">
                                    </div>
                                </div>
                                <div class="divInput ux-form-field ux-stagger-2">
                                    <label for="">Sede</label>
                                    <div class="inputIcon inpIconCity">
                                
                                        <select name="" id="">
                                            <option value="">Seleccione sede</option>
                                            <option value="">Medellín</option>
                                        </select>
                                        
                                    </div>
                                </div>
                                
                                
                            </div>
                            <i class="fa-solid fa-circle-plus addCity ux-scale-in ux-stagger-3 ux-hover-scale"></i>
                            
                        </div>
                    
                        <div class="sectionCities ux-content ux-stagger-3">
                            <div class="itemArtist ux-list-item ux-stagger-1">
                                <div class="itemCity noBorderBottom">
                                    <i class="fa-regular fa-circle-xmark"></i>
                                    <p>Artista 1</p>
                                    <span>|</span>
                                    <p>Sede <span>Medellín</span></p>
                                </div>
                                <div class="itemCity itemRedes noBorderBottom">
                                    
                                    <img src="/img/noImg.jpg" alt="" class="ux-image">
                                </div>
                            </div>
                            
                            <div class="itemArtist ux-list-item ux-stagger-2">
                                <div class="itemCity noBorderBottom">
                                    <i class="fa-regular fa-circle-xmark"></i>
                                    <p>Artista 2</p>
                                    <span>|</span>
                                    <p>Sede <span>Bogota</span></p>
                                </div>
                                <div class="itemCity itemRedes noBorderBottom">
                                    
                                    <img src="/img/noImg.jpg" alt="" class="ux-image">
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div class="accountBlock ux-card ux-stagger-4">
                    <h4>Servicios</h4>
                    <p class="parOptForm ux-fade-in ux-stagger-1">Activa los servicios para los que tu cliente puede solicitar presupuesto y selecciona cómo quieres recibir las solicitudes.</p>
                    <p class="parOptForm bold ux-fade-in ux-stagger-2">Lista de servicios</p>
                    <div class="contOpts ux-content ux-stagger-3">
                        <div v-for="(service, index) in services" :key="service.Service_Id" class="btnDescInfo ux-list-item" :style="`animation-delay: ${0.1 * (index + 4)}s`">
                            <div  class="btnYDesc">
                                <div class="simBtnWithAnimation ux-scale-in ux-hover-scale" @click="checkOptAssistant($event.currentTarget)">
                                    <div class="circleMove"></div>
                                    <input class="inputCheck" type="checkbox" name="" id="">
                                </div>
                                <p>{{service.Services_Name}}</p>
                                
                            </div>
                            
                        </div>
                        
                        <button class="btnAccountBlock BGYellow ux-button ux-stagger-final" type="button">Guardar</button>
                        
                        
                    </div>

                    
                </div>

                
            </div>
            
            
        </div>
    </section>
</template>


