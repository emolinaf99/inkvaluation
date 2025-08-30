<script setup>
    import {reactive,ref,onMounted} from 'vue'

</script>

<template>
    <section class="contenedorSeccionPasoAPaso ">
        <div class="bloquePaso BGgrisClaro">
            <div class="infoPaso bl1">
                <div class="blockIconPaso">
                    <i class="fa-solid fa-gears"></i>
                </div>
                
                <div class="blockTitlePaso">
                    <h2 class="tituloPaso">{{ $t('Configura tu cuenta') }}</h2>
                    <div class="bigNumber">1</div>
                </div>
                <div class="divLine"></div>
                <p class="descripcionPaso">
                    {{ $t('El usuario se registra en la plataforma y configura su cuenta. Durante esta fase, se ingresan los datos del estudio, los servicios ofrecidos y se detallan los tatuadores o piercers disponibles.') }}
                </p>

            </div>
            <div class="fotoPaso bl2">
                <img src="/img/firstPass.png" alt="">
            </div>
        </div>
        <div class="bloquePaso">
            <div class="infoPaso">
                <div class="blockIconPaso">
                    <i class="fa-solid fa-link"></i>
                </div>
                
                <div class="blockTitlePaso">
                    <h2 class="tituloPaso" style="color: white;">{{ $t('Comparte el link') }}</h2>
                    <div class="bigNumber">2</div>
                </div>
                <p class="descripcionPaso" style="color: white;">
                    {{ $t('Se genera un enlace personalizado. Este enlace se envía a los clientes potenciales, quienes lo abren para interactuar con nuestro asistente virtual, quien hace preguntas para obtener información detallada sobre los deseos y preferencias del cliente.') }}
                </p>

            </div>
            <div class="fotoPaso bl">
                <img src="/img/confAssistant.png" alt="">
            </div>
        </div>
        <div class="bloquePaso BGgrisClaro">
            <div class="infoPaso bl1">
                <div class="blockIconPaso">
                    <i class="fa-solid fa-user-check"></i>
                </div>
                
                <div class="blockTitlePaso">
                    <h2 class="tituloPaso">{{ $t('Contacto') }}</h2>
                    <div class="bigNumber">3</div>
                </div>
                <p class="descripcionPaso">
                    {{ $t('El estudio recibe la información recopilada por el asistente virtual y se pone en contacto con el cliente potencial. Esta comunicación finaliza concretando el servicio solicitado, asegurando que el tatuador o perforador esté bien informado sobre las expectativas del cliente.') }}
                </p>

            </div>
            <div class="fotoPaso bl2">
                <img src="/img/detalleCotizacion.png" alt="">
            </div>
        </div>
    </section>
</template>



