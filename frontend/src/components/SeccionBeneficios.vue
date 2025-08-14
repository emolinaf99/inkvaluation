<script setup>
    import {reactive,ref,onMounted} from 'vue'


</script>

<template>
    <div class="contenedorBeneficios">
        <div class="contenedorTitleBeneficios">
            <h1 class="titleMain">Beneficios</h1>
            <p class="descripcion">InkValuation brinda beneficios para los clientes y para los estudios de tatuaje </p>
            <br>
        </div>
        
        <div class="cajasBeneficios">
            <div class="beneficioBlock sinBordeIzquierdo sinBordeArriba">
                <i class="fa-solid fa-house-circle-check iconBeneficios"></i>
                <h4 class="titleBeneficio">Facilidad de uso</h4>
                <p class="descripcionBeneficio">Los clientes pueden dejar sus datos personales y especificar sus preferencias de tatuaje de manera rápida y sencilla.</p>
            </div>
            <div class="beneficioBlock sinBordeArriba">
                <i class="fa-solid fa-box iconBeneficios"></i>
                <h4 class="titleBeneficio">Elección de Tatuador:</h4>
                <p class="descripcionBeneficio">Permite a los clientes seleccionar con qué tatuador del estudio desean realizar su tatuaje, asegurando una experiencia personalizada.</p>
            </div>
            <div class="beneficioBlock sinBordeArriba">
                <i class="fa-solid fa-comment iconBeneficios"></i>
                <h4 class="titleBeneficio">Claridad en la Comunicación:</h4>
                <p class="descripcionBeneficio">Los clientes pueden detallar el diseño aproximado, la ubicación del tatuaje, el tipo de tatuaje y el color de la tinta, eliminando malentendidos y asegurando que sus expectativas sean claras desde el principio.</p>
            </div>
            <div class="beneficioBlock sinBordeDerecho sinBordeArriba">
                <i class="fa-solid fa-business-time iconBeneficios"></i>
                <h4 class="titleBeneficio">Atención 24/7:</h4>
                <p class="descripcionBeneficio">La plataforma está disponible las 24 horas del día, los 7 días de la semana, permitiendo a los clientes realizar consultas y reservar citas en cualquier momento.</p>
            </div>
            <div class="beneficioBlock sinBordeIzquierdo sinBordeAbajo">
                <i class="fa-solid fa-clock iconBeneficios"></i>
                <h4 class="titleBeneficio">Ahorro de Tiempo:</h4>
                <p class="descripcionBeneficio">La plataforma organiza y centraliza la información de los clientes, permitiendo a los tatuadores conocer fácilmente las preferencias de cada cliente y eliminando la necesidad de largas conversaciones iniciales.</p>
            </div>
            <div class="beneficioBlock sinBordeAbajo">
                <i class="fa-solid fa-folder-open iconBeneficios"></i>
                <h4 class="titleBeneficio">Gestión de Clientes Potenciales: </h4>
                <p class="descripcionBeneficio">Facilita la gestión de todos los clientes potenciales en un solo lugar, mejorando la organización y el seguimiento de cada caso.</p>
            </div>
            <div class="beneficioBlock sinBordeAbajo">
                <i class="fa-solid fa-filter iconBeneficios"></i>
                <h4 class="titleBeneficio">Filtrado de Consultas Irrelevantes: </h4>
                <p class="descripcionBeneficio">Ayuda a filtrar a los clientes que solo buscan información sin intención de concretar un tatuaje, permitiendo a los tatuadores enfocarse en clientes serios y maximizar su tiempo productivo.</p>
            </div>
            <div class="beneficioBlock sinBordeDerecho sinBordeAbajo" id="lastBeneficioBlock">
                <i class="fa-solid fa-id-card iconBeneficios"></i>
                <h4 class="titleBeneficio">Mejora de la Experiencia del Cliente: </h4>
                <p class="descripcionBeneficio">Al tener toda la información necesaria de antemano, los tatuadores pueden ofrecer un servicio más eficiente y personalizado, mejorando la satisfacción del cliente.</p>
            </div>
        </div>
        
    </div>
</template>
