import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type PatientAppointment = Tables<"appointments"> & { doctor: Pick<Tables<"doctors">, "full_name" | "specialization"> | null };

export type PatientRecordState =
  | { status: "signed-out" }
  | { status: "loading" }
  | { status: "unlinked" }
  | { status: "blocked"; message: string }
  | { status: "linked"; patient: Tables<"patients">; appointments: PatientAppointment[] };

/** Reads only rows the clinic's security rules allow for the signed-in patient (patients.auth_user_id = auth user). */
export function usePatientSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [record, setRecord] = useState<PatientRecordState>({ status: "signed-out" });

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    void supabase.auth.getSession().then(({ data: d }) => setSession(d.session));
    return () => data.subscription.unsubscribe();
  }, []);

  const userId = session?.user.id;
  useEffect(() => {
    if (!userId) {
      setRecord({ status: "signed-out" });
      return;
    }
    let cancelled = false;
    setRecord({ status: "loading" });
    void (async () => {
      const { data: patient, error } = await supabase.from("patients").select("*").eq("auth_user_id", userId).maybeSingle();
      if (cancelled) return;
      if (error) return setRecord({ status: "blocked", message: error.code === "42501" ? "The clinic hasn't granted signed-in patients access to their records yet." : "Your clinic record couldn't be loaded right now." });
      if (!patient) return setRecord({ status: "unlinked" });
      const { data: appts, error: apptError } = await supabase
        .from("appointments")
        .select("*, doctor:doctors(full_name, specialization)")
        .eq("patient_id", patient.id)
        .order("appointment_date", { ascending: false });
      if (cancelled) return;
      setRecord({ status: "linked", patient, appointments: apptError ? [] : ((appts ?? []) as PatientAppointment[]) });
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { session, record };
}
