import { NextResponse } from 'next/server';
import Groq from "groq-sdk";
import { tavily } from "@tavily/core";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) return NextResponse.json({ resumen: "URL requerida" }, { status: 400 });

    // PASO 1: Búsqueda simultánea con filtro temporal estricto
    // Nota: Bajamos el 'days' de la primera búsqueda a 1 para evitar basura de 2023
    const [busquedaGeneral, busquedaOposicion] = await Promise.all([
      tvly.search(`noticia de hoy: ${url}`, {
        searchDepth: "advanced",
        includeRawContent: "text",
        maxResults: 3,
        days: 25, 
        includeDomains: ["lanacion.com.ar", "clarin.com", "infobae.com", "perfil.com"]
      }),
      tvly.search(`visión crítica o de izquierda hoy sobre: ${url}`, {
        searchDepth: "advanced",
        includeRawContent: "text",
        maxResults: 3,
        days: 1,
        includeDomains: ["pagina12.com.ar", "izquierdadiario.es", "eldestapeweb.com"]
      })
    ]);

    const todosLosResultados = [...busquedaGeneral.results, ...busquedaOposicion.results];

    // Formateamos el contexto para la IA
    const contextoDeMedios = todosLosResultados.length > 0 
      ? todosLosResultados.map((r, i) => {
          const dominio = new URL(r.url).hostname.replace('www.', '');
          return `--- FUENTE ${i + 1} [${dominio}]: ---\n${r.rawContent?.substring(0, 1500)}`;
        }).join("\n\n")
      : "No se encontraron fuentes externas. Analizá solo la información de la URL proporcionada.";

    // PASO 2: Análisis con Groq (Prompt de Auditoría de Medios)
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Hoy es 10 de abril de 2026. Sos un analista político senior experto en "framing" y discurso mediático. 
          Tu misión es desarmar la noticia y mostrar cómo cada medio argentino construye su relato. 
          Ignorá cualquier información vieja de 2023 o elecciones pasadas.`
        },
        {
          role: "user",
          content: `Analizá la cobertura mediática para esta URL: ${url}
          
          DATOS REALES EXTRAÍDOS:
          ${contextoDeMedios}

          Generá un informe en Markdown con esta estructura EXACTA:

          ### 1. **Los Hechos (Consenso)**
          Un resumen de lo que todos los medios (desde LN hasta El Destape) confirman como real sobre el tema de hoy.

          ### 2. **Guerra de Relatos (El Contraste)**
          - **Enfoque de Medios Tradicionales (Clarín/La Nación/Infobae)**: ¿Cómo titulan? ¿Qué palabras usan para suavizar o resaltar? (Ej: "Paciencia", "Mejora", "Gestión").
          - **Enfoque de Medios Críticos (Página/12/El Destape/Izquierda Diario)**: ¿Qué términos usan para cuestionar? (Ej: "Ajuste", "Recesión", "Impacto social").
          - Compará los "frames": quién lo presenta como esperanza y quién como crisis.

          ### 3. **Puntos de Fricción y Omisiones**
          Mencioná qué dato resalta un medio que el otro oculta deliberadamente. Si no encontrás una visión de un bando en los textos, mencioná qué "probablemente" dirían basado en su línea editorial histórica.

          ### 4. **Veredicto de Neutralidad**
          Tu conclusión técnica sobre la realidad de los hechos, quitando los adjetivos y el ruido político de ambos lados.

          IMPORTANTE: Basate en los textos de abril de 2026 proporcionados.`
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.4, // Balance perfecto entre precisión y capacidad de análisis
    });

    return NextResponse.json({ 
      resumen: chatCompletion.choices[0]?.message?.content,
      fuentes: todosLosResultados.map(r => ({
        titulo: r.title,
        url: r.url,
        dominio: new URL(r.url).hostname.replace('www.', '')
      }))
    });

  } catch (error) {
    console.error("Error:", error.message);
    return NextResponse.json({ resumen: "Error en el análisis." }, { status: 500 });
  }
}