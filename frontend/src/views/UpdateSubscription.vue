<script setup>
    import {reactive, ref, onMounted} from 'vue'
    import { RouterLink, RouterView, useRoute} from 'vue-router'
    import { useI18n } from 'vue-i18n'

    const route = useRoute()
    const { t } = useI18n()

    onMounted(() => {

        

        function cambiarTipoPlan(tipoPlan, btnsTipoPlan) {
            let allPrices = document.querySelectorAll('.priceNumber');
            
            if (tipoPlan.classList.contains('monthlyPlan')) {
                if (!tipoPlan.classList.contains('optionSelected')) {
                    for (const price of allPrices) {
                        let precioEnNumero = Number(price.innerText);
                        let precioXMes = precioEnNumero / 12;
                        let textoTipoPlan = price.parentNode.parentNode.querySelector('.planType')

                        price.innerText = precioXMes;
                        textoTipoPlan.innerText= ' / ' + t('mes')
                    }
                }
            } else if (tipoPlan.classList.contains('anualPlan')) {
                if (!tipoPlan.classList.contains('optionSelected')) {
                    for (const price of allPrices) {
                        let precioEnNumero = Number(price.innerText);
                        let precioXAno = precioEnNumero * 12;
                        let textoTipoPlan = price.parentNode.parentNode.querySelector('.planType') 

                        price.innerText = precioXAno; 
                        textoTipoPlan.innerText= ' / ' + t('año')
                    }
                }
            }
            
            btnsTipoPlan.forEach(btn => {
                btn.classList.remove('optionSelected'); // Remueve la clase de todos los botones
            });
            
            tipoPlan.classList.add('optionSelected'); // Agrega la clase al botón seleccionado
        }

        let btnsTipoPlan = document.querySelectorAll('.optionPlan')

        btnsTipoPlan.forEach(tipoPlan => {
            tipoPlan.addEventListener('click',() => {
                cambiarTipoPlan(tipoPlan,btnsTipoPlan)
            })  
            
        });
    })

</script>

<template>
    <section class="sectionPrices">
        <div class="containerOnePrices">
            <div class="textPrices">
                <h1>{{ $t('Actualizar suscripción') }}</h1>
                <p>{{ $t('Elije el plan adecuado para ti.') }}</p>
            </div>
            <div class="selectPlan">
                <div class="optionPlan optionSelected monthlyPlan">{{ $t('Mensual') }}</div>
                <div class="optionPlan anualPlan">{{ $t('Anual') }}</div>
            </div>
        </div>
        <div class="containerTwoPrices">
            <div class="cajaPlan">
                <div class="namePlan">{{ $t('PLAN INICIAL') }}</div>
                <div class="cajaInfoPlan">
                    <div class="pricePlan"><span class="price"><small class="iconMoney">$</small><span class="priceNumber">0</span></span><small class="planType"> / {{ $t('mes') }}</small></div>
                    <ul class="planBenefits">
                        <li class="planBenefit">{{ $t('1 Usuario') }}</li>
                        <li class="planBenefit">{{ $t('5 Cotizaciones') }}</li>
                        <li class="planBenefit">{{ $t('Sin personalización visual de tu asistente') }}</li>
                    </ul>
                    <button class="botonElegirPlan">{{ $t('Actualizar a este plan') }}</button>
                </div>
                
            </div>
            <div class="cajaPlan">
                <div class="namePlan">{{ $t('PLAN PROFESIONAL') }}</div>
                <div class="cajaInfoPlan">
                    <div class="pricePlan"><span class="price"><small class="iconMoney">$</small><span class="priceNumber">29</span></span><small class="planType"> / {{ $t('mes') }}</small></div>
                    <ul class="planBenefits">
                        <li class="planBenefit">{{ $t('5 Usuarios') }}</li>
                        <li class="planBenefit">{{ $t('60 Cotizaciones') }}</li>
                        <li class="planBenefit">{{ $t('Personalización visual de tu asistente') }}</li>
                    </ul>
                    <button class="botonElegirPlan">{{ $t('Actualizar a este plan') }}</button>
                </div>
                
            </div>
            <div class="cajaPlan">
                <div class="namePlan">{{ $t('PLAN PRO') }}</div>
                <div class="cajaInfoPlan">
                    <div class="pricePlan"><span class="price"><small class="iconMoney">$</small><span class="priceNumber">60</span></span><small class="planType"> / {{ $t('mes') }}</small></div>
                    <ul class="planBenefits">
                        <li class="planBenefit">{{ $t('20 Usuarios') }}</li>
                        <li class="planBenefit">{{ $t('Cotizaciones ilimitadas') }}</li>
                        <li class="planBenefit">{{ $t('Personalización visual de tu asistente') }}</li>
                    </ul>
                    <button class="botonElegirPlan">{{ $t('Actualizar a este plan') }}</button>
                </div>
                
            </div>
        </div>
    </section>
</template>


