# Guía Paso a Paso: Publicar JMV en Netlify con Supabase

Esta guía está diseñada para que cualquier persona, **incluso sin experiencia técnica previa**, pueda publicar y poner en marcha la aplicación web (PWA) de **Juventud Mariana Vicenciana (JMV)** de forma **100% gratuita**.

---

## 📌 Resumen de lo que vamos a hacer

1. **Subir el código a GitHub** (tu repositorio privado o público).
2. **Crear tu base de datos gratuita en Supabase** y ejecutar el script SQL con un solo click.
3. **Publicar la web en Netlify** conectándola con GitHub y configurando las variables de entorno.
4. **Instalar la app en tu celular** como PWA.

---

## PASO 1: Subir el código a GitHub

1. Ingresa a [github.com](https://github.com) e inicia sesión (o crea una cuenta gratuita si no tienes una).
2. Haz click en el botón verde **"New"** (Nuevo repositorio).
3. Escribe un nombre para el repositorio, por ejemplo: `jmv-comunidad`.
4. Elige si quieres que sea **Público** o **Privado** y haz click en **"Create repository"**.
5. Sube los archivos del proyecto a este repositorio (mediante Git o subiendo la carpeta descargada).

---

## PASO 2: Crear la Base de Datos Gratuita en Supabase

Supabase te proporciona una base de datos PostgreSQL en la nube sin costo alguno.

1. Ingresa a [supabase.com](https://supabase.com) y haz click en **"Start your project"**.
2. Inicia sesión con tu cuenta de GitHub (es lo más rápido).
3. Haz click en **"New Project"** (Nuevo Proyecto):
   - **Name**: `JMV Grupo Juvenil` (o el nombre de tu parroquia).
   - **Database Password**: Escribe una contraseña segura y guárdala.
   - **Region**: Selecciona la región geográfica más cercana (por ejemplo: *South America - São Paulo* o *East US*).
   - Haz click en **"Create new project"** (tardará unos 60 segundos en aprovisionarse).
4. **Ejecutar el Script SQL**:
   - En el menú lateral izquierdo de Supabase, haz click en el icono de **"SQL Editor"** (parece un terminal con el símbolo `>_`).
   - Haz click en **"+ New query"** (Nueva consulta).
   - Abre el archivo `supabase/schema.sql` de este proyecto (o cópialo directamente desde el botón **"Copiar Script SQL"** dentro del botón "Supabase" en la app).
   - Pega todo el código SQL en el editor y presiona el botón verde **"RUN"** abajo a la derecha.
   - Verás el mensaje *"Success. No rows returned"*. ¡Listo! Ya están creadas todas las tablas, relaciones, permisos de seguridad (RLS) y tiempo real para el chat.
5. **Copiar las llaves de conexión**:
   - En el menú izquierdo, haz click en el engranaje **"Project Settings"** abajo del todo.
   - Ve a la sección **"API"**.
   - Copia estos dos valores:
     1. **Project URL** (ejemplo: `https://abcdefghijklm.supabase.co`)
     2. **Project API Keys** -> la clave marcada como `anon` `public` (empieza por `eyJhbG...`).

---

## PASO 3: Publicar en Netlify

Netlify se encargará de compilar tu aplicación React y ofrecerla con conexión segura HTTPS y certificado SSL gratuito.

1. Ingresa a [netlify.com](https://netlify.com) y crea tu cuenta gratuita (recomendado: "Sign up with GitHub").
2. En el panel principal, haz click en **"Add new site"** > **"Import an existing project"**.
3. Selecciona **"GitHub"** y autoriza a Netlify para ver tus repositorios.
4. Elige tu repositorio `jmv-comunidad`.
5. **Configuración de compilación**:
   - Netlify leerá automáticamente el archivo `netlify.toml` que ya hemos incluido en el proyecto:
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`
6. **Agregar las Variables de Entorno de Supabase**:
   - En esa misma pantalla (o más adelante en *Site configuration > Environment variables*), despliega la sección **"Environment variables"**.
   - Agrega dos variables:
     - Nombre: `VITE_SUPABASE_URL` | Valor: *(Pega tu Project URL de Supabase)*
     - Nombre: `VITE_SUPABASE_ANON_KEY` | Valor: *(Pega tu clave anon public de Supabase)*
7. Haz click en el botón azul **"Deploy JMV"**.
8. ¡En menos de 2 minutos tu sitio estará en línea con una dirección tipo `https://tu-sitio.netlify.app`! Puedes personalizar este subdominio gratis en *Site settings > Change site name*.

> **Nota sobre el enrutamiento:** El archivo `netlify.toml` y `public/_redirects` ya incluyen la regla `/* /index.html 200` para que al recargar la página en cualquier módulo no aparezca error 404.

---

## PASO 4: Cómo instalar la PWA en el celular

Una vez que abras tu enlace de Netlify desde el celular:

### En Android (Google Chrome):
1. Verás el botón amarillo **"Instalar App"** en la parte superior.
2. O toca los 3 puntos (⋮) arriba a la derecha en Chrome y selecciona **"Instalar aplicación"** o **"Agregar a la pantalla principal"**.
3. Se creará el ícono oficial con la Medalla Milagrosa y abrirá como una aplicación nativa a pantalla completa.

### En iPhone (Safari):
1. Abre tu enlace en **Safari**.
2. Toca el botón de **Compartir** (el cuadro con una flecha hacia arriba en la barra inferior).
3. Desliza hacia abajo y selecciona **"Agregar al inicio"** (Add to Home Screen).
4. Toca **"Agregar"**. ¡Listo!

---

## 💡 Preguntas Frecuentes

- **¿Qué pasa si no tengo Supabase todavía?**
  La aplicación funciona perfectamente en modo offline y local con datos precargados reales gracias al motor `StorageService` en `localStorage`. Puedes usarla y probarla de inmediato.
- **¿Cuál es el código de invitación por defecto?**
  El código inicial es **`JMV2026`**. Como coordinador, puedes cambiarlo en cualquier momento desde el **Panel del Administrador**.
