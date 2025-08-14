import { ref } from 'vue';

export async function useApi(url, method = 'GET', body = null, contentType = 'application/json') {
  const data = ref(null); // Variable reactiva para almacenar los datos
  const error = ref(null); // Variable reactiva para almacenar el error
  const loading = ref(true); // Variable reactiva para indicar si la solicitud está en curso
  
  // Recuperar el token del localStorage o de donde lo guardes
  const token = localStorage.getItem('jwt');

  const fetchData = async () => {
    
    try {
      
      const headers = {};

      // Solo asigna Content-Type si el body no es FormData
      if (!(body instanceof FormData)) {
        headers['Content-Type'] = contentType;
      }

      // Si hay un token, incluir el encabezado Authorization
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const options = {
        method,
        headers,
        body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : null
      };

      const response = await fetch(url, options);

      if (!response.ok) {
        const errorObj = new Error(`HTTP error! status: ${response.status}`);
        errorObj.status = response.status; // ✅ guardar status
        errorObj.body = await response.json().catch(() => null); // ✅ intentar leer el mensaje
        throw errorObj;
      }

      const text = await response.text(); 
      data.value = text ? JSON.parse(text) : null; // Si el cuerpo está vacío, asigna null
      
    } catch (err) {
      // Ahora error.value será un objeto con .status y .message
      error.value = err.body; 
    } finally {
      loading.value = false; // Indica que la solicitud ha finalizado
    }
  };

  await fetchData(); // Llama a la función fetchData para ejecutar la solicitud

  return { data, error, loading }; // Devuelve las variables reactivas
}