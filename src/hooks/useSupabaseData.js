// src/hooks/useSupabaseData.js
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export const useSupabaseData = (tableName) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from(tableName).select('*');
      if (error) console.error(`Error fetching ${tableName}:`, error);
      else setData(data);
      setLoading(false);
    };

    fetchData();
  }, [tableName]);

  return { data, loading };
};
