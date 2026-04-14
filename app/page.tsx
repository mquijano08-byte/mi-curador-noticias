'use client'; 
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

// Definimos la estructura de la fuente para que TypeScript sea feliz
interface Fuente {
  titulo: string;
  url: string;
  dominio: string;
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [resultado, setResultado] = useState('');
  const [fuentes, setFuentes] = useState<Fuente[]>([]); // Estado tipado correctamente
  const [cargando, setCargando] = useState(false);

  const analizarNoticia = async () => {
    if (!url) return alert("Pegá un link");
    setCargando(true); 
    setResultado(''); 
    setFuentes([]);
    
    try {
      const respuesta = await fetch('/api/analizar', {
        method: 'POST',
        body: JSON.stringify({ url: url }),
        headers: { 'Content-Type': 'application/json' }
      });

      const datos = await respuesta.json();
      setResultado(datos.resumen);
      setFuentes(datos.fuentes || []); 
    } catch (error) {
      alert("Error al conectar con la IA");
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-10 bg-black text-white">
      <h1 className="text-4xl font-extrabold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        Curador de Noticias con IA
      </h1>
      
      <div className="w-full max-w-3xl">
        <input 
          type="text" 
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Pega aquí el link de la noticia..."
          className="w-full p-4 border border-gray-700 rounded-lg bg-gray-900 text-white focus:ring-2 focus:ring-blue-500 outline-none"
        />
        
        <button 
          onClick={analizarNoticia} 
          disabled={cargando}
          className={`mt-4 w-full p-4 rounded-lg font-bold transition-all ${
            cargando ? 'bg-gray-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg'
          }`}
        >
          {cargando ? 'Contrastando medios argentinos...' : 'Analizar noticia'}
        </button>

        {resultado && (
          <div className="mt-8 p-8 bg-gray-900 border border-blue-500/30 rounded-2xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-blue-400 border-b border-blue-500/20 pb-2">
              Informe de Análisis Multi-Perspectiva
            </h2>
            
            {/* Informe de la IA formateado con Markdown */}
            <div className="prose prose-invert prose-blue max-w-none text-gray-300 mb-10">
              <ReactMarkdown>{resultado}</ReactMarkdown>
            </div>

            {/* SECCIÓN DE LINKS (FUENTES REALES) */}
            {fuentes.length > 0 && (
              <div className="border-t border-gray-700 pt-6">
                <h3 className="text-lg font-bold text-blue-400 mb-4">Fuentes reales contrastadas:</h3>
                <ul className="space-y-3">
                  {fuentes.map((f: Fuente, i: number) => (
                    <li key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
                      <span className="px-2 py-1 bg-gray-800 rounded text-[10px] font-mono text-gray-400 uppercase w-fit">
                        {f.dominio}
                      </span>
                      <a 
                        href={f.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 hover:underline truncate transition-all"
                      >
                        {f.titulo || "Ver noticia relacionada"}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}