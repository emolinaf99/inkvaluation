export function mostrarFileEnImgPreview(event,contenedorImg) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            contenedorImg.src = e.target.result;
        }
        
        reader.readAsDataURL(file);
    }
}