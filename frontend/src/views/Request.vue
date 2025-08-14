<script setup>
    import {onMounted,reactive,ref} from 'vue'
    import {scrollearConClick} from '/src/js/scrollWithClick'
    import RequestSkeleton from '../components/skeletons/RequestSkeleton.vue'
    import { useSkeletonDev } from '../js/useSkeletonDev.js'

    const { isLoading, isFading } = useSkeletonDev('requests', 1800)

    function scrollForAll(flecha,izqODer) {
        let contenedorScroll = flecha.parentNode.parentNode.querySelector('.vitrinaSlide')
        let itemIntoScroll = flecha.parentNode.parentNode.querySelector('.vitrinaSlide img')

        scrollearConClick(contenedorScroll,itemIntoScroll,izqODer)
    }

    function verOcultarDetalle(btnMostrarOcultar) {
        let contenedorDetalle = btnMostrarOcultar.parentNode.parentNode.querySelector('.contDetailRequest')
        let contenedorDetalleVisible = document.querySelector('.visibleForm')
        
        if(contenedorDetalleVisible && contenedorDetalleVisible != contenedorDetalle) {
          
            const btnMostrarOcultarVisible = contenedorDetalleVisible.parentNode.querySelector('.previewRequest i')

            contenedorDetalleVisible.classList.add('hiddenForm')
            contenedorDetalleVisible.classList.remove('visibleForm')
            btnMostrarOcultarVisible.classList.add('fa-chevron-down')
            btnMostrarOcultarVisible.classList.remove('fa-chevron-up')
        }

        if(contenedorDetalle.classList.contains('hiddenForm')) {
            contenedorDetalle.classList.remove('hiddenForm')
            contenedorDetalle.classList.add('visibleForm')
            btnMostrarOcultar.classList.remove('fa-chevron-down')
            btnMostrarOcultar.classList.add('fa-chevron-up')
        } else {
            contenedorDetalle.classList.add('hiddenForm')
            contenedorDetalle.classList.remove('visibleForm')
            btnMostrarOcultar.classList.add('fa-chevron-down')
            btnMostrarOcultar.classList.remove('fa-chevron-up')
        }
        
    }

    onMounted(() => {

        

    })
    
</script>

