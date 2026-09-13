import React, { useRef, useEffect, useCallback } from 'react';
import {
  DAYS_OF_WEEK,
  DayOfWeek,
  Division,
  Room,
  Subject,
  Teacher,
  TimetableEntry,
} from '../types/timetable';
import { STANDARD_PERIODS, LUNCH_PERIOD_INDEX } from '../data/mockData';
import { Clock, MapPin, User, Edit2, UserPlus, FlaskConical, Eye, Plus } from 'lucide-react';

interface Props {
  entries: TimetableEntry[];
  subjects: Subject[];
  teachers: Teacher[];
  rooms: Room[];
  divisions: Division[];
  selectedDivisionId: string | 'all';
  selectedTeacherId: string | 'all';
  selectedRoomId: string | 'all';
  userRole?: 'admin' | 'faculty' | 'student';
  onSelectEntry: (entry: TimetableEntry) => void;
  onFindSubstitute: (entry: TimetableEntry) => void;
  onEmptySlotClick: (day: DayOfWeek, slotIndex: number) => void;
  onGenerateTimetable?: () => void;
  onOpenCoordinatorHub?: () => void;
}

const SUBJECT_COLOR_FALLBACK = '#3B82F6';

function getSubjectColor(subject: Subject | undefined): string {
  return subject?.color || SUBJECT_COLOR_FALLBACK;
}

function getSubjectColorLight(subject: Subject | undefined): string {
  const color = getSubjectColor(subject);
  return `${color}1A`;
}

function getSubjectColorBorder(subject: Subject | undefined): string {
  const color = getSubjectColor(subject);
  return `${color}40`;
}

const LectureCard: React.FC<{
  entry: TimetableEntry;
  subject: Subject | undefined;
  teacher: Teacher | undefined;
  originalTeacher: Teacher | undefined;
  room: Room | undefined;
  division: Division | undefined;
  isMultiSlot: boolean;
  showDivision: boolean;
  userRole: 'admin' | 'faculty' | 'student';
  onSelect: () => void;
  onFindSubstitute: () => void;
  onEdit: () => void;
}> = ({
  entry,
  subject,
  teacher,
  originalTeacher,
  room,
  division,
  isMultiSlot,
  showDivision,
  userRole,
  onSelect,
  onFindSubstitute,
  onEdit,
}) => {
  const subjectColor = getSubjectColor(subject);
  const subjectColorLight = getSubjectColorLight(subject);
  const subjectColorBorder = getSubjectColorBorder(subject);
  const isPractical = entry.isPractical;
  const isSubstituted = entry.isSubstituted;

  const cardStyle: React.CSSProperties = {
    '--subject-color': subjectColor,
    '--subject-color-light': subjectColorLight,
    '--subject-color-border': subjectColorBorder,
  };

  return (
    <td key={`${entry.day}-${entry.slotIndex}`} colSpan={entry.durationSlots} className="p-1.5 border-r border-slate-200 align-top">
      <article
        id={`lecture-card-${entry.id}`}
        style={cardStyle}
        className={`group relative h-full rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-150 flex flex-col cursor-pointer ${
          isPractical ? 'bg-[var(--subject-color-light)] border-l-4 border-[var(--subject-color)]' : 'border-l-4 border-[var(--subject-color)]'
        } ${isSubstituted ? 'ring-2 ring-amber-300 bg-amber-50/30' : ''}`}
        onClick={onSelect}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect();
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={`${subject?.code || 'Lecture'}: ${subject?.name || ''}, ${teacher?.name || 'Faculty'}, ${room?.name || 'Room'}`}
      >
        <div className="p-3 flex flex-col h-full">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="px-2 py-1 rounded bg-[var(--subject-color-light)] text-[var(--subject-color)] text-[10px] font-bold tracking-tight whitespace-nowrap shrink-0">
                {subject?.code || 'SUB'}
              </span>
              <div className="min-w-0">
                {isPractical ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-semibold shrink-0">
                    <FlaskConical className="w-3 h-3" />
                    2-Hr Lab
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium shrink-0">
                    Theory
                  </span>
                )}
              </div>
            </div>
            {isSubstituted && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[9px] font-semibold shrink-0">
                Substituted
              </span>
            )}
          </div>

          <p className="text-xs font-bold text-slate-900 line-clamp-1 truncate mb-1">
            {subject?.name || 'Subject'}
          </p>

          {showDivision && division && (
            <p className="text-[11px] font-medium text-slate-600 truncate mb-2">
              {division.name}
            </p>
          )}

          <div className="mt-auto pt-2 border-t border-slate-100 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
              <User className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
              <span className={`truncate font-medium ${isSubstituted ? 'text-amber-800' : 'text-slate-900'}`}>
                {teacher?.name || 'Faculty'}
              </span>
            </div>

            {isSubstituted && originalTeacher && (
              <div className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded font-medium truncate">
                Sub for {originalTeacher.name}
              </div>
            )}

            <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
              <span className="truncate">{room?.name || 'Room'}</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-medium ${
                room?.type === 'lab' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
              }">
                {room?.type === 'lab' ? 'Lab' : 'Room'}
              </span>
            </div>
          </div>
        </div>

        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 focus-within:opacity-100" role="group" aria-label="Actions">
          {userRole === 'admin' ? (
            <>
              <button
                type="button"
                title="Edit / Relocate Slot"
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                aria-label="Edit lecture"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                title="Find Substitute Teacher"
                onClick={(e) => { e.stopPropagation(); onFindSubstitute(); }}
                className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1"
                aria-label="Find substitute"
              >
                <UserPlus className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <button
              type="button"
              title="View Details"
              onClick={(e) => { e.stopPropagation(); onSelect(); }}
              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              aria-label="View lecture details"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </article>
    </td>
  );
};

