import { useAuth } from "@/contexts/AuthContext";
import { classroomRoleForUser, type ClassroomRole } from "@/lib/roles";

export interface ClassroomAccess {
  classroomRole: ClassroomRole | null;
  isTeacher: boolean;
  isReadOnly: boolean;
}

export function useClassroomAccess(): ClassroomAccess {
  const { user } = useAuth();
  const classroomRole = classroomRoleForUser(user);
  return {
    classroomRole,
    isTeacher: classroomRole === "ustadz",
    isReadOnly: classroomRole === "monitor",
  };
}
