# Guía de Diseño UX - InkValuation

> **Documentación oficial del sistema de diseño UX para la plataforma InkValuation**  
> *Última actualización: Agosto 2024*

---

## 🎨 Paleta de Colores

### Colores Primarios
```css
/* Azul Principal - Identidad de marca */
--primary-blue: #114B7A;

/* Amarillo Dorado - Acciones principales */
--primary-yellow: #F6CA75;

/* Verde - Estados de éxito/completado */
--primary-green: #90d387;

/* Gris Oscuro - Elementos secundarios */
--dark-gray: #5C5858;
```

### Colores de Fondo
```css
/* Fondo principal de la aplicación */
--background-main: #666666;

/* Fondo de contenido */
--background-content: #fbfbfb;

/* Fondo de tarjetas */
--background-card: #ffffff;
```

### Colores de Estado
```css
/* Error */
--error-color: #e74c3c;

/* Advertencia */
--warning-color: #f39c12;

/* Información */
--info-color: #039BE5;

/* Texto */
--text-primary: #333333;
--text-secondary: #666666;
--text-muted: #999999;
```

---

## ✨ Sistema de Animaciones UX

### Principios de Animación
- **Duración**: Entre 0.4s - 0.8s para una sensación natural
- **Easing**: `ease-out` para entradas, `ease-in-out` para transiciones
- **Timing**: Animaciones escalonadas con delays de 0.1s entre elementos
- **Accesibilidad**: Respeto total a `prefers-reduced-motion`

### Tipos de Animaciones Disponibles

#### 1. Animaciones de Entrada
```css
/* Fade In - Aparición suave */
.ux-fade-in { animation: fadeIn 0.6s ease-out forwards; }

/* Fade In Up - Desde abajo con fade */
.ux-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }

/* Slide In Left - Desde la izquierda */
.ux-slide-in-left { animation: slideInLeft 0.7s ease-out forwards; }

/* Slide In Right - Desde la derecha */
.ux-slide-in-right { animation: slideInRight 0.7s ease-out forwards; }

/* Scale In - Efecto de escala */
.ux-scale-in { animation: scaleIn 0.6s ease-out forwards; }
```

#### 2. Contenedores Estructurales
```css
/* Contenedor principal de página */
.ux-container { animation: fadeInUp 0.8s ease-out 0.2s forwards; }

/* Títulos principales */
.ux-header { animation: fadeInUp 0.6s ease-out 0.1s forwards; }

/* Contenido general */
.ux-content { animation: fadeInUp 0.7s ease-out 0.3s forwards; }

/* Tarjetas */
.ux-card { animation: scaleIn 0.6s ease-out forwards; }
```

#### 3. Elementos Específicos
```css
/* Botones */
.ux-button { 
  animation: fadeInUp 0.5s ease-out forwards;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

/* Campos de formulario */
.ux-form-field { animation: slideInLeft 0.6s ease-out forwards; }

/* Items de lista */
.ux-list-item { animation: fadeInUp 0.5s ease-out forwards; }

/* Filas de tabla */
.ux-table-row { animation: fadeInUp 0.4s ease-out forwards; }

/* Imágenes */
.ux-image { animation: fadeIn 0.8s ease-out forwards; }
```

#### 4. Efectos Hover
```css
/* Elevación suave */
.ux-hover-lift:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Escala sutil */
.ux-hover-scale:hover {
  transform: scale(1.02);
}

/* Botones con elevación */
.ux-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

#### 5. Timing Escalonado
```css
.ux-stagger-1 { animation-delay: 0.1s; }
.ux-stagger-2 { animation-delay: 0.2s; }
.ux-stagger-3 { animation-delay: 0.3s; }
.ux-stagger-4 { animation-delay: 0.4s; }
.ux-stagger-5 { animation-delay: 0.5s; }
.ux-stagger-6 { animation-delay: 0.6s; }
```

---

## 🔄 Sistema de Skeleton Loaders

### Principios de Skeleton Design
- **Animación suave**: Fade continuo de `#f0f0f0` a `#e5e5e5`
- **Duración**: 2 segundos de ciclo
- **Formas orgánicas**: Border-radius consistente
- **Timing de salida**: Fade-out de 0.3s

### Componentes Skeleton Disponibles

#### 1. Elementos Base
```css
/* Elemento skeleton base */
.skeleton {
  background-color: #f0f0f0;
  animation: skeletonFade 2s ease-in-out infinite;
  border-radius: 4px;
}

/* Texto */
.skeleton-text { height: 1rem; margin-bottom: 0.5rem; }
.skeleton-text-lg { height: 1.5rem; }
.skeleton-text-sm { height: 0.75rem; }

/* Avatar circular */
.skeleton-avatar { width: 3rem; height: 3rem; border-radius: 50%; }

/* Botones */
.skeleton-button { height: 2.5rem; border-radius: 10px; }

/* Inputs */
.skeleton-input { height: 2.5rem; border-radius: 10px; }
```

#### 2. Layouts Específicos

##### Account Skeleton
- **Diseño**: Grid de 2 columnas en desktop
- **Elementos**: Avatar, formularios, toggles
- **Responsive**: Mobile-first approach

##### Forms Skeleton
- **Diseño**: Grid de servicios con formularios
- **Elementos**: Cards, iconos centrados, listas
- **Características**: Iconos con `margin: 0 auto`

##### Business Skeleton
- **Diseño**: Bloques de gestión empresarial
- **Elementos**: Información de negocio, sedes, artistas

