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
    <section class="sectionGeneralChat ux-container">
        <div class="headerChat ux-slide-in-down">
            <div class="perfilChat ux-fade-in ux-stagger-1">
                <img src="/img/noImg.jpg" alt="" class="ux-image">
                <div class="stateChatAndName ux-fade-in ux-stagger-2">
                    <p class="bold">Nombre del negocio</p>
                    <p>En línea</p>
                </div>
            </div>
            <p class="ux-fade-in ux-stagger-3">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
        </div>
        <section class="sectionMessages ux-content">
            <div class="msgContainer jcFlexStart ux-slide-in-left ux-stagger-1">
                <div class="msgChat ux-fade-in">
                    <i class="fa-solid fa-play fa-flip-horizontal ux-scale-in"></i>
                    <p>
                        ¡Hola! Soy <span class="bold">nombreAsistente, asistente de nombreDeNegocio.</span>
                        <br><br>
                        Vamos a comenzar a recopilar la información para realizar tu cotización de tu servicio. 
                    </p>
                </div>
            </div>

            <div class="msgContainer jcFlexStart ux-slide-in-left ux-stagger-2">
                <div class="msgChat ux-fade-in">
                    <i class="fa-solid fa-play fa-flip-horizontal ux-scale-in"></i>
                    <p><span class="bold">¿Cual es tu nombre?</span></p>
                        
                    
                </div>
            </div>

            <div class="msgContainer jcFlexEnd ux-slide-in-right ux-stagger-3">
                <input class="inputNameChat colorWhite ux-form-field">

            </div>

            <div class="msgContainer jcFlexStart ux-slide-in-left ux-stagger-4">
                <div class="msgChat ux-fade-in">
                    <i class="fa-solid fa-play fa-flip-horizontal ux-scale-in"></i>
                    <p>nombrePersona, <span class="bold">¿Que servicio deseas realizarte?</span></p>
                        
                    
                </div>
            </div>

            <div class="msgContainer jcFlexEnd ux-slide-in-right ux-stagger-5">
                <ul class="listChat ux-content">
                    <li class="ux-list-item ux-stagger-1">
                        <input type="radio" name="service" id="">
                        <label for="">Opcion 1</label>
                    </li>
                    <li class="noBorder ux-list-item ux-stagger-2">
                        <input type="radio" name="service" id="">
                        <label for="">Opcion 2</label>
                    </li>
                </ul>

            </div>

            <div class="msgContainer jcFlexStart ux-slide-in-left ux-stagger-6">
                <div class="msgChat ux-fade-in">
                    <i class="fa-solid fa-play fa-flip-horizontal ux-scale-in"></i>
                    <p>Que bien! <span class="bold">¿Con que artista desear hacerlo?</span></p>
                </div>
            </div>

            <div class="contenedorGeneralSlideChat ux-fade-in-up ux-stagger-7">
                <div class="contenedorSlideChat">
                    <div class="botonesSlideOutsideChat ux-fade-in ux-stagger-1">
                        <i class="fa-solid fa-chevron-left ux-button ux-hover-scale" @click="scrollForAll($event.target,1)"></i>
                        <i class="fa-solid fa-chevron-right ux-button ux-hover-scale" @click="scrollForAll($event.target,0)"></i>
                    </div>
                    <div class="sectionSlideChat">
                        <div class="vitrinaSlideChat ux-content">
                            <div class="optionSlide ux-card ux-stagger-1">
                                <div class="imgOptionSlide">
                                    <input type="radio" name="artist" id="">
                                    <img src="/img/noImg.jpg" alt="" class="ux-image">
                                </div>
                                <div class="infoOptionSlide ux-fade-in">
                                    <p>Nombre <br> Artista</p>
                                    <RouterLink to="" class="ux-hover-lift"><img src="/img/instagramLogo.png" alt=""></RouterLink>
                                </div>
                            </div>
                            <div class="optionSlide ux-card ux-stagger-2">
                                <div class="imgOptionSlide">
                                    <input type="radio" name="artist" id="">
                                    <img src="/img/noImg.jpg" alt="" class="ux-image">
                                </div>
                                <div class="infoOptionSlide ux-fade-in">
                                    <p>Nombre <br> Artista</p>
                                    <RouterLink to="" class="ux-hover-lift"><img src="/img/instagramLogo.png" alt=""></RouterLink>
                                </div>
                            </div>
                            <div class="optionSlide ux-card ux-stagger-3">
                                <div class="imgOptionSlide">
                                    <input type="radio" name="artist" id="">
                                    <img src="/img/noImg.jpg" alt="" class="ux-image">
                                </div>
                                <div class="infoOptionSlide ux-fade-in">
                                    <p>Nombre <br> Artista</p>
                                    <RouterLink to="" class="ux-hover-lift"><img src="/img/instagramLogo.png" alt=""></RouterLink>
                                </div>
                            </div>
                            <div class="optionSlide ux-card ux-stagger-4">
                                <div class="imgOptionSlide">
                                    <input type="radio" name="artist" id="">
                                    <img src="/img/noImg.jpg" alt="" class="ux-image">
                                </div>
                                <div class="infoOptionSlide ux-fade-in">
                                    <p>Nombre <br> Artista</p>
                                    <RouterLink to="" class="ux-hover-lift"><img src="/img/instagramLogo.png" alt=""></RouterLink>
                                </div>
                            </div>
                            <div class="optionSlide ux-card ux-stagger-5">
                                <div class="imgOptionSlide">
                                    <input type="radio" name="artist" id="">
                                    <img src="/img/noImg.jpg" alt="" class="ux-image">
                                </div>
                                <div class="infoOptionSlide ux-fade-in">
                                    <p>Nombre <br> Artista</p>
                                    <RouterLink to="" class="ux-hover-lift"><img src="/img/instagramLogo.png" alt=""></RouterLink>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                    
                </div>
            </div>
            

            <div class="msgContainer jcFlexStart ux-slide-in-left ux-stagger-8">
                <div class="msgChat ux-fade-in">
                    <i class="fa-solid fa-play fa-flip-horizontal ux-scale-in"></i>
                    <p>Selecciona <span class="bold">el tamaño</span> del tatuaje</p>
                </div>
            </div>
            
        </section>
    </section>
</template>


