// src/hooks/useCenterTargets.js
import { useState, useEffect } from "react";
import axios from "axios";

export const useCenterTargets = (centerId) => {
  const [targets, setTargets] = useState({
    membershipTarget: 0,
    bacentaTarget: 0,
    attendanceTarget: 0,
  });

  useEffect(() => {
    if (!centerId) return;

    const getCurrentMonth = () => {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    };

    const fetchTargets = async () => {
      try {
        const { data } = await axios.get("https://church-management-system-39vg.onrender.com/api/targets");
        const centerTarget = data.find((t) => t.center === centerId);
        if (!centerTarget) return;

        const currentMonth = getCurrentMonth();
        const monthlyTarget = centerTarget.performanceData.find(
          (p) => p.month === currentMonth
        );

        setTargets({
          membershipTarget: monthlyTarget?.targetMembers || 0,
          bacentaTarget: monthlyTarget?.targetBacentas || 0,
          attendanceTarget: monthlyTarget?.targetChurchAttendance || 0,
        });
      } catch (err) {
        console.error("Error fetching center targets:", err);
      }
    };

    fetchTargets();
  }, [centerId]);

  return targets;
};
