<script setup>
    const props = defineProps({
        formulario: {
            type: Object,
            required: true
        }
    })

    defineEmits([
        'delete-form'
    ])

</script>

<template>
    <div  class="questionAndType">
        <div class="serviceColumn">
            
            <p>{{formulario.title}}</p>
        </div>
        <div class="formRow">
            <RouterLink :to="{ name: 'DetailForm', params: { formId: formulario.id } }" class="iconText">
                <p>Detalle</p>
                <i class="fa-solid fa-eye"></i>
            </RouterLink>
            <div class="iconText" @click="$emit('delete-form',formulario.id)">
                <p>Eliminar</p>
                <i class="fa-solid fa-trash"></i>
            </div>
            
        </div>

    </div>
</template>