<template>
    <!-- Skeleton Loader -->
    <div v-if="isLoading" class="skeleton-container" :class="{ 'skeleton-fade-out': isFading }">
        <RequestSkeleton />
    </div>

    <!-- Contenido Real -->
    <section v-else class="sectionSolicitudes">
        <h1>Solicitudes de cotización</h1>
        <div class="contenedorGeneralSolicitudes">
            <div class="introBlock">
                
                <div class="searchCont">
                    <input class="inputSearchRequest" type="search" name="" id="" placeholder="Buscar">
                    <button class="btnDownloadRequests" type="button">Descargar Cotizaciones</button>
                </div>

                <div class="contenedorSolicitudes">
                    <div class="bloqueSolicitud">
                        <div class="previewRequest">
                            <img src="/img/tatuajeMano.png" alt="">
                            <div class="prevMiddle">
                                <p>06/07/2024</p>
                                <p class="bold">Javier Ruiz</p>
                                <button type="button" class="buttonStatusRequest BGYellow">Pendiente</button>
                            </div>
                            <i class="fa-solid fa-chevron-down" @click="verOcultarDetalle($event.target)"></i>
                        </div>

                        <div class="contDetailRequest hiddenForm">
                            <div class="detailRequest">
                                <section class="sectionDescInfoImages">
                                    <div class="sectionInfoAndImages">
                                        <div class="contenedorImagenes">
                                            
                                            <div class="imagenesSolicitud">
                                                <div class="vitrinaSlide">
                                                    <img src="/img/tatuajeMano.png" alt="">
                                                    <img src="/img/noImg.jpg" alt="">   
                                                </div>
                                                <div class="botonesSlide">
                                                    <i class="fa-solid fa-chevron-left scrollIzquierdaDetalle" @click="scrollForAll($event.target, 1)"></i>
                                                    <i class="fa-solid fa-chevron-right scrollDerechaDetalle" @click="scrollForAll($event.target, 0)"></i>
                                                </div>
                                            </div>
                                            
                                            
                                        </div>
                                        <div class="descripcionRequest desMovile" >
                                            <label for="">Descripción:</label>
                                            <div name="" id="">Quiero un tatuaje como el adjuntado pero con una cruz al lado izquierdo</div>
                                        </div>
                                        <div class="sectionInfo">
                                            
                                            <div class="infoContactRequest">
                                                <div class="itemContactRequest">
                                                    <i class="fa-solid fa-envelope"></i>
                                                    <p>correo@gmail.com</p>
                                                </div>
                                                <div class="itemContactRequest">
                                                    <i class="fa-solid fa-phone"></i>
                                                    <p>3008734567</p>
                                                </div>
                                            </div>
                                            <div class="infoContactRequest">
                                                <div class="itemContactRequest">
                                                    <i class="fa-solid fa-user"></i>
                                                    <p>Javier Ruiz</p>
                                                </div>
                                                <div class="itemContactRequest">
                                                    <i class="fa-solid fa-expand"></i>
                                                    <p>Pequeño</p>
                                                </div>
                                                <div class="itemContactRequest">
                                                    <i class="fa-solid fa-child-reaching"></i>
                                                    <p>Brazo-Mano derecha</p>
                                                </div>
                                                <div class="itemContactRequest">
                                                    <i class="fa-solid fa-fill-drip"></i>
                                                    <p>Negro</p>
                                                </div>
                                                <div class="itemContactRequest">
                                                    <i class="fa-solid fa-eye-dropper"></i>
                                                    <div class="contSkinColors">
                                                        <div class="itemColor" style="background-color: grey"></div>
                                                        <div class="itemColor" style="background-color: grey"></div>
                                                        <div class="itemColor" style="background-color: grey"></div>
                                                        <div class="itemColor" style="background-color: grey"></div>
                                                        <div class="itemColor" style="background-color: grey"></div>
                                                        
                                                    </div>
                                                </div>
                                                <div class="itemContactRequest">
                                                    <i class="fa-solid fa-clock"></i>
                                                    <p>En la mañana</p>
                                                </div>
                                                <div class="itemContactRequest">
                                                    <i class="fa-solid fa-location-dot"></i>
                                                    <p>Medellín</p>
                                                </div>
                                                
                                            </div>
                                        </div>
                                        
                                    </div>
                                    <div class="descripcionRequest desDesktop" >
                                        <label for="">Descripción:</label>
                                        <div name="" id="">Quiero un tatuaje como el adjuntado pero con una cruz al lado izquierdo</div>
                                    </div>
                                </section>
                                
                                
                                <div class="infoCotization">
                                    <div class="contGeneralCotizacion">
                                        <label for="">Enviar cotización</label>
                                        <p>¡Hola Javier! Soy nombreDelNegocioOArtista, acabo de ver la información del tatuaje que deseas realizarte</p>
                                        <div class="inputAndBtnPrice">
                                            <input type="text" name="" id="">
                                            <select name="" id="">
                                                <option value="">COP</option>
                                                <option value="">USD</option>
                                                <option value="">EUR</option>
                                            </select>

                                        </div>
                                        
                                    </div>
                                    <div class="contGeneralCotizacion">
                                        <label for="">Comentarios adicionales</label>
                                        <textarea name="" id="" rows="3"></textarea>
                                        
                                    </div>
                                    <div class="contGeneralCotizacion">
                                        <button class="BGGreen" type="button">Enviar Cotización por Whatsapp</button>
                                        <!-- <button class="BGDarkGray colorWhite" type="button">Enviar Cotización por Email</button> -->
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <div class="bloqueSolicitud">
                        <div class="previewRequest">
                            <img src="/img/noImg.jpg" alt="">
                            <div class="prevMiddle">
                                <p>06/07/2024</p>
                                <p class="bold">Javier</p>
                                <button type="button" class="buttonStatusRequest BGGreen">Realizado</button>
                            </div>
                            <i class="fa-solid fa-chevron-down" @click="verOcultarDetalle($event.target)"></i>
                        </div>

                        <div class="contDetailRequest hiddenForm">
                            <div class="detailRequest">
                                <section class="sectionDescInfoImages">
                                    <div class="sectionInfoAndImages">
                                        <div class="contenedorImagenes">
                                            
                                            <div class="imagenesSolicitud">
                                                <div class="vitrinaSlide">
                                                    <img src="/img/noImg.jpg" alt="">
                                                    <img src="/img/noImg.jpg" alt="">   
                                                </div>
                                                <div class="botonesSlide">
                                                    <i class="fa-solid fa-chevron-left scrollIzquierdaDetalle" @click="scrollForAll($event.target, 1)"></i>
                                                    <i class="fa-solid fa-chevron-right scrollDerechaDetalle" @click="scrollForAll($event.target, 0)"></i>
                                                </div>
                                            </div>
                                            
                                            
                                        </div>
                                        <div class="descripcionRequest desMovile" >
                                            <label for="">Descripción:</label>
                                            <div name="" id="">Sin Descripción Sin Descripción Sin DescripciónSin DescripciónSin DescripciónSin DescripciónSin Descripción Sin Descripción</div>
                                        </div>
                                        <div class="sectionInfo">
                                            
                                            <div class="infoContactRequest">
                                                <div class="itemContactRequest">
                                                    <i class="fa-solid fa-envelope"></i>
                                                    <p>correo@gmail.com</p>
                                                </div>
                                                <div class="itemContactRequest">
                                                    <i class="fa-solid fa-phone"></i>
                                                    <p>3008734567</p>
                                                </div>
                                            </div>
                                            <div class="infoContactRequest">
                                                <div class="itemContactRequest">
                                                    <i class="fa-solid fa-user"></i>
                                                    <p>Jorge Ruiz</p>
                                                </div>
                                                <div class="itemContactRequest">
                                                    <i class="fa-solid fa-expand"></i>
                                                    <p>Mediano</p>
                                                </div>
                                                <div class="itemContactRequest">
                                                    <i class="fa-solid fa-child-reaching"></i>
                                                    <p>Torso-Pectoral derecho</p>
                                                </div>
                                                <div class="itemContactRequest">
                                                    <i class="fa-solid fa-fill-drip"></i>
                                                    <p>Gris oscuro</p>
                                                </div>
                                                <div class="itemContactRequest">
                                                    <i class="fa-solid fa-eye-dropper"></i>
                                                    <div class="contSkinColors">
                                                        <div class="itemColor" style="background-color: grey"></div>
                                                        <div class="itemColor" style="background-color: grey"></div>
                                                        <div class="itemColor" style="background-color: grey"></div>
                                                        <div class="itemColor" style="background-color: grey"></div>
                                                        <div class="itemColor" style="background-color: grey"></div>
                                                        
                                                    </div>
                                                </div>
                                                <div class="itemContactRequest">
                                                    <i class="fa-solid fa-clock"></i>
                                                    <p>En la mañana</p>
                                                </div>
                                                <div class="itemContactRequest">
                                                    <i class="fa-solid fa-location-dot"></i>
                                                    <p>Medellín</p>
                                                </div>
                                                
                                            </div>
                                        </div>
                                        
                                    </div>
                                    <div class="descripcionRequest desDesktop" >
                                        <label for="">Descripción:</label>
                                        <div name="" id="">Sin Descripción Sin Descripción Sin DescripciónSin DescripciónSin DescripciónSin DescripciónSin Descripción Sin Descripción</div>
                                    </div>
                                </section>
                                
                                
                                <div class="infoCotization">
                                    <div class="contGeneralCotizacion">
                                        <label for="">Enviar cotización</label>
                                        <p>¡Hola Javier! Soy nombreDelNegocioOArtista, acabo de ver la información del tatuaje que deseas realizarte</p>
                                        <div class="inputAndBtnPrice">
                                            <input disabled type="text" name="" value="1.300.000">
                                            <select disabled name="" id="">
                                                <option value="">COP</option>
                                                <option value="">USD</option>
                                                <option value="">EUR</option>
                                            </select>

                                        </div>
                                        
                                    </div>
                                    <div class="contGeneralCotizacion">
                                        <label for="">Comentarios adicionales</label>
                                        <textarea disabled name="" id="" rows="3"></textarea>
                                        
                                    </div>
                                    <div class="contGeneralCotizacion">
                                        <button class="BGGreen" type="button">Enviar Cotización por Whatsapp</button>
                                        <button class="BGDarkGray colorWhite" type="button">Enviar Cotización por Email</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    
                    
                </div>
            </div>
            
            
            
            <!-- Paginación de consulta -->
            <div class="contenedorPaginacion">
                <div class="paginacionBlock">
                    <a class="flechaAnterior">
                        <i class="fa-solid fa-chevron-left"></i>
                        <p>Anterior</p>
                        <p>|</p>
                    </a>
                    <a class="numberPage firstPage antPageCache">1</a>
                    <span class="antPageCache">...</span>
                    
                    <div class="totalPaginas"></div>
                    
                    <span class="sigPageCache">...</span>
                    <a class="numberPage sigPageCache lastPage"><!-- Aqui numero total de--></a>
                    
                    <input type="text" class="numeroTotalPages" hidden value="<%= cantidadPaginas %>">
                
                
                    <a class="flechaSiguiente">
                        <p>|</p>
                        <p>Siguiente</p>
                        <i class="fa-solid fa-chevron-right"></i>
                    </a>
                </div>
            </div>

        </div>
    </section>
</template>


