<script setup>
    import MenuHamburguesaSlide from '@/components/MenuHamburguesaSlide.vue';

</script>

<template>
    <MenuHamburguesaSlide/>
    <div class="opacity"></div>
    
    <div class="bloque_logo_burgerMenu">
        <i class="fa-solid fa-bars redirectNavbarGrey" style="display: flex !important;" id="burgerMenuIcon"></i>
    </div>

    <RouterLink to="/"><img class="logoApp" src="/img/InkValuationLogo.png" alt=""></RouterLink>
    <div class="bloque_logo_burgerMenu">
        <i style="width: 30px;"></i>
    </div>

    <div class="notificacionContainer">
        <p></p>
    </div>
    
    
</template>



