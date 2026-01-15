// pb_hooks/main.pb.js

// 1. LEAVE REQUEST CREATED -> EMAIL MANAGER
onRecordAfterCreateRequest((e) => {
    if (e.collection.name !== "leaves") return;
    const record = e.record;
    const managerId = record.get("line_manager_id");
    if (!managerId) return;

    try {
        const manager = $app.dao().findRecordById("users", managerId);
        const message = new MailerMessage({
            from: { address: $app.settings().meta.senderAddress, name: $app.settings().meta.senderName },
            to:   [{ address: manager.email() }],
            subject: "New Leave Application: " + record.get("employee_name"),
            html: "<h2>New Leave Request</h2>" +
                  "<p><b>Employee:</b> " + record.get("employee_name") + "</p>" +
                  "<p><b>Dates:</b> " + record.get("start_date") + " to " + record.get("end_date") + "</p>" +
                  "<p>Please log in to the OpenHR portal to review this request.</p>",
        });
        $app.newMailClient().send(message);
    } catch (err) { console.error("Leave Create Hook Error:", err); }
}, "leaves");

// 2. LEAVE REQUEST UPDATED (Approved/Rejected) -> EMAIL EMPLOYEE
onRecordAfterUpdateRequest((e) => {
    if (e.collection.name !== "leaves") return;
    const record = e.record;
    const status = record.get("status");
    if (status !== "APPROVED" && status !== "REJECTED") return;

    try {
        const employee = $app.dao().findRecordById("users", record.get("employee_id"));
        const message = new MailerMessage({
            from: { address: $app.settings().meta.senderAddress, name: $app.settings().meta.senderName },
            to:   [{ address: employee.email() }],
            subject: "Leave Request Update: " + status,
            html: "<h3>Hello " + record.get("employee_name") + ",</h3>" +
                  "<p>Your leave request has been <b>" + status + "</b>.</p>" +
                  "<p><b>Manager Remarks:</b> " + (record.get("manager_remarks") || "None") + "</p>" +
                  "<p><b>HR Remarks:</b> " + (record.get("approver_remarks") || "None") + "</p>",
        });
        $app.newMailClient().send(message);
    } catch (err) { console.error("Leave Update Hook Error:", err); }
}, "leaves");

// 3. TRIGGER REPORTS VIA COLLECTION (No more 404s!)
onRecordAfterCreateRequest((e) => {
    if (e.collection.name !== "reports_queue") return;
    const record = e.record;

    try {
        const message = new MailerMessage({
            from: { address: $app.settings().meta.senderAddress, name: $app.settings().meta.senderName },
            to:   [{ address: record.get("recipient_email") }],
            subject: record.get("subject"),
            html: record.get("html_content"),
        });
        $app.newMailClient().send(message);
        
        // Optional: delete to keep DB clean
        // $app.dao().deleteRecord(record); 
    } catch (err) { console.error("Report Trigger Error:", err); }
}, "reports_queue");