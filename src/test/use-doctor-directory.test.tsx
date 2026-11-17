import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const from = vi.fn();
const rpc = vi.fn();

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: (...args: unknown[]) => from(...args),
    rpc: (...args: unknown[]) => rpc(...args),
  },
}));

import { requestPatientAccountLink } from "@/hooks/use-patient-session";
import { useDoctorDirectory } from "@/hooks/use-doctor-directory";

describe("clinic doctor directory", () => {
  beforeEach(() => {
    from.mockReset();
    rpc.mockReset();
  });

  it("reads doctors and schedules only from the protected directory views", async () => {
    from.mockImplementation((view: string) => ({
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
      view,
    }));

    const { result } = renderHook(() => useDoctorDirectory(true));

    await waitFor(() => expect(result.current.status).toBe("ready"));
    expect(from.mock.calls.map(([view]) => view).sort()).toEqual([
      "doctor_directory",
      "doctor_schedule_directory",
    ]);
  });

  it("does not query clinic directory data when signed out", () => {
    const { result } = renderHook(() => useDoctorDirectory(false));

    expect(result.current.status).toBe("disabled");
    expect(from).not.toHaveBeenCalled();
  });

  it("requests account linking through the approved RPC", async () => {
    rpc.mockResolvedValue({ data: { success: true }, error: null });

    await act(async () => {
      await requestPatientAccountLink();
    });

    expect(rpc).toHaveBeenCalledExactlyOnceWith("link_patient_account");
  });
});