const EmptySlot: React.FC<{
  day: DayOfWeek;
  slotIndex: number;
  userRole: 'admin' | 'faculty' | 'student';
  onClick: (day: DayOfWeek, slotIndex: number) => void;
  onKeyDown: (e: React.KeyboardEvent, day: DayOfWeek, slotIndex: number) => void;
  periodLabel: string;
}> = ({ day, slotIndex, userRole, onClick, onKeyDown, periodLabel }) => {
  const isAdmin = userRole === 'admin';

  return (
    <td
      key={`${day}-${slotIndex}`}
      className="p-1.5 border-r border-slate-200"
      role={isAdmin ? 'gridcell' : 'cell'}
      tabIndex={isAdmin ? 0 : -1}
      onClick={isAdmin ? () => onClick(day, slotIndex) : undefined}
      onKeyDown={isAdmin ? (e) => onKeyDown(e, day, slotIndex) : undefined}
      aria-label={isAdmin ? `Empty slot, ${day} ${periodLabel}. Press Enter to add lecture.` : `${day} ${periodLabel}, free slot`}
    >
      <div className="h-full min-h-[100px] rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center transition-colors duration-150 ${
        isAdmin ? 'hover:border-blue-300 hover:bg-blue-50 cursor-pointer' : 'bg-slate-50/50 cursor-default'
      }">
        {isAdmin ? (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onClick(day, slotIndex); }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(day, slotIndex); } }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-slate-400 hover:text-blue-600 hover:bg-white font-medium text-sm rounded-lg border border-slate-200 shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label={`Add lecture at ${day} ${periodLabel}`}
          >
            <Plus className="w-4 h-4" />
            <span>Add Lecture</span>
          </button>
        ) : (
          <span className="text-[11px] text-slate-300 font-medium">Free Slot</span>
        )}
      </div>
    </td>
  );
};

const DayHeader: React.FC<{ day: DayOfWeek; index: number }> = ({ day, index }) => (
  <th scope="row" className="p-3 font-semibold text-sm text-slate-800 bg-slate-50/80 border-r border-slate-200 sticky left-0 z-10 w-28 min-w-[7rem]">
    <div className="flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" aria-hidden="true" />
      <span className="truncate">{day}</span>
    </div>
  </th>
);

const PeriodHeader: React.FC<{ period: typeof STANDARD_PERIODS[0] }> = ({ period }) => {
  const isBreak = period.isBreak;
  return (
    <th
      scope="col"
      key={period.id}
      className={`p-2.5 text-center text-xs font-semibold border-r border-slate-200 last:border-r-0 sticky top-0 z-10 ${
        isBreak
          ? 'bg-amber-50 text-amber-800 w-24 min-w-[6rem] border-amber-200'
          : 'bg-slate-50 text-slate-600 border-slate-200'
      }`}
      style={{ minWidth: isBreak ? '80px' : '100px' }}
    >
      <div className="font-bold text-[11px] leading-tight">{period.startTime} - {period.endTime}</div>
      <div className="text-[10px] font-normal leading-tight">
        {isBreak ? 'LUNCH' : `Period ${period.periodIndex + 1}`}
      </div>
    </th>
  );
};