##### Requests Skeleton
- **Diseño**: Lista de solicitudes de cotización
- **Elementos**: Preview cards, estados, inputs de búsqueda

##### Chat Skeleton
- **Diseño**: Interfaz de chat completa
- **Elementos**: Header, mensajes, input de chat

### Responsive Breakpoints
```css
/* Tablet */
@media (min-width: 768px) {
  .skeleton-benefits { grid-template-columns: repeat(2, 1fr); }
  .skeleton-account { grid-template-columns: 300px 1fr; }
}

/* Desktop */
@media (min-width: 1280px) {
  .skeleton-benefits { grid-template-columns: repeat(3, 1fr); }
  .skeleton-config { grid-template-columns: repeat(3, 1fr); }
}
```

---

## 📱 Sistema Responsive

### Breakpoints Principales
```css
/* Mobile First */
@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1280px) { /* Desktop */ }
```

### Adaptaciones UX por Dispositivo

#### Mobile (< 768px)
- Animaciones más rápidas (0.4s)
- Stagger reducido
- Componentes stack vertical
- Touch-friendly interactions

#### Tablet (768px - 1279px)
- Grid de 2 columnas
- Animaciones normales
- Hover states habilitados

#### Desktop (1280px+)
- Grid de 3 columnas
- Animaciones completas
- Efectos hover avanzados
- Micro-interacciones

---

## 🎯 Patrones de Interacción

### Estados de Botones
```css
/* Estado normal */
.button {
  background-color: var(--primary-yellow);
  transition: all 0.2s ease;
}

/* Estado hover */
.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Estado activo */
.button:active {
  transform: translateY(0);
}

/* Estado disabled */
.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}
```

### Feedback Visual
- **Éxito**: Verde (#90d387) con icono de check
- **Error**: Rojo (#e74c3c) con shake animation
- **Carga**: Skeleton + fade transitions
- **Hover**: Elevación y sombras

---

## 🎪 Componentes Específicos

### Cards
```css
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}
```

### Forms
```css
.form-field {
  margin-bottom: 1rem;
}

.form-field label {
  color: var(--text-primary);
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.form-field input {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 0.75rem;
  transition: border-color 0.2s ease;
}

.form-field input:focus {
  border-color: var(--primary-blue);
  outline: none;
  box-shadow: 0 0 0 3px rgba(17, 75, 122, 0.1);
}
```

### Navegación
- **Header**: Fijo con backdrop-filter
- **Sidebar**: Slide animation desde la izquierda
- **Overlay**: Fade con backdrop opacity
- **Menu mobile**: Hamburger con transformaciones

---

## ♿ Accesibilidad

### Respeto a Preferencias del Usuario
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}

@media (prefers-color-scheme: dark) {
  /* Dark mode adaptations */
}
```

### Contraste y Legibilidad
- **Ratio mínimo**: 4.5:1 para texto normal
- **Ratio mínimo**: 3:1 para texto grande
- **Focus visible**: Siempre presente
- **Touch targets**: Mínimo 44px

---

## 🚀 Implementación

### Estructura de Archivos
```
src/assets/css/
├── main.css              # Importaciones y globales
├── animations.css        # Sistema completo de animaciones UX
├── components/
│   └── SkeletonLoader.css # Sistema de skeleton loaders
└── views/               # Estilos específicos por vista
```

### Uso en Componentes Vue
```vue
<template>
  <section class="sectionAccount ux-container">
    <h1 class="ux-header">Mi cuenta</h1>
    <div class="containerAccount ux-content">
      <div class="accountBlock ux-card ux-stagger-1">
        <button class="btnAccountBlock BGYellow ux-button ux-hover-lift">
          Actualizar
        </button>
      </div>
    </div>
  </section>
</template>
```

### Sistema de Skeleton
```vue
<template>
  <!-- Skeleton Loader -->
  <div v-if="isLoading" class="skeleton-container" :class="{ 'skeleton-fade-out': isFading }">
    <AccountSkeleton />
  </div>

  <!-- Contenido Real -->
  <section v-else class="sectionAccount ux-container">
    <!-- Contenido con animaciones UX -->
  </section>
</template>
```

---

## 📊 Performance

### Optimizaciones
- **will-change**: Solo en elementos que lo necesiten
- **transform3d**: Para activar aceleración de hardware
- **Reducción mobile**: Duraciones más cortas en móviles
- **Batch animations**: Agrupación de animaciones similares

### Métricas Objetivo
- **Tiempo de carga**: < 100ms para skeletons
- **Transición**: < 300ms para cambios de estado
- **60fps**: Mantenido en todas las animaciones
- **Accesibilidad**: 100% respeto a preferencias del usuario

---

## 🎨 Filosofía de Diseño

### Principios Fundamentales
1. **Elegancia Sutil**: Animaciones que mejoran sin distraer
2. **Consistencia**: Patrones repetibles en toda la aplicación
3. **Performance**: Optimización sin sacrificar experiencia
4. **Accesibilidad**: Inclusivo para todos los usuarios
5. **Responsive**: Experiencia fluida en todos los dispositivos

### Valores UX
- **Claridad**: Interfaces claras y entendibles
- **Eficiencia**: Flujos optimizados para tareas comunes
- **Satisfacción**: Interacciones placenteras y memorables
- **Confianza**: Feedback consistente y predecible

---

*Esta guía es un documento vivo que evoluciona con la plataforma InkValuation. Para contribuciones o actualizaciones, consulta con el equipo de desarrollo.*