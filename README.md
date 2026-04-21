# 📰 Curador de Noticias IA - Analizador de Sesgos Mediáticos

Un analista político digital diseñado para auditar la "grieta" mediática en tiempo real. Utiliza **IA (Llama 3.3)** y el motor de búsqueda **Tavily** para contrastar cómo diferentes medios cubren una misma noticia, exponiendo omisiones y sesgos editoriales.

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4.0-blue?style=for-the-badge&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)

---

## 🚀 Funcionalidades Principales

- **Búsqueda Multi-Vía:** Ejecuta búsquedas paralelas para capturar visiones de medios con diferentes líneas editoriales.
- **Análisis de Framing:** Identifica el uso de adjetivos y encuadres según el medio analizado.
- **Detección de Omisiones:** Expone datos clave que un bando menciona y el otro decide ocultar.
- **Veredicto Neutral:** Genera una conclusión objetiva basada estrictamente en los puntos de consenso.
- **Fuentes Verificables:** Incluye enlaces directos a las noticias reales analizadas por la IA.

## 🛠️ Stack Tecnológico

### Frontend & Framework
- **Next.js 16 (App Router):** Última versión para un rendimiento óptimo.
- **Tailwind CSS 4:** Estilizado moderno con la configuración `@import "tailwindcss"`.
- **React Markdown:** Para visualizar los informes de la IA con formato profesional.

### Inteligencia Artificial (Agentes)
- **Groq SDK:** Motor principal utilizando el modelo **Llama 3.3 70B Versatile**.
- **Tavily AI Core:** Búsqueda web optimizada para agentes de IA (evita el "ruido" de anuncios).
- **SDKs Integrados:** Preparado para expansión con **Anthropic (Claude)**, **Gemini** y **OpenAI**.

---

## 📦 Instalación y Configuración local

Sigue estos pasos para clonar y ejecutar el curador en tu máquina:

1. **Clonar el repositorio:**
    Bash
   git clone [https://github.com/TU_USUARIO/mi-curador-noticias.git](https://github.com/TU_USUARIO/mi-curador-noticias.git)
   cd mi-curador-noticias

## 📦 Instalación y Configuración
Sigue estos pasos para ejecutar el proyecto en tu entorno local:

Clonar el repositorio:

    Bash
git clone https://github.com/TU_USUARIO/mi-curador-noticias.git
cd mi-curador-noticias
**Instalar dependencias: Usamos el archivo package-lock.json para garantizar que las versiones sean exactas.**

    Bash
npm install
**Configurar variables de entorno: Crea un archivo llamado .env.local en la raíz del proyecto y agrega tus credenciales:**

Fragmento de código
GROQ_API_KEY=tu_clave_aqui
TAVILY_API_KEY=tu_clave_aqui
Correr en modo desarrollo:

    Bash
npm run dev
Luego, abre http://localhost:3000 en tu navegador.
 ## ⚠️ Solución de Problemas
Error de Iconos: Si la consola muestra que faltan componentes como Search o Globe, instala Lucide ejecutando:

npm install lucide-react

Estilos de Tailwind: Este proyecto usa Tailwind v4. Asegúrate de que tu archivo globals.css contenga únicamente la nueva directiva:

@import "tailwindcss";

Falla en el Análisis: Si la IA no responde, verifica que tus API Keys de Groq o Tavily tengan créditos disponibles y estén bien escritas en el .env.local.

## 📄 Licencia
Este es un proyecto de código abierto con fines educativos y de auditoría periodística. ¡Sentite libre de hacer un fork y mejorarlo!


