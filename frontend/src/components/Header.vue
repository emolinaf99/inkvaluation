<script setup>
    import {reactive,ref,onMounted,watch} from 'vue'
    import { RouterLink, RouterView, useRoute} from 'vue-router'
    import LanguageSelector from './LanguageSelector.vue'

    const route = useRoute()
    const isBurgerMenuOpen = ref(false)

    const toggleBurgerMenu = () => {
        isBurgerMenuOpen.value = !isBurgerMenuOpen.value
    }

    const handleScroll = (header,navBarMenu) => {
        let menuHamburguesa = header.querySelector('#burgerMenuIcon')
        let botonRegistro = header.querySelector('.btnRegistro')
        let opcionesRedirect = header.querySelectorAll('.redirectNavbar')
        
        if(window.scrollY >= 50) {
            header.classList.add('headerScroll')
            // menuHamburguesa.classList.add('menuHamburguesaScroll')
            // botonRegistro.classList.add('btnRegistroScroll')
            for(const opcion of opcionesRedirect) {
                opcion.classList.add('redirectNavbarGrey')
            }
            
        } else {
            if(route.name == 'Prices') { // si la ruta es Prices
                header.classList.add('headerScroll')
                // botonRegistro.classList.add('btnRegistroScroll')
                // menuHamburguesa.classList.add('menuHamburguesaScroll')
                for(const opcion of opcionesRedirect) {
                    opcion.classList.add('redirectNavbarGrey')
                }
            } else if(!navBarMenu.classList.contains('activeNavbar')) {
                header.classList.remove('headerScroll')
                header.classList.remove('BGWhite')
                // botonRegistro.classList.remove('btnRegistroScroll')
                // menuHamburguesa.classList.remove('menuHamburguesaScroll')
                for(const opcion of opcionesRedirect) {
                    opcion.classList.remove('redirectNavbarGrey')
                }
            } 
            
        }
    };

    const aparicionDesaparicionMenuNavbar = (iconoBurgerMenu,navBarMenu,header,botonRegistro) => {
        
        if (window.matchMedia("(max-width: 1279px)").matches) {
            navBarMenu.classList.toggle('activeNavbar')
            let opcionesRedirect = navBarMenu.querySelectorAll('.redirectNavbar')

            header.classList.toggle('BGWhite')
            iconoBurgerMenu.classList.toggle('redirectNavbarGrey')
            botonRegistro.classList.toggle('btnRegistroScroll')

            if(iconoBurgerMenu.classList.contains('fa-bars')) {
                iconoBurgerMenu.classList.remove('fa-bars')
                iconoBurgerMenu.classList.add('fa-x')

                for(const opcion of opcionesRedirect) {
                    opcion.classList.add('redirectNavbarGrey')
                }
            } else {
                iconoBurgerMenu.classList.add('fa-bars')
                iconoBurgerMenu.classList.remove('fa-x')
            }
        } 
        
    };


    onMounted(() => { // cuando carga la pagina
        const navBarMenu = document.querySelector('.navbarMenu')
        // const burgerMenuIcon = document.getElementById('burgerMenuIcon')
        const header = document.querySelector('header')
        const logoHeader = document.querySelector('.logoApp')
        const botonRegistro = document.querySelector('.btnRegistro')
       
        // burgerMenuIcon.addEventListener('click',() => {
        //     aparicionDesaparicionMenuNavbar(burgerMenuIcon,navBarMenu,header,botonRegistro)
        // })

        window.addEventListener('scroll',() => {
            handleScroll(header,navBarMenu)
        })

        // navBarMenu.addEventListener('click',() => {
            
        //     aparicionDesaparicionMenuNavbar(burgerMenuIcon,navBarMenu,header,botonRegistro)
        // })

        logoHeader.addEventListener('click',() => {
            
            header.classList.remove('BGWhite')
            burgerMenuIcon.classList.remove('redirectNavbarGrey')
            burgerMenuIcon.classList.add('fa-bars')
            burgerMenuIcon.classList.remove('fa-x')
            navBarMenu.classList.remove('activeNavbar')
            
        })

    })

    watch(() => route.name, (newRouteName) => {
        const navBarMenu = document.querySelector('.navbarMenu')
        const header = document.querySelector('header')
        handleScroll(header,navBarMenu)
    })
    
</script>

<template>
    <!-- Burger Menu Mobile/Tablet -->
    <div class="mobile-burger-menu" :class="{ 'active': isBurgerMenuOpen }">
        <div class="opacity-overlay" @click="toggleBurgerMenu"></div>
        <div class="burger-menu-content">
            <i class="fa-solid fa-xmark close-burger" @click="toggleBurgerMenu"></i>
            <div class="burger-menu-items">
                <RouterLink to="/prices" @click="toggleBurgerMenu" class="burger-menu-item">
                    <i class="fa-solid fa-tag"></i>
                    <span>{{ $t('Precios') }}</span>
                </RouterLink>
                <RouterLink to="/login" @click="toggleBurgerMenu" class="burger-menu-item">
                    <i class="fa-solid fa-sign-in-alt"></i>
                    <span>{{ $t('Login') }}</span>
                </RouterLink>
                <RouterLink to="/register" @click="toggleBurgerMenu" class="burger-menu-item">
                    <i class="fa-solid fa-user-plus"></i>
                    <span>{{ $t('Registro') }}</span>
                </RouterLink>
            </div>
        </div>
    </div>

    <div class="bloque_logo_burgerMenu">
        <i class="fa-solid fa-bars mobile-burger-icon" @click="toggleBurgerMenu"></i>
        <RouterLink to="/"><img class="logoApp" src="/img/InkValuationLogo.png" alt=""></RouterLink>
        <div class="navbarMenu desktop-only">
            <RouterLink to="/prices" :class="{ 'redirectNavbar': true, 'redirectNavbarGrey': route.name === 'Prices' }">{{ $t('Precios') }}</RouterLink>
            <RouterLink to="/login" :class="{ 'redirectNavbar': true, 'redirectNavbarGrey': route.name === 'Prices' }">{{ $t('Login') }}</RouterLink>
        </div>
    </div>
    
    <div class="header-right">
        <LanguageSelector />
        <div class="btnRegistroBlock desktop-only">
            <RouterLink to="/register" :class="{ 'btnRegistro': true, 'btnRegistroScroll': route.name === 'Prices' }">{{ $t('Registro') }}</RouterLink>
        </div>
    </div>

    <div class="notificacionContainer">
        <p></p>
    </div>
</template>

