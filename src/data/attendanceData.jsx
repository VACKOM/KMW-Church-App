import { useState, useEffect } from "react";
import axios from "axios";
import { tokens } from "../theme";

export const useAdminLineData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("https://church-management-system-39vg.onrender.com/api/attendances/");
      const attendances = res.data;

      const monthly = attendances.reduce((acc, r) => {
        if (!r.date || r.adultAttendance == null) return acc;
        const month = new Date(r.date).toLocaleString("default", { month: "short" });
        acc[month] = (acc[month] || 0) + r.adultAttendance;
        return acc;
      }, {});

      const orderedMonths = [
        "Jan","Feb","Mar","Apr","May","Jun",
        "Jul","Aug","Sep","Oct","Nov","Dec"
      ];

      const tokensObj = tokens("dark");

      const lineData = [
        {
          id: "Gbawe",
          color: tokensObj.redAccent[200],
          data: orderedMonths.map(m => ({ x: m, y: monthly[m] || 0 })),
        },
      ];

      setData(lineData);
      setLoading(false);
    };

    fetchData();
  }, []);

  return { data, loading };
};
