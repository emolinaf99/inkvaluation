<script setup>
    import {reactive,ref,onMounted, watch} from 'vue'
    import { useRouter } from 'vue-router'
    import { authService } from '../js/auth.js'
    import { mostrarNotificacion } from '../js/mensajeNotificacionFront.js'

    const router = useRouter()

    // Función para manejar logout
    const handleLogout = async () => {
        // Cerrar el menú hamburguesa
        const navBarBurguerMenu = document.querySelector('.site-home');
        const fondoTransparenteOscuro = document.querySelector('.opacity');
        
        if (navBarBurguerMenu && navBarBurguerMenu.classList.contains('activeMain')) {
            navBarBurguerMenu.classList.remove('activeMain');
            if (fondoTransparenteOscuro) {
                fondoTransparenteOscuro.style.display = 'none';
            }
        }

        try {
            const result = await authService.logout();
            
            if (result.success) {
                mostrarNotificacion('Sesión cerrada exitosamente', 1);
                // Redirigir al home después del logout
                setTimeout(() => {
                    router.push('/');
                }, 1500);
            } else {
                mostrarNotificacion(result.message || 'Error cerrando sesión', 0);
                // Redirigir aunque haya error (ya se limpió el store)
                setTimeout(() => {
                    router.push('/');
                }, 1500);
            }
        } catch (error) {
            console.error('Error en logout:', error);
            mostrarNotificacion('Error cerrando sesión', 0);
            // Redirigir aunque haya error
            setTimeout(() => {
                router.push('/');
            }, 1500);
        }
    }

    onMounted(() => {
        
        function abrirYCerrarNavbarBurguerMenu() {
            let navBarBurguerMenu = document.querySelector('.site-home')
            let fondoTransparenteOscuro = document.querySelector('.opacity')

            if(navBarBurguerMenu.classList.contains('activeMain')) {
                navBarBurguerMenu.classList.remove('activeMain')
                fondoTransparenteOscuro.style.display = 'none'
            } else {
                navBarBurguerMenu.classList.add('activeMain')
                fondoTransparenteOscuro.style.display = 'flex'
            }
        }

        // Ejecucion de abrirYCerrarNavbarBurguerMenu()

        let burgerMenuIcon = document.getElementById('burgerMenuIcon')
        let equisBurgerMenu = document.getElementById('equisOculta')
        let optionsNavbarBurgerMenu = document.querySelectorAll('.site-home a')
        let fondoTransparenteOscuro = document.querySelector('.opacity')

        burgerMenuIcon.addEventListener('click',() => {
            abrirYCerrarNavbarBurguerMenu()
        })

        equisBurgerMenu.addEventListener('click',() => {
            abrirYCerrarNavbarBurguerMenu()
        })

        fondoTransparenteOscuro.addEventListener('click',() => {
            abrirYCerrarNavbarBurguerMenu()
        })


        // Solo cerrar menú para los RouterLinks, no para el botón de logout
        const routerLinks = document.querySelectorAll('.site-home a');
        routerLinks.forEach(link => {
            link.addEventListener('click',() => {
                abrirYCerrarNavbarBurguerMenu()
            })
        });

        

    })
    
</script>

<template>
    <!-- Menu hamburguesa -->
    <div class="site-home" >
        <i class="fa-solid fa-xmark equis" id="equisOculta"></i> 
        <div class="contenedorSiteHome">
            <RouterLink to="/configAssistant"><div class="contItem"><i class="fa-solid fa-user-gear"></i><p>{{ $t('Asistente personal') }}</p></div></RouterLink>
            <RouterLink to="/assistantBussiness"><div class="contItem"><i class="fa-solid fa-house-user"></i><p>{{ $t('Asistente de estudio') }}</p></div></RouterLink>
            <RouterLink to="/forms"><div class="contItem"><i class="fa-solid fa-file"></i><p>{{ $t('Formularios') }}</p></div></RouterLink>    
            <RouterLink to="/request"><div class="contItem"><i class="fa-solid fa-file-signature"></i><p>{{ $t('Solicitudes') }}</p></div></RouterLink>    
            
        </div>
        <div class="contenedorSiteHome">
            <RouterLink to="/account"><div class="contItem"><i class="fa-solid fa-user"></i><p>{{ $t('Mi cuenta') }}</p></div></RouterLink>
            <RouterLink to="/accountBussiness"><div class="contItem"><i class="fa-solid fa-pen-nib"></i><p>{{ $t('Mi estudio') }}</p></div></RouterLink>
            <RouterLink to="/mailbox"><div class="contItem"><i class="fa-solid fa-inbox"></i><p>{{ $t('Buzón de sugerencias') }}</p></div></RouterLink>    
            <RouterLink to="" @click.prevent="handleLogout"><div class="contItem" style="cursor: pointer;"><i class="fa-solid fa-right-from-bracket"></i><p>{{ $t('Cerrar Sesión') }}</p></div> </RouterLink>
        </div>

        
        
    </div>
</template>


