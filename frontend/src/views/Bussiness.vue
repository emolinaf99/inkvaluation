<script setup>
    import { ref, onMounted, computed} from 'vue'
    import { inputFromPasswordToText } from '@/js/inputFromPasswordToText';
    import { RouterLink } from 'vue-router';
    import {checkOptAssistant} from '/src/js/checkOpt.js'
    import {services} from '/src/data/services.js'
    import {mostrarFileEnImgPreview} from '/src/js/previewFile.js'

    const imgPreview = ref(null); // Referencia a la imagen

    const handleImageChange = (event) => {
        if (imgPreview.value) {
            mostrarFileEnImgPreview(event, imgPreview.value);
        }
    };

    onMounted(()=>{

    })

</script>

<template>
   <section class="sectionAccount">
        <h1>Mi estudio</h1>
        <div class="containerAccount">
            
            <div class="blocksContainer">
                <div class="accountBlock">
                    <h4>Datos del negocio</h4>
                    <div class="rowSpaceBetween">
                        <img ref="imgPreview" src="/img/sinFoto.jpg" alt="">
                        <div class="btnsImgPerfil">
                            <input hidden type="file" name="" id="imgPerfilStudio" @change="handleImageChange">
                            <label class="BGDarkGray" for="imgPerfilStudio">Subir imagen</label>
                            <button>Eliminar</button>
                        </div>
                    </div>
                    <div class="divInput">
                        <label for="">Descripción</label>
                        <textarea rows="3" name="" id=""></textarea>
                    </div>
                    
                    <div class="divInput">
                        <label for="">Nombre de tu negocio</label>
                        <div class="inputIcon">
                            <i class="fa-solid fa-shop"></i>
                            <input type="text" name="" value="InkValuation">
                        </div>
                    </div>
                    <div class="divInput">
                        <label for="">Dominio</label>
                        <div class="inputIcon">
                            <i class="fa-solid fa-globe"></i>
                            <input type="text" name="" value="studio_inkvaluation">
                        </div>
                    </div>
                
                    <button class="btnAccountBlock BGYellow" type="button">Actualizar</button>
                </div>
                <div class="accountBlock">
                    <h4>Sedes del Negocio</h4>
                    <div class="rowContain">
                        <div class="inputsContain">
                            <div class="divInput">
                                <label for="">Ciudad</label>
                                <div class="inputIcon inpIconCity">
                            
                                    <select name="" id="">
                                        <option value="">Seleccione ciudad</option>
                                        <option value="">Medellín</option>
                                    </select>
                                    
                                </div>
                            </div>
                            <div class="divInput">
                                <label for="">Dirección</label>
                                <div class="inputIcon inpIconCity">
                                    
                                    <input type="text">
                                </div>
                            </div>

                        </div>
                        <i class="fa-solid fa-circle-plus addCity"></i>
                        
                    </div> 
                   
                    <div class="sectionCities">
                        <div class="itemCity">
                            <i class="fa-regular fa-circle-xmark"></i>
                            <p>Medellín</p>
                            <span>|</span>
                            <p>Calle 26 D 26 02</p>
                        </div>
                        <div class="itemCity">
                            <i class="fa-regular fa-circle-xmark"></i>
                            <p>Bogota</p>
                            <span>|</span>
                            <p>Calle 26 D 26 02</p>
                        </div>
                    </div>
                
                    <button class="btnAccountBlock BGYellow" type="button">Actualizar</button>
                </div>
                 
            </div>

            <div class="blocksContainer">
                <div class="accountBlock">
                    <h4>Artistas</h4>
                    <p class="parOptForm">Gestiona los artistas que trabajan contigo.</p>
                    
                    <div class="contOpts">
                        
                        <div class="rowContain">
                            <div class="inputsContain">
                                <div class="divInput">
                                    <label for="">Correo Electrónico</label>
                                    <div class="inputIcon inpIconCity">
                                        
                                        <input type="text">
                                    </div>
                                </div>
                                <div class="divInput">
                                    <label for="">Sede</label>
                                    <div class="inputIcon inpIconCity">
                                
                                        <select name="" id="">
                                            <option value="">Seleccione sede</option>
                                            <option value="">Medellín</option>
                                        </select>
                                        
                                    </div>
                                </div>
                                
                                
                            </div>
                            <i class="fa-solid fa-circle-plus addCity"></i>
                            
                        </div>
                    
                        <div class="sectionCities">
                            <div class="itemArtist">
                                <div class="itemCity noBorderBottom">
                                    <i class="fa-regular fa-circle-xmark"></i>
                                    <p>Artista 1</p>
                                    <span>|</span>
                                    <p>Sede <span>Medellín</span></p>
                                </div>
                                <div class="itemCity itemRedes noBorderBottom">
                                    
                                    <img src="/img/noImg.jpg" alt="">
                                </div>
                            </div>
                            
                            <div class="itemArtist">
                                <div class="itemCity noBorderBottom">
                                    <i class="fa-regular fa-circle-xmark"></i>
                                    <p>Artista 2</p>
                                    <span>|</span>
                                    <p>Sede <span>Bogota</span></p>
                                </div>
                                <div class="itemCity itemRedes noBorderBottom">
                                    
                                    <img src="/img/noImg.jpg" alt="">
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div class="accountBlock">
                    <h4>Servicios</h4>
                    <p class="parOptForm">Activa los servicios para los que tu cliente puede solicitar presupuesto y selecciona cómo quieres recibir las solicitudes.</p>
                    <p class="parOptForm bold">Lista de servicios</p>
                    <div class="contOpts">
                        <div v-for="service in services" class="btnDescInfo">
                            <div  class="btnYDesc">
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
            
            
        </div>
        
   </section>
</template>


