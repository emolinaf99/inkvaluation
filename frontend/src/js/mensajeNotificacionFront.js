
export function mostrarNotificacion(mensaje, color) {
    // mensaje es el mensaje que aparecera
    // color es si es verde (1) o si es rojo (0)

    // Remover notificaciones existentes
    const existingNotification = document.querySelector('.notification-toast');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Crear nueva notificación
    const notificacion = document.createElement('div');
    notificacion.className = 'notification-toast';
    
    // Determinar estilo basado en tipo
    const isSuccess = color == 1;
    const backgroundColor = isSuccess ? '#059669' : '#dc2626';
    const icon = isSuccess ? '✓' : '✕';
    
    notificacion.innerHTML = `
        <div class="notification-icon">${icon}</div>
        <div class="notification-message">${mensaje}</div>
        <div class="notification-close" onclick="this.parentElement.remove()">&times;</div>
    `;
    
    notificacion.style.cssText = `
        position: fixed;
        top: 24px;
        right: 24px;
        background: ${backgroundColor};
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        font-size: 14px;
        font-family: system-ui, -apple-system, sans-serif;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 300px;
        max-width: 400px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        backdrop-filter: blur(10px);
    `;

    // Estilos para elementos internos
    const style = document.createElement('style');
    style.textContent = `
        .notification-icon {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 12px;
            flex-shrink: 0;
        }
        
        .notification-message {
            flex: 1;
            line-height: 1.4;
        }
        
        .notification-close {
            cursor: pointer;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: bold;
            transition: background 0.2s ease;
            flex-shrink: 0;
        }
        
        .notification-close:hover {
            background: rgba(255, 255, 255, 0.3);
        }
        
        @media (max-width: 640px) {
            .notification-toast {
                top: 120px !important;
                left: 16px !important;
                right: 16px !important;
                min-width: auto !important;
                max-width: none !important;
                transform: translateY(-100%) !important;
                position: fixed !important;
                z-index: 99999 !important;
            }
        }
    `;
    
    if (!document.querySelector('style[data-notification-styles]')) {
        style.setAttribute('data-notification-styles', 'true');
        document.head.appendChild(style);
    }
    
    // Aplicar posición responsive
    const applyResponsiveStyles = () => {
        if (window.innerWidth <= 640) {
            notificacion.style.top = '120px';
            notificacion.style.left = '16px';
            notificacion.style.right = '16px';
            notificacion.style.minWidth = 'auto';
            notificacion.style.maxWidth = 'none';
            notificacion.style.transform = 'translateY(-100%)';
            notificacion.style.position = 'fixed';
            notificacion.style.zIndex = '99999';
        } else {
            notificacion.style.top = '24px';
            notificacion.style.right = '24px';
            notificacion.style.left = 'auto';
            notificacion.style.transform = 'translateX(100%)';
            notificacion.style.position = 'fixed';
            notificacion.style.zIndex = '10000';
        }
    };
    
    applyResponsiveStyles();
    document.body.appendChild(notificacion);
    
    // Animación de entrada
    requestAnimationFrame(() => {
        notificacion.style.opacity = '1';
        notificacion.style.transform = window.innerWidth <= 640 ? 'translateY(0)' : 'translateX(0)';
    });
    
    // Auto-close después de 4 segundos
    setTimeout(() => {
        if (notificacion.parentNode) {
            notificacion.style.opacity = '0';
            notificacion.style.transform = window.innerWidth <= 640 ? 'translateY(-100%)' : 'translateX(100%)';
            
            setTimeout(() => {
                if (notificacion.parentNode) {
                    notificacion.remove();
                }
            }, 300);
        }
    }, 4000);
    
    // Responsive resize handler
    const resizeHandler = () => applyResponsiveStyles();
    window.addEventListener('resize', resizeHandler);
    
    // Cleanup resize listener when notification is removed
    const originalRemove = notificacion.remove;
    notificacion.remove = function() {
        window.removeEventListener('resize', resizeHandler);
        originalRemove.call(this);
    };
}