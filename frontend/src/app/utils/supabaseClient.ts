import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Sube una evidencia al bucket 'evidencias' y retorna la URL pública.
 * @param file El archivo a subir.
 * @returns La URL pública del archivo.
 */
export const uploadEvidencia = async (file: File): Promise<string> => {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase no está configurado. Faltan VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `movimientos/${fileName}`;

  const { data, error } = await supabase.storage
    .from('evidencias')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Error subiendo evidencia:', error);
    throw new Error('Error al subir el archivo: ' + error.message);
  }

  const { data: publicUrlData } = supabase.storage
    .from('evidencias')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
};
