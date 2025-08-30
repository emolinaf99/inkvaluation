<script setup>
    import {reactive,ref,onMounted} from 'vue'

</script>

<template>
    
    <div class="imgFooter"></div>
    <section class="containerFooter">
        <div class="contenedorRedes">
            <div class="bloqueVacio"></div>
            <div class="redes">
                <a href="https://www.facebook.com/" target="_blank"><i class="fa-brands fa-facebook"></i></a>
                <a href="https://www.instagram.com/inkvaluation/" target="_blank"><i class="fa-brands fa-instagram"></i></a>
                <a href="https://www.linkedin.com/" target="_blank"><i class="fa-brands fa-linkedin"></i></a>
            </div>
            <div class="bloqueVacio"></div>
        </div>
        <!-- <img class="imgFooter" src="/images/logoBlanco.png" alt="">
        <img class="imgFooterCertificacion" src="/images/N&B-ISO-9001-2015.png" alt=""> -->
        
        <div class="copyright">
            <p>Copyright <i class="fa-regular fa-copyright"></i> 2025 Inkvaluation S.A.S</p>
        </div>
        <div class="tyc-Pv">
            <a href=""><p>{{ $t('Términos y Condiciones') }}</p></a>
            <p>|</p>
            <a href=""><p>{{ $t('Política de Privacidad') }}</p></a>
        </div>
        
    </section>
    
</template>

