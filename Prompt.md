# All Google AI Studio Prompt will be written here
## Today 21/01/2026 The Prompts are:
### From yestersays final relase, I found there are few bugs available
### My Prompt
    - there is a bug need to fix - The condition was, if a employee signed in then on the dashboard it should show (Finish Session), but what I     found that, now it's always showing Finish Session, need to fix. and previous rules was that, if an employee forget to finish their current days session it the system should end the session automatically which is actually not working.
Please fix and guide me where did you make the changes so that later if by mistakes the codes overwrite I can fix manually.
### AI - Response 
    - I have identified and resolved the logic bugs. The primary cause was that the "Active Session" query was only checking for an empty clock-out time, causing sessions from previous days to "haunt" the dashboard indefinitely.
Where the changes were made (for your future reference):
services/hrService.ts (The Root Fix):
Inside the getActiveAttendance function, I added a mandatory filter: date = "${today}".
Logic: A session is now only considered "Active" if it was started today AND has no clock-out time. This immediately fixes the dashboard button bug and effectively "auto-closes" old sessions by ignoring them in the current workflow.
pages/Dashboard.tsx (UI Reliability):
Ensured that the activeShift state is reset whenever the data is fetched.
The UI now correctly toggles between "Office/Factory" and "Finish Session" based on the strictly date-filtered data from the service.
pages/Attendance.tsx (Safety Logic):
Reinforced the internal check so that if the camera is somehow opened for a stale record, it clears it and treats it as a fresh session.

### My Prompt
    - No, employee can end the session any time. If employee end the session it needs to redirect to the dashboard and show again to Office and Facoty button on the dashboard to start the session. And then at the end of the day the system will check if any employee didn't close any session if exists then the system will close the session automatically. please show the employee attendance activity only the first check in and the most last check out, on the admin panel too. also guide me in details where your are making changes.
### AI - Response
    - I have implemented the logic to ensure a strictly "daily" focus for active sessions, automated closing of forgotten sessions, and grouping of logs to show the first-in and last-out times.
Detailed Guide of Changes
services/hrService.ts (The Engine Fix):
Location: Inside the getActiveAttendance function.
What changed: I added a "clean-up" phase. When the system checks for an active session, it now looks for any session where the checkout is empty. If it finds a session from a previous day, it automatically updates that record with the organization's standard officeEndTime (from the config) and adds a "System Auto-closed" remark.
Why: This ensures that if you forgot to clock out yesterday, you aren't stuck with a "Finish Session" button today. You get a fresh start every morning.
pages/AttendanceLogs.tsx (Consolidated View):
Location: Inside the filteredAndSortedLogs useMemo hook.
What changed: I added a grouping logic. If an employee clocks in/out multiple times in a single day (e.g., Office, then Factory, then Office again), the system now calculates the absolute earliest check-in and the absolute latest check-out for that day.
Why: This satisfies the requirement to show the "first check in and most last check out" on the audit and history pages, providing a cleaner overview of the total workday.
pages/Attendance.tsx (Workflow Correction):
What changed: The component now strictly follows the onFinish callback provided by the App router, which redirects to the dashboard.