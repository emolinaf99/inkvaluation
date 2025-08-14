
export function inputFromPasswordToText(eye) {
    if(eye.classList.contains('fa-eye-slash')) {
        let inputToText = eye.parentNode.querySelector('input')
        inputToText.type = 'text'
        eye.classList.remove('fa-eye-slash')
        eye.classList.add('fa-eye')
    } else {
        let inputToPassword = eye.parentNode.querySelector('input')
        inputToPassword.type = 'password'
        eye.classList.add('fa-eye-slash')
        eye.classList.remove('fa-eye')
    }
}