const LunchCell: React.FC<{ day: DayOfWeek; slotIndex: number }> = ({ day, slotIndex }) => (
  <td
    key={`${day}-${slotIndex}`}
    className="p-2 text-center bg-amber-50/50 border-r border-slate-200 border-amber-200 select-none"
    role="gridcell"
    aria-label={`${day} Lunch Break`}
  >
    <div className="py-6 flex flex-col items-center justify-center gap-0.5">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-800">Lunch</span>
      <span className="text-[10px] text-amber-600">1:00 - 2:00 PM</span>
    </div>
  </td>
);

const EmptyState: React.FC<{
  userRole: 'admin' | 'faculty' | 'student';
  divisions: Division[];
  subjects: Subject[];
  teachers: Teacher[];
  rooms: Room[];
  onGenerateTimetable?: () => void;
  onOpenCoordinatorHub?: () => void;
}> = ({ userRole, divisions, subjects, teachers, rooms, onGenerateTimetable, onOpenCoordinatorHub }) => (
  <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
        <Clock className="w-5 h-5" />
      </div>
      <div>
        <h4 className="font-bold text-slate-900 text-sm">
          {userRole === 'admin' ? 'Timetable Not Yet Generated' : 'Academic Timetable Pending Publication'}
        </h4>
        <p className="text-xs text-slate-600 mt-0.5 max-w-md">
          {userRole === 'admin'
            ? `Coordinator inputs configured: ${divisions.length} divisions, ${subjects.length} subjects, ${teachers.length} faculty, ${rooms.length} rooms.`
            : 'The master timetable has not been published yet by the Timetable Administrator.'}
        </p>
      </div>
    </div>

    <div className="flex items-center gap-2 flex-wrap">
      {userRole === 'admin' ? (
        <>
          {onOpenCoordinatorHub && (
            <button
              onClick={onOpenCoordinatorHub}
              className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Edit College Data
            </button>
          )}
          {onGenerateTimetable && (
            <button
              onClick={onGenerateTimetable}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Generate Timetable</span>
            </button>
          )}
        </>
      ) : (
        <span className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm">
          <User className="w-3.5 h-3.5 text-slate-400" />
          {userRole === 'faculty' ? 'Faculty Portal (Read-Only)' : 'Student Portal (Read-Only)'}
        </span>
      )}
    </div>
  </div>
);

