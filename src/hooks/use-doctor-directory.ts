import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type DirectoryDoctor = Tables<"doctor_directory">;
export type DirectorySchedule = Tables<"doctor_schedule_directory">;

export type DoctorDirectoryState =
  | { status: "disabled"; doctors: []; schedules: [] }
  | { status: "loading"; doctors: []; schedules: [] }
  | { status: "error"; doctors: []; schedules: []; message: string }
  | { status: "ready"; doctors: DirectoryDoctor[]; schedules: DirectorySchedule[] };

const emptyDirectory = { doctors: [], schedules: [] } as const;

/** Reads only the clinic-scoped directory views; database permissions remain authoritative. */
export function useDoctorDirectory(enabled: boolean, refreshToken = 0): DoctorDirectoryState {
  const [directory, setDirectory] = useState<DoctorDirectoryState>({
    status: enabled ? "loading" : "disabled",
    ...emptyDirectory,
  });

  useEffect(() => {
    if (!enabled) {
      setDirectory({ status: "disabled", ...emptyDirectory });
      return;
    }

    let cancelled = false;
    setDirectory({ status: "loading", ...emptyDirectory });

    void (async () => {
      const [doctorResult, scheduleResult] = await Promise.all([
        supabase
          .from("doctor_directory")
          .select("id, clinic_id, full_name, specialization, availability_status, created_at"),
        supabase
          .from("doctor_schedule_directory")
          .select("id, clinic_id, doctor_id, day_of_week, start_time, end_time, is_available"),
      ]);

      if (cancelled) return;

      const error = doctorResult.error ?? scheduleResult.error;
      if (error) {
        setDirectory({
          status: "error",
          ...emptyDirectory,
          message: error.code === "42501"
            ? "Your patient account cannot access the clinic directory yet."
            : "The clinic directory couldn’t be loaded right now.",
        });
        return;
      }

      const doctors = [...(doctorResult.data ?? [])].sort((a, b) =>
        (a.full_name ?? "").localeCompare(b.full_name ?? ""),
      );
      const schedules = [...(scheduleResult.data ?? [])].sort((a, b) =>
        `${a.day_of_week ?? ""} ${a.start_time ?? ""}`.localeCompare(`${b.day_of_week ?? ""} ${b.start_time ?? ""}`),
      );

      setDirectory({ status: "ready", doctors, schedules });
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled, refreshToken]);

  return directory;
}