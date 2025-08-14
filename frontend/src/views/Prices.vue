<script setup>
    import {reactive, ref, onMounted} from 'vue'
    import { RouterLink, RouterView, useRoute} from 'vue-router'

    const route = useRoute()

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
                        textoTipoPlan.innerText= ' / mes'
                    }
                }
            } else if (tipoPlan.classList.contains('anualPlan')) {
                if (!tipoPlan.classList.contains('optionSelected')) {
                    for (const price of allPrices) {
                        let precioEnNumero = Number(price.innerText);
                        let precioXAno = precioEnNumero * 12;
                        let textoTipoPlan = price.parentNode.parentNode.querySelector('.planType') 

                        price.innerText = precioXAno; 
                        textoTipoPlan.innerText= ' / año'
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
                <h1>Precios.</h1>
                <p>Elije el plan adecuado para ti.</p>
            </div>
            <div class="selectPlan">
                <div class="optionPlan optionSelected monthlyPlan">Mensual</div>
                <div class="optionPlan anualPlan">Anual</div>
            </div>
        </div>
        <div class="containerTwoPrices">
            <div class="cajaPlan">
                <div class="namePlan">PLAN INICIAL</div>
                <div class="cajaInfoPlan">
                    <div class="pricePlan"><span class="price"><small class="iconMoney">$</small><span class="priceNumber">0</span></span><small class="planType"> / mes</small></div>
                    <ul class="planBenefits">
                        <li class="planBenefit">1 Usuario</li>
                        <li class="planBenefit">5 Cotizaciones</li>
                        <li class="planBenefit">Sin personalización visual de tu asistente </li>
                    </ul>
                    <button class="botonElegirPlan">Empezar</button>
                </div>
                
            </div>
            <div class="cajaPlan">
                <div class="namePlan">PLAN PROFESIONAL</div>
                <div class="cajaInfoPlan">
                    <div class="pricePlan"><span class="price"><small class="iconMoney">$</small><span class="priceNumber">29</span></span><small class="planType"> / mes</small></div>
                    <ul class="planBenefits">
                        <li class="planBenefit">5 Usuarios</li>
                        <li class="planBenefit">60 Cotizaciones</li>
                        <li class="planBenefit">Personalización visual de tu asistente </li>
                    </ul>
                    <button class="botonElegirPlan">Empezar</button>
                </div>
                
            </div>
            <div class="cajaPlan">
                <div class="namePlan">PLAN PRO</div>
                <div class="cajaInfoPlan">
                    <div class="pricePlan"><span class="price"><small class="iconMoney">$</small><span class="priceNumber">60</span></span><small class="planType"> / mes</small></div>
                    <ul class="planBenefits">
                        <li class="planBenefit">20 Usuarios</li>
                        <li class="planBenefit">Cotizaciones ilimitadas</li>
                        <li class="planBenefit">Personalización visual de tu asistente </li>
                    </ul>
                    <button class="botonElegirPlan">Empezar</button>
                </div>
                
            </div>
        </div>
    </section>
</template>



