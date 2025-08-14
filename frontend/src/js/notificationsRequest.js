export function mostrarNotificacion(mensaje,color) {
    // mensaje es el mensaje que aparecera
    // color es si es verde (1) o si es rojo (0)

    let notificacionTexto = document.querySelector('.notificacionContainer')

    notificacionTexto.style.display = 'flex'
    notificacionTexto.innerHTML = `<p>${mensaje}</p>`

    if(color == 1) {
        notificacionTexto.style.color = 'green'
        
    } else {
        notificacionTexto.style.color = 'tomato'
    } 

    setTimeout(() => {
        notificacionTexto.style.display = 'none'
        notificacionTexto.innerHTML = `<p></p>`
    },3000)
}