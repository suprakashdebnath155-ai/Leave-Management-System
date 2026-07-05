import { useCallback, useEffect, useState } from "react";
import api from "../services/api";

export default function useHolidays() {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get("/holidays");

      setHolidays(data.holidays || []);
    } catch (err) {
      console.error("Holiday Error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load holidays."
      );

      setHolidays([]);
    } finally {
      setLoading(false);
    }
  }, []);

  
  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    holidays,
    loading,
    error,
    refresh,
  };
}