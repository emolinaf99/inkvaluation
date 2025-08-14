<script setup>
    import {reactive, ref, onMounted} from 'vue'
    import {checkOptAssistant} from '/src/js/checkOpt.js'
    
    

    function mostrarInfoOpt(btnInfo,aparecerODesaparecer) {
        // 0 para aparecer 1 para desaparecer

        let cuadroInformativo = btnInfo.parentNode.querySelector('.infoBlockOpt')

        if(aparecerODesaparecer == 0) {
            cuadroInformativo.style.display = 'flex'
        } else {
            cuadroInformativo.style.display = 'none'
        }
        
    }
    
</script>

<template>
    <section class="sectionGeneralConfAssistant">
        <h1>Configuración de asistente</h1>

        <div class="contenedorSecConfAssistant">
            <div class="linkAndPreview">
                <button class="btnPreview BGBlue">Previsualiza</button>
                <div class="link">
                    <p class="bold">Link de tu asistente: <a href="/assistantChat">https://inkvaluation.co/assistantChat</a></p>
                    <button class="btnPreview BGYellow">Compartelo</button>
                </div>
            </div>
            <div class="msgDefault">
                <p class="bold">Tu asistente está listo para compartir</p>
                <p>Por defecto preguntará al cliente:</p>
                <ul class="listItemsDefault">
                    <li>Nombre de cliente</li>
                    <li>Servicio deseado</li>
                    <!-- <li>Artista deseado</li> -->
                    <li>Tamaño del tatuaje</li>
                    <li>Zona del tatuaje</li>
                    <li>Color de tinta</li>
                    <li>Imagenes de referencia</li>
                    <li>Descripción del tatuaje</li>
                    <li>Datos de contacto</li>
                </ul>
            </div>
            <div class="accountBlock">
                <h4>Perfil</h4>
                <div class="rowSpaceBetween">
                    <img src="/img/sinFoto.jpg" alt="">
                    <div class="btnsImgPerfil">
                        <input hidden type="file" name="" id="imgPerfil">
                        <label class="BGDarkGray" for="imgPerfil">Subir imagen</label>
                        <button>Eliminar</button>
                    </div>
                </div>
                <div class="divInput">
                    <label for="">Descripción</label>
                    <textarea rows="3" name="" id=""></textarea>
                </div>
                <div class="divInput">
                    <label for="">Nombre del asistente</label>
                    <div class="inputIcon">
                        <input type="text" name="" value="Lola"> 
                    </div>
                </div>

                
                
                <!-- <button class="btnAccountBlock BGYellow" type="button">Guardar</button> -->
            </div>
            <div class="accountBlock">
                <h4>Opciones de formulario</h4>
                <p class="parOptForm">Activa las siguiente opciones si quieres que aparezcan en tu asistente virtual.</p>
                
                <div class="contOpts">
                    <div class="btnDescInfo">
                        <div class="btnYDesc">
                            <div class="simBtnWithAnimation" @click="checkOptAssistant($event.currentTarget)">
                                <div class="circleMove"></div>
                                <input class="inputCheck" type="checkbox" name="" id="">
                            </div>
                            <p>Agregar tono de piel</p>
                            
                        </div>
                        <i class="fa-solid fa-circle-info" @mouseover="mostrarInfoOpt($event.currentTarget,0)" @mouseleave="mostrarInfoOpt($event.currentTarget,1)" @click="mostrarInfoOpt($event.currentTarget,0)"></i>
                        <div class="infoBlockOpt">
                            Esta opción le mostrará a tu cliente una escala cromática en la que tendrá que elegir el tono aproximado de su piel.
                        </div>
                    </div>
                    <div class="btnDescInfo">
                        <div class="btnYDesc">
                            <div class="simBtnWithAnimation" @click="checkOptAssistant($event.currentTarget)">
                                <div class="circleMove"></div>
                                <input class="inputCheck" type="checkbox" name="" id="">
                            </div>
                            <p>Agregar disponibilidad horaria</p>
                            
                        </div>
                        <i class="fa-solid fa-circle-info" @mouseover="mostrarInfoOpt($event.currentTarget,0)" @mouseleave="mostrarInfoOpt($event.currentTarget,1)" @click="mostrarInfoOpt($event.currentTarget,0)"></i>
                        <div class="infoBlockOpt">
                            Esta opción le preguntará a tu cliente por su disponibilidad horaria: mañanas, tardes o ambos.
                        </div>
                    </div>
                    <div class="btnDescInfo">
                        <div class="btnYDesc">
                            <div class="simBtnWithAnimation" @click="checkOptAssistant($event.currentTarget)">
                                <div class="circleMove"></div>
                                <input class="inputCheck" type="checkbox" name="" id="">
                            </div>
                            <p>Agregar preferencia de ciudad</p>
                            
                        </div>
                        <i class="fa-solid fa-circle-info" @mouseover="mostrarInfoOpt($event.currentTarget,0)" @mouseleave="mostrarInfoOpt($event.currentTarget,1)" @click="mostrarInfoOpt($event.currentTarget,0)"></i>
                        <div class="infoBlockOpt">
                            Escribe las ciudades en las que trabajas para que tu cliente seleccione, de tu lista, en qué lugar quiere que le proporciones un servicio.
                        </div>
                    </div>
                    
                    
                </div>

            
            </div>
            <div class="accountBlock">
                <h4>Artistas</h4>
                <p class="parOptForm">Gestiona los artistas que trabajan contigo.</p>
                
                <div class="contOpts">
                    <div class="btnDescInfo">
                        <div class="btnYDesc">
                            <div class="simBtnWithAnimation" @click="checkOptAssistant($event.currentTarget)">
                                <div class="circleMove"></div>
                                <input class="inputCheck" type="checkbox" name="" id="">
                            </div>
                            <p>Agregar artistas</p>
                            
                        </div>
                        <i class="fa-solid fa-circle-info" @mouseover="mostrarInfoOpt($event.currentTarget,0)" @mouseleave="mostrarInfoOpt($event.currentTarget,1)" @click="mostrarInfoOpt($event.currentTarget,0)"></i>
                        <div class="infoBlockOpt">
                            Se mostrarán en tu asistente para que tu cliente pueda seleccionar el artista con el que quiere tatuarse.
                        </div>
                    </div>
                    <div class="rowContain">
                        <div class="inputsContain">
                            <div class="divInput">
                                <label for="">Nombre</label>
                                <div class="inputIcon inpIconCity">
                                    
                                    <input type="text">
                                </div>
                            </div>
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
                                <label for="">Instagram</label>
                                <div class="inputIcon inpIconCity">
                                    
                                    <input type="text">
                                </div>
                            </div>
                            <div class="divInput">
                                <label for="">Foto del artista</label>
                                <div class="inputIcon inpIconCity">
                                    
                                    <input type="file">
                                    
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
                            </div>
                            <div class="itemCity itemRedes noBorderBottom">
                                <RouterLink to=""><img src="/img/instagramLogo.png" alt=""></RouterLink>
                                <img src="/img/noImg.jpg" alt="">
                            </div>
                        </div>
                        
                        <div class="itemArtist">
                            <div class="itemCity noBorderBottom">
                                <i class="fa-regular fa-circle-xmark"></i>
                                <p>Artista 2</p>
                            </div>
                            <div class="itemCity itemRedes noBorderBottom">
                                <RouterLink to=""><img src="/img/instagramLogo.png" alt=""></RouterLink>
                                <img src="/img/noImg.jpg" alt="">
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
            <div class="accountBlock">
                <h4>Otros servicios</h4>
                <p class="parOptForm">Activa los servicios para los que tu cliente puede solicitar presupuesto y selecciona cómo quieres recibir las solicitudes.</p>
                <p class="parOptForm bold">Lista de servicios</p>
                <div class="contOpts">
                    <div class="btnDescInfo">
                        <div class="btnYDesc">
                            <div class="simBtnWithAnimation" @click="checkOptAssistant($event.currentTarget)">
                                <div class="circleMove"></div>
                                <input class="inputCheck" type="checkbox" name="" id="">
                            </div>
                            <p>Tatuaje</p>
                            
                        </div>
                        
                    </div>
                    <div class="btnDescInfo">
                        <div class="btnYDesc">
                            <div class="simBtnWithAnimation" @click="checkOptAssistant($event.currentTarget)">
                                <div class="circleMove"></div>
                                <input class="inputCheck" type="checkbox" name="" id="">
                            </div>
                            <p>Piercing</p>
                            
                        </div>
                        
                    </div>
                    <button class="btnAccountBlock BGYellow" type="button">Guardar</button>
                    
                    
                </div>

                
            </div>
        </div>
        

    </section>
</template>



