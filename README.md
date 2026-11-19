# JMV - Juventud Mariana Vicenciana

Aplicación web progresiva (**PWA**), mobile-first, en español, diseñada especialmente para la vida comunitaria, retos semanales, ahorro de cuotas y fraternidad del grupo juvenil católico **JMV (Juventud Mariana Vicenciana)**.

---

## 🚀 Inicio Rápido en Desarrollo Local

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Compilar para producción
npm run build
```

---

## 👥 Cómo Agregar Integrantes y Roles

1. **Código de Invitación:**
   - Para que solo los miembros aprobados de tu grupo accedan, el registro requiere un código de invitación.
   - El código por defecto es: **`JMV2026`** (el coordinador puede cambiarlo en el *Panel del Administrador*).
2. **Registro de un Integrante:**
   - Toca el avatar de usuario arriba a la derecha y presiona **"+ Registrar nuevo integrante"**.
   - Ingresa:
     - Código de invitación (`JMV2026`).
     - Nombre y apellido.
     - Foto de perfil (se comprime automáticamente en el navegador).
     - Fecha de cumpleaños y teléfono opcional.
     - Si es menor de 18 años, solicita el nombre y teléfono del padre, madre o apoderado.
     - Consentimiento informado de uso interno pastoral de imágenes.
3. **Cambiar entre Coordinador (Admin) e Integrante:**
   - Arriba a la derecha, haz click en el avatar para abrir el selector rápido.
   - Puedes seleccionar a **Andrés Morales (Admin/Coordinador)** para gestionar aprobaciones y cuotas, o a cualquier integrante como **Sofía Martínez** para probar la experiencia juvenil.

---

## 📱 Guía de Uso de los Módulos

### 1. Inicio (Dashboard)
- **Saludo y Frase del Día:** Saludo con el nombre del integrante y frase motivacional vicenciana con botón para rotar.
- **Cuenta Regresiva en Vivo:** Días, horas, minutos y segundos restantes para la próxima reunión del sábado.
- **Reto Activo:** Tarjeta destacada con puntos y botón para enviar evidencia.
- **Cumpleaños Próximos:** Alertas para los cumpleaños de los próximos 14 días.
- **Avisos Oficiales:** Anuncio fijado por el asesor o coordinador.

### 2. Retos Semanales y Recompensas
- **El Administrador:** Toca *"Crear Nuevo Reto"* (asigna título, puntos, fecha límite y recompensa visible).
- **Los Integrantes:** Tocan *"Marcar como Cumplido"* y pueden adjuntar un testimonio y una foto comprimida.
- **Aprobación:** El admin aprueba las entregas con un click, sumando puntos automáticamente al perfil del integrante y desbloqueando insignias (*Constancia*, *Servicio*, *Alegría*).
- **Ranking Amistoso:** Podio visual con medallas de oro, plata y bronce.

### 3. Cuota Semanal de 1 Dólar (Chompas y Camisetas)
- **Meta Grupal:** Barra de progreso porcentual del ahorro total acumulado para las chompas y camisetas oficiales.
- **Registro de Pagos:** Solo el admin/tesorero puede alternar las casillas de *"Semana 1"* a *"Semana 12"* tocando cada celda.
- **Historial Personal:** Cada integrante puede activar la pestaña *"Solo Mi Historial"* para ver exactamente cuánto ha pagado y cuánto le falta.
- **Exportación:** Botón verde *"Exportar Excel"* para descargar un archivo CSV limpio compatible con Excel o imprimir en PDF.

### 4. Chat Grupal en Tiempo Real
- **Mensajería:** Envío de texto, selector de emojis vicencianos y subida de fotos con compresión instantánea.
- **Mensajes Fijados:** El admin puede fijar avisos importantes que aparecen en la cabecera.
- **Reacciones:** Corazones, aplausos, guitarras y manos en oración en cada burbuja.
- **Reglas de Convivencia:** Botón visible con las normas de caridad, horarios y respeto mutuo.
- **Reporte:** Los integrantes pueden reportar mensajes inapropiados al coordinador.

### 5. Calendario de Actividades del Mes
- Visualización de reuniones semanales, retiros espirituales, jornadas de servicio y eventos.
- **Confirmación de Asistencia (RSVP):** Botones rápidos *"Voy"*, *"Tal vez"*, *"No voy"*.
- Lista visual de avatares con los asistentes confirmados.

### 6. Cumpleaños
- Listado organizado por meses con contador.
- **Tarjeta Automática:** Mensaje de bendición mariana generado con un click y botón *"Felicitar en el Chat"*.

### 7. Galería de Fotos
- Álbumes por actividad (*Retiros*, *Misiones*, *Encuentros*).
- Subida de fotos con compresión automática en el celular para funcionar con conexiones lentas.
- Reacciones con corazón y comentarios fraternos.

### 8. Muro de Experiencias de Servicio
- Testimonios y vivencias en comedores populares, visitas a enfermos y asilos.
- Reacciones de *"Caridad"*, *"Oración"* e *"Inspirador"*.

### 9. Amigo Secreto Semanal
- **Sorteo Inteligente:** El admin inicia la dinámica y el sistema realiza un sorteo circular aleatorio (nadie se saca a sí mismo y solo tú ves a quién le regalas).
- **Buzón Diario Anónimo:** 7 días de mensajes de oración, frases y aprecio según las sugerencias del día.
- **Revelación Final:** Animación con lluvia de confeti y develación de la identidad.

### 10. Muro de Oración
- Peticiones por enfermos y agradecimientos.
- Opción de publicar de forma anónima.
- Botón *"Me uno en oración"* con contador en vivo.

### 11. Asistencia y Constancia
- Registro por reunión (Presente / Justificado / Falta).
- Porcentajes calculados automáticamente por persona.
- Cuadro de honor para integrantes con $\ge 80\%$ de constancia.

### 12. Encuestas Rápidas
- Votaciones para definir colores de chompas, fechas y dinámicas con resultados porcentuales inmediatos.

### 13. Panel del Administrador
- Métricas consolidadas del grupo.
- Modificación del código de invitación oficial.
- Programador de recordatorios motivacionales antes de la reunión con prueba de notificación push.
- Acceso a la guía de publicación en Netlify y script SQL de Supabase.

---

## ☁️ Publicación en Netlify con Supabase

Consulta el archivo [`GUIA_NETLIFY_SUPABASE.md`](./GUIA_NETLIFY_SUPABASE.md) para el tutorial paso a paso ilustrado.
