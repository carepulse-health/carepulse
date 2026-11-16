BEGIN;

REVOKE SELECT ON TABLE public.doctors FROM authenticated;
GRANT SELECT (id, clinic_id, full_name, specialization, availability_status, created_at)
  ON TABLE public.doctors TO authenticated;

CREATE OR REPLACE FUNCTION public.guard_patient_updates()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, pg_temp
AS $$
DECLARE
  v_caller_id uuid;
  v_is_staff boolean;
BEGIN
  v_caller_id := auth.uid();

  SELECT EXISTS (
    SELECT 1 FROM public.clinic_members cm
    WHERE cm.clinic_id = OLD.clinic_id
      AND cm.user_id = v_caller_id
  ) INTO v_is_staff;

  IF v_is_staff THEN
    NEW.updated_at := pg_catalog.now();
    RETURN NEW;
  END IF;

  IF NEW.id IS DISTINCT FROM OLD.id THEN
    RAISE EXCEPTION 'Cannot modify patient ID' USING ERRCODE = '42501';
  END IF;

  IF NEW.clinic_id IS DISTINCT FROM OLD.clinic_id THEN
    RAISE EXCEPTION 'Cannot modify clinic affiliation' USING ERRCODE = '42501';
  END IF;

  IF NEW.created_at IS DISTINCT FROM OLD.created_at THEN
    RAISE EXCEPTION 'Cannot modify record creation date' USING ERRCODE = '42501';
  END IF;

  IF NEW.email IS DISTINCT FROM OLD.email THEN
    RAISE EXCEPTION 'Patients cannot modify email address' USING ERRCODE = '42501';
  END IF;

  IF NEW.auth_user_id IS DISTINCT FROM OLD.auth_user_id THEN
    IF NOT (
      OLD.auth_user_id IS NULL
      AND NEW.auth_user_id = v_caller_id
      AND pg_catalog.current_setting('carepulse.linking_in_progress', true) = 'true'
    ) THEN
      RAISE EXCEPTION 'auth_user_id can only be linked via secure verification' USING ERRCODE = '42501';
    END IF;
  END IF;

  NEW.updated_at := pg_catalog.now();

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_patient_updates ON public.patients;
CREATE TRIGGER trg_guard_patient_updates
  BEFORE UPDATE ON public.patients
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_patient_updates();

CREATE OR REPLACE FUNCTION public.link_patient_account()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, pg_temp
AS $$
DECLARE
  v_user_id uuid;
  v_user_email text;
  v_email_confirmed_at timestamptz;
  v_target_patient_id uuid;
  v_candidate_count int;
  v_rows_updated int;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'NOT_AUTHENTICATED' USING ERRCODE = '42501';
  END IF;

  PERFORM pg_catalog.pg_advisory_xact_lock(hashtext('link_patient:' || v_user_id::text));

  SELECT email, email_confirmed_at
  INTO v_user_email, v_email_confirmed_at
  FROM auth.users
  WHERE id = v_user_id;

  IF v_user_email IS NULL OR v_email_confirmed_at IS NULL THEN
    RAISE EXCEPTION 'EMAIL_NOT_VERIFIED' USING ERRCODE = '42501';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.patients
    WHERE auth_user_id = v_user_id
  ) THEN
    RAISE EXCEPTION 'ALREADY_LINKED' USING ERRCODE = '40002';
  END IF;

  SELECT
    COUNT(*),
    (ARRAY_AGG(candidates.id))[1]
  INTO v_candidate_count, v_target_patient_id
  FROM (
    SELECT id
    FROM public.patients
    WHERE auth_user_id IS NULL
      AND LOWER(email) = LOWER(v_user_email)
    FOR UPDATE
  ) AS candidates;

  IF v_candidate_count = 0 THEN
    RAISE EXCEPTION 'NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;

  IF v_candidate_count > 1 THEN
    RAISE EXCEPTION 'MULTIPLE_MATCHES' USING ERRCODE = '40003';
  END IF;

  PERFORM pg_catalog.set_config('carepulse.linking_in_progress', 'true', true);

  UPDATE public.patients
  SET auth_user_id = v_user_id,
      updated_at = pg_catalog.now()
  WHERE id = v_target_patient_id
    AND auth_user_id IS NULL;

  GET DIAGNOSTICS v_rows_updated = ROW_COUNT;
  IF v_rows_updated != 1 THEN
    RAISE EXCEPTION 'LINK_CONFLICT' USING ERRCODE = '40001';
  END IF;

  RETURN pg_catalog.jsonb_build_object(
    'success', true,
    'patient_id', v_target_patient_id
  );
END;
$$;

REVOKE ALL ON FUNCTION public.link_patient_account() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.link_patient_account() TO authenticated;

CREATE OR REPLACE VIEW public.staff_doctor_directory
WITH (security_barrier = true)
AS
SELECT
  d.id,
  d.clinic_id,
  d.user_id,
  d.full_name,
  d.specialization,
  d.phone,
  d.email,
  d.availability_status,
  d.created_at
FROM public.doctors d
WHERE EXISTS (
  SELECT 1 FROM public.clinic_members cm
  WHERE cm.clinic_id = d.clinic_id
    AND cm.user_id = auth.uid()
);

REVOKE ALL ON public.staff_doctor_directory FROM PUBLIC, anon;
GRANT SELECT ON public.staff_doctor_directory TO authenticated;

CREATE OR REPLACE VIEW public.doctor_directory
WITH (security_barrier = true)
AS
SELECT
  d.id,
  d.clinic_id,
  d.full_name,
  d.specialization,
  d.availability_status,
  d.created_at
FROM public.doctors d
WHERE d.clinic_id IN (
  SELECT p.clinic_id FROM public.patients p WHERE p.auth_user_id = auth.uid()
  UNION
  SELECT cm.clinic_id FROM public.clinic_members cm WHERE cm.user_id = auth.uid()
);

REVOKE ALL ON public.doctor_directory FROM PUBLIC, anon;
GRANT SELECT ON public.doctor_directory TO authenticated;

CREATE OR REPLACE VIEW public.doctor_schedule_directory
WITH (security_barrier = true)
AS
SELECT
  s.id,
  s.clinic_id,
  s.doctor_id,
  s.day_of_week,
  s.start_time,
  s.end_time,
  s.is_available
FROM public.doctor_schedules s
JOIN public.doctors d
  ON d.id = s.doctor_id
 AND d.clinic_id = s.clinic_id
WHERE s.is_available = true
  AND d.clinic_id IN (
    SELECT p.clinic_id FROM public.patients p WHERE p.auth_user_id = auth.uid()
    UNION
    SELECT cm.clinic_id FROM public.clinic_members cm WHERE cm.user_id = auth.uid()
  );

REVOKE ALL ON public.doctor_schedule_directory FROM PUBLIC, anon;
GRANT SELECT ON public.doctor_schedule_directory TO authenticated;

COMMIT;