export const TimetableGrid: React.FC<Props> = ({
  entries,
  subjects,
  teachers,
  rooms,
  divisions,
  selectedDivisionId,
  selectedTeacherId,
  selectedRoomId,
  userRole = 'admin',
  onSelectEntry,
  onFindSubstitute,
  onEmptySlotClick,
  onGenerateTimetable,
  onOpenCoordinatorHub,
}) => {
  const tableRef = useRef<HTMLTableElement>(null);
  const [focusedCell, setFocusedCell] = React.useState<{ day: DayOfWeek; slotIndex: number } | null>(null);

  const filteredEntries = entries.filter((entry) => {
    if (selectedDivisionId !== 'all' && entry.divisionId !== selectedDivisionId) return false;
    if (selectedTeacherId !== 'all' && entry.teacherId !== selectedTeacherId) return false;
    if (selectedRoomId !== 'all' && entry.roomId !== selectedRoomId) return false;
    return true;
  });

  const subjectsMap = new Map<string, Subject>(subjects.map((s) => [s.id, s]));
  const teachersMap = new Map<string, Teacher>(teachers.map((t) => [t.id, t]));
  const roomsMap = new Map<string, Room>(rooms.map((r) => [r.id, r]));
  const divisionsMap = new Map<string, Division>(divisions.map((d) => [d.id, d]));

  const handleKeyNavigation = useCallback((e: React.KeyboardEvent, currentDay: DayOfWeek, currentSlot: number) => {
    if (!tableRef.current) return;

    const dayIndex = DAYS_OF_WEEK.indexOf(currentDay);
    const periodCount = STANDARD_PERIODS.length;
    let nextDay = currentDay;
    let nextSlot = currentSlot;

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        nextSlot = currentSlot + 1;
        if (nextSlot >= periodCount) {
          nextSlot = 0;
          nextDay = DAYS_OF_WEEK[(dayIndex + 1) % DAYS_OF_WEEK.length];
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        nextSlot = currentSlot - 1;
        if (nextSlot < 0) {
          nextSlot = periodCount - 1;
          nextDay = DAYS_OF_WEEK[(dayIndex - 1 + DAYS_OF_WEEK.length) % DAYS_OF_WEEK.length];
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        nextDay = DAYS_OF_WEEK[(dayIndex + 1) % DAYS_OF_WEEK.length];
        break;
      case 'ArrowUp':
        e.preventDefault();
        nextDay = DAYS_OF_WEEK[(dayIndex - 1 + DAYS_OF_WEEK.length) % DAYS_OF_WEEK.length];
        break;
      case 'Home':
        e.preventDefault();
        nextSlot = 0;
        break;
      case 'End':
        e.preventDefault();
        nextSlot = periodCount - 1;
        break;
      default:
        return;
    }

    setFocusedCell({ day: nextDay, slotIndex: nextSlot });

    const targetCell = tableRef.current?.querySelector(
      `td[data-day="${nextDay}"][data-slot="${nextSlot}"]`
    ) as HTMLElement;
    targetCell?.focus();
  }, []);

  const handleEmptySlotKeyDown = (e: React.KeyboardEvent, day: DayOfWeek, slotIndex: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onEmptySlotClick(day, slotIndex);
    } else {
      handleKeyNavigation(e, day, slotIndex);
    }
  };

  useEffect(() => {
    if (focusedCell) {
      const targetCell = tableRef.current?.querySelector(
        `td[data-day="${focusedCell.day}"][data-slot="${focusedCell.slotIndex}"]`
      ) as HTMLElement;
      targetCell?.focus();
    }
  }, [focusedCell]);

  if (entries.length === 0) {
    return (
      <div id="timetable-grid-container" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <EmptyState
          userRole={userRole}
          divisions={divisions}
          subjects={subjects}
          teachers={teachers}
          rooms={rooms}
          onGenerateTimetable={onGenerateTimetable}
          onOpenCoordinatorHub={onOpenCoordinatorHub}
        />
      </div>
    );
  }

  return (
    <div id="timetable-grid-container" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto" role="region" aria-label="Timetable grid" tabIndex={0}>
        <table
          ref={tableRef}
          className="w-full border-collapse min-w-[840px]"
          role="grid"
          aria-readonly={userRole !== 'admin'}
        >
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
              <th scope="col" className="p-3 text-left text-xs font-bold uppercase tracking-wider w-28 min-w-[7rem] border-r border-slate-200 sticky left-0 z-20 bg-slate-50">
                Day / Time
              </th>
              {STANDARD_PERIODS.map((period) => (
                <PeriodHeader key={period.id} period={period} />
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {DAYS_OF_WEEK.map((day, dayIndex) => {
              let skipNextCol = false;

              return (
                <tr key={day} className="hover:bg-slate-50/30 transition-colors">
                  <DayHeader day={day} index={dayIndex} />

                  {STANDARD_PERIODS.map((period) => {
                    const slotIndex = period.periodIndex;

                    if (skipNextCol) {
                      skipNextCol = false;
                      return null;
                    }

                    if (period.isBreak) {
                      return <LunchCell key={`${day}-${slotIndex}`} day={day} slotIndex={slotIndex} />;
                    }

                    const entryAtSlot = filteredEntries.find(
                      (e) => e.day === day && e.slotIndex === slotIndex
                    );

                    const entrySpanningIntoSlot = filteredEntries.find(
                      (e) => e.day === day && e.slotIndex < slotIndex && e.slotIndex + e.durationSlots > slotIndex
                    );

                    if (entrySpanningIntoSlot) {
                      return null;
                    }

                    if (entryAtSlot) {
                      const subject = subjectsMap.get(entryAtSlot.subjectId);
                      const teacher = teachersMap.get(entryAtSlot.teacherId);
                      const originalTeacher = entryAtSlot.originalTeacherId
                        ? teachersMap.get(entryAtSlot.originalTeacherId)
                        : undefined;
                      const room = roomsMap.get(entryAtSlot.roomId);
                      const division = divisionsMap.get(entryAtSlot.divisionId);
                      const isMultiSlot = entryAtSlot.durationSlots > 1;

                      if (isMultiSlot) {
                        skipNextCol = true;
                      }

                      return (
                        <LectureCard
                          key={`${day}-${slotIndex}`}
                          entry={entryAtSlot}
                          subject={subject}
                          teacher={teacher}
                          originalTeacher={originalTeacher}
                          room={room}
                          division={division}
                          isMultiSlot={isMultiSlot}
                          showDivision={selectedDivisionId === 'all'}
                          userRole={userRole}
                          onSelect={() => onSelectEntry(entryAtSlot)}
                          onFindSubstitute={() => onFindSubstitute(entryAtSlot)}
                          onEdit={() => onSelectEntry(entryAtSlot)}
                        />
                      );
                    }

                    return (
                      <EmptySlot
                        key={`${day}-${slotIndex}`}
                        day={day}
                        slotIndex={slotIndex}
                        userRole={userRole}
                        onClick={onEmptySlotClick}
                        onKeyDown={handleEmptySlotKeyDown}
                        periodLabel={`${period.startTime} - ${period.endTime}`}
                      />
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};