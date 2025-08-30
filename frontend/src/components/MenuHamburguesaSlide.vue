<script setup>
    import {reactive,ref,onMounted, watch} from 'vue'

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


        optionsNavbarBurgerMenu.forEach(option => {
            option.addEventListener('click',() => {
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
            <RouterLink to="/"><div class="contItem"><i class="fa-solid fa-right-from-bracket"></i><p>{{ $t('Cerrar Sesión') }}</p></div></RouterLink> 
        </div>

        
        
    </div>
</template>


