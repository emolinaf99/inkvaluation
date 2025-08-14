export function checkOptAssistant(btn) {
    let circulo = btn.querySelector('.circleMove')
    let inputCheck = btn.querySelector('.inputCheck')

    btn.classList.toggle('BGGreen')
    circulo.classList.toggle('moveRight')

    if(circulo.classList.contains('moveRight')) {
        inputCheck.setAttribute('checked','')
    } else {
        inputCheck.removeAttribute('checked')
    }
}