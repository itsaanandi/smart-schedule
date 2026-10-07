/**
 * Resolves the division code (e.g. "SE1") that belongs to the signed-in user.
 *
 * The login response (User.toSafeObject) and therefore AuthContext only carry
 * the raw ids: `division` for students and `teacher` for teachers. The
 * timetable API groups its data by division code, so GET /api/divisions is used
 * to translate those ids into a code.
 */

const idOf = (value) => {
  if (!value) return null;
  return String(value._id || value);
};

export function resolveUserDivisionCode(user, divisions) {
  if (!user || !Array.isArray(divisions) || !divisions.length) return null;

  // Student: the division linked to their account
  if (user.division) {
    const own = divisions.find((division) => idOf(division._id) === idOf(user.division));
    if (own) return own.code;
  }

  // Teacher: the division they are class teacher of
  if (user.teacher) {
    const classTaught = divisions.find(
      (division) => division.classTeacher && idOf(division.classTeacher) === idOf(user.teacher)
    );
    if (classTaught) return classTaught.code;
  }

  return null;
}

export default resolveUserDivisionCode;
