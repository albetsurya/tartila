import { useAuth } from "@/contexts/AuthContext";
import { classroomRoleFor, type ClassroomRole } from "@/lib/roles";

export interface ClassroomAccess {
  classroomRole: ClassroomRole | null;
  isTeacher: boolean;
  isReadOnly: boolean;
}

export function useClassroomAccess(): ClassroomAccess {
  const { user } = useAuth();
  const classroomRole = classroomRoleFor(user?.role);
  return {
    classroomRole,
    isTeacher: classroomRole === "ustadz",
    isReadOnly: classroomRole === "monitor",
  };
}
