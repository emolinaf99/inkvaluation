<script setup>
    import {reactive, ref, onMounted} from 'vue'
    import {scrollearConClick} from '/src/js/scrollWithClick'

    function scrollForAll(flecha,izqODer) {
        let contenedorScroll = flecha.parentNode.parentNode.querySelector('.vitrinaSlideChat')
        let itemIntoScroll = flecha.parentNode.parentNode.querySelector('.vitrinaSlideChat img')

        scrollearConClick(contenedorScroll,itemIntoScroll,izqODer)
    }

</script>

<template>
    <section class="sectionGeneralChat">
        <div class="headerChat">
            <div class="perfilChat">
                <img src="/img/noImg.jpg" alt="">
                <div class="stateChatAndName">
                    <p class="bold">Nombre del negocio</p>
                    <p>En línea</p>
                </div>
            </div>
            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
        </div>
        <section class="sectionMessages">
            <div class="msgContainer jcFlexStart">
                <div class="msgChat">
                    <i class="fa-solid fa-play fa-flip-horizontal"></i>
                    <p>
                        ¡Hola! Soy <span class="bold">nombreAsistente, asistente de nombreDeNegocio.</span>
                        <br><br>
                        Vamos a comenzar a recopilar la información para realizar tu cotización de tu servicio. 
                    </p>
                </div>
            </div>

            <div class="msgContainer jcFlexStart">
                <div class="msgChat">
                    <i class="fa-solid fa-play fa-flip-horizontal"></i>
                    <p><span class="bold">¿Cual es tu nombre?</span></p>
                        
                    
                </div>
            </div>

            <div class="msgContainer jcFlexEnd">
                <input class="inputNameChat colorWhite">

            </div>

            <div class="msgContainer jcFlexStart">
                <div class="msgChat">
                    <i class="fa-solid fa-play fa-flip-horizontal"></i>
                    <p>nombrePersona, <span class="bold">¿Que servicio deseas realizarte?</span></p>
                        
                    
                </div>
            </div>

            <div class="msgContainer jcFlexEnd">
                <ul class="listChat">
                    <li>
                        <input type="radio" name="service" id="">
                        <label for="">Opcion 1</label>
                    </li>
                    <li class="noBorder">
                        <input type="radio" name="service" id="">
                        <label for="">Opcion 2</label>
                    </li>
                </ul>

            </div>

            <div class="msgContainer jcFlexStart">
                <div class="msgChat">
                    <i class="fa-solid fa-play fa-flip-horizontal"></i>
                    <p>Que bien! <span class="bold">¿Con que artista desear hacerlo?</span></p>
                </div>
            </div>

            <div class="contenedorGeneralSlideChat">
                <div class="contenedorSlideChat">
                    <div class="botonesSlideOutsideChat">
                        <i class="fa-solid fa-chevron-left" @click="scrollForAll($event.target,1)"></i>
                        <i class="fa-solid fa-chevron-right" @click="scrollForAll($event.target,0)"></i>
                    </div>
                    <div class="sectionSlideChat">
                        <div class="vitrinaSlideChat">
                            <div class="optionSlide">
                                <div class="imgOptionSlide">
                                    <input type="radio" name="artist" id="">
                                    <img src="/img/noImg.jpg" alt="">
                                </div>
                                <div class="infoOptionSlide">
                                    <p>Nombre <br> Artista</p>
                                    <RouterLink to=""><img src="/img/instagramLogo.png" alt=""></RouterLink>
                                </div>
                            </div>
                            <div class="optionSlide">
                                <div class="imgOptionSlide">
                                    <input type="radio" name="artist" id="">
                                    <img src="/img/noImg.jpg" alt="">
                                </div>
                                <div class="infoOptionSlide">
                                    <p>Nombre <br> Artista</p>
                                    <RouterLink to=""><img src="/img/instagramLogo.png" alt=""></RouterLink>
                                </div>
                            </div>
                            <div class="optionSlide">
                                <div class="imgOptionSlide">
                                    <input type="radio" name="artist" id="">
                                    <img src="/img/noImg.jpg" alt="">
                                </div>
                                <div class="infoOptionSlide">
                                    <p>Nombre <br> Artista</p>
                                    <RouterLink to=""><img src="/img/instagramLogo.png" alt=""></RouterLink>
                                </div>
                            </div>
                            <div class="optionSlide">
                                <div class="imgOptionSlide">
                                    <input type="radio" name="artist" id="">
                                    <img src="/img/noImg.jpg" alt="">
                                </div>
                                <div class="infoOptionSlide">
                                    <p>Nombre <br> Artista</p>
                                    <RouterLink to=""><img src="/img/instagramLogo.png" alt=""></RouterLink>
                                </div>
                            </div>
                            <div class="optionSlide">
                                <div class="imgOptionSlide">
                                    <input type="radio" name="artist" id="">
                                    <img src="/img/noImg.jpg" alt="">
                                </div>
                                <div class="infoOptionSlide">
                                    <p>Nombre <br> Artista</p>
                                    <RouterLink to=""><img src="/img/instagramLogo.png" alt=""></RouterLink>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                    
                </div>
            </div>
            

            <div class="msgContainer jcFlexStart">
                <div class="msgChat">
                    <i class="fa-solid fa-play fa-flip-horizontal"></i>
                    <p>Selecciona <span class="bold">el tamaño</span> del tatuaje</p>
                </div>
            </div>
            
        </section>
    </section>
</template>


