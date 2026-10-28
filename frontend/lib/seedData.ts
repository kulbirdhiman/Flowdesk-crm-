/*
 * Demo data for the local database. Dates are generated relative to today,
 * so attendance, follow-ups and call logs always look current on a fresh seed.
 */

export type Row = Record<string, any>;
export type Tables = Record<string, Row[]>;

export const DEMO_PASSWORD = "demo1234";

// Sign-in profiles shown on the login page.
export const DEMO_ACCOUNTS = [
  {
    role: "admin",
    label: "Admin",
    name: "Aarav Mehta",
    title: "CEO",
    email: "admin@demo.crm",
    password: DEMO_PASSWORD,
    access: "Full dashboard: all leads, sales, employees, tasks, tickets, documents, subscriptions and attendance.",
  },
  {
    role: "employee",
    label: "Employee",
    name: "Sahil",
    title: "Sales Executive",
    email: "employee@demo.crm",
    password: DEMO_PASSWORD,
    access: "Employee portal: own leads, call logs, tasks, tickets, documents and daily check-in.",
  },
  {
    role: "hr",
    label: "HR",
    name: "Priya Sharma",
    title: "HR Executive",
    email: "hr@demo.crm",
    password: DEMO_PASSWORD,
    access: "HR attendance dashboard: everyone's attendance, with marking and editing.",
  },
] as const;

// Small deterministic random generator, so every fresh seed looks the same.
function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const id = (prefix: string, n: number) => `${prefix}-0000-4000-8000-${String(n).padStart(12, "0")}`;

export function buildSeed(): Tables {
  const rand = rng(20261023);
  const pick = <T,>(list: readonly T[]) => list[Math.floor(rand() * list.length)];
  const between = (min: number, max: number) => min + Math.floor(rand() * (max - min + 1));

  const now = new Date();
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const daysAgo = (d: number, hour = 10, minute = 0) => {
    const t = new Date(dayStart);
    t.setDate(t.getDate() - d);
    t.setHours(hour, minute, 0, 0);
    return t;
  };
  const iso = (d: Date) => d.toISOString();
  const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  // ---------------------------------------------------------------- org chart
  const departments = [
    "Management",
    "Sales & Marketing",
    "Human Resources",
    "Customer Support",
    "Finance",
    "Operations",
  ].map((department_name, i) => ({ whalesync_postgres_id: id("d0000000", i + 1), department_name }));
  const dept = (name: string) => departments.find((d) => d.department_name === name)!.whalesync_postgres_id;

  const Teams = ["Sales Alpha", "Sales Beta", "Support", "Back Office"].map((team_name, i) => ({
    id: i + 1,
    whalesync_postgres_id: id("t0000000", i + 1),
    team_name,
  }));

  const people = [
    ["Aarav Mehta", "CEO", "Management", "admin@demo.crm", 1, "Full-time", "Office"],
    ["Sahil", "Sales Executive", "Sales & Marketing", "employee@demo.crm", 1, "Full-time", "Office"],
    ["Priya Sharma", "HR Executive", "Human Resources", "hr@demo.crm", 4, "Full-time", "Office"],
    ["Rohit Verma", "Sales Executive", "Sales & Marketing", "rohit@demo.crm", 1, "Full-time", "Office"],
    ["Neha Gupta", "Business Development Executive", "Sales & Marketing", "neha@demo.crm", 2, "Full-time", "Hybrid"],
    ["Karan Singh", "Customer Support Executive", "Customer Support", "karan@demo.crm", 3, "Full-time", "Office"],
    ["Ananya Rao", "Marketing Executive", "Sales & Marketing", "ananya@demo.crm", 2, "Full-time", "Remote"],
    ["Vikram Joshi", "Accounts Executive", "Finance", "vikram@demo.crm", 4, "Full-time", "Office"],
    ["Meera Iyer", "Operations Executive", "Operations", "meera@demo.crm", 4, "Intern", "Hybrid"],
  ] as const;

  const employees: Row[] = people.map(([full_name, job_title, department, official_email, team, employment_type, work_mode], i) => {
    const uid = id("e0000000", i + 1);
    const first = full_name.split(" ")[0].toLowerCase();
    return {
      whalesync_postgres_id: uid,
      id: uid,
      employee_id: `EMP${String(101 + i)}`,
      full_name,
      official_email,
      official_contact_number: `+91 98${String(10000000 + i * 7654321).slice(0, 8)}`,
      personal_email: `${first}.personal@example.com`,
      dob: ymd(new Date(1994 + (i % 7), (i * 3) % 12, 5 + i)),
      linkedin_profile: `https://www.linkedin.com/in/${first}-demo`,
      date_of_joining: ymd(daysAgo(120 + i * 45)),
      job_title,
      employment_type,
      work_mode,
      status: "Active",
      profile_photo: null,
      monthly_payroll: [150000, 35000, 40000, 32000, 38000, 28000, 34000, 42000, 15000][i],
      Notes: null,
      Announcement: null,
      department: dept(department),
      reporting_manager: i === 0 ? null : id("e0000000", 1),
      teams: team,
    };
  });
  employees[0].Announcement = JSON.stringify({
    type: "announcement",
    title: "Welcome to the demo CRM",
    message: "Everything here is sample data saved in your browser. Add leads, mark attendance and raise tickets freely.",
  });
  const emp = (i: number) => employees[i].whalesync_postgres_id;
  const sales = [1, 3, 4, 6];

  const Users = employees.map((e, i) => ({ id: i + 1, email: e.official_email, employee: e.whalesync_postgres_id }));

  // -------------------------------------------------------------------- leads
  const leadNames = [
    "Rajesh Kumar", "Pooja Malhotra", "Amit Bansal", "Sneha Kapoor", "Vivek Choudhary", "Kavya Nair",
    "Harsh Agarwal", "Ritika Saini", "Manish Arora", "Divya Menon", "Suresh Yadav", "Ishita Jain",
    "Nikhil Khanna", "Tanvi Desai", "Gaurav Sethi", "Simran Kaur", "Arjun Reddy", "Megha Bhatia",
    "Rahul Tiwari", "Anjali Mishra", "Deepak Chauhan", "Shreya Pillai", "Mohit Goel", "Nisha Rawat",
    "Varun Sood", "Aditi Kulkarni", "Kunal Thakur", "Payal Dutta", "Sanjay Bhatt", "Ritu Saxena",
    "Yash Patel", "Komal Grover", "Ankit Mittal", "Bhavna Joshi", "Rohan Das", "Pallavi Shetty",
    "Abhishek Rana", "Swati Pandey", "Naveen Gill", "Preeti Ahuja", "Sameer Qureshi", "Jyoti Verma",
    "Akash Bajaj", "Mansi Chopra", "Tarun Bedi", "Neelam Sinha", "Siddharth Rao", "Isha Kohli",
  ];
  const cities = ["Delhi", "Mumbai", "Bengaluru", "Pune", "Jaipur", "Ahmedabad", "Gurugram", "Noida", "Hyderabad", "Chandigarh", "Lucknow", "Indore"];
  const services = ["Brand Development", "USA LLC Formation", "Dropshipping", "Canton Fair", "Video Call"];
  const sources = ["Website", "Facebook", "Instagram", "LinkedIn", "Cold Call", "Referral", "Google Ads"];
  const stagePlan = [
    "New", "New", "New", "New", "Contact Attempted", "Connected", "In Discussion / Nurturing",
    "Follow Up Required", "Follow Up Required", "Not Connected", "Not Connected", "Converted", "Converted", "Lost",
  ];
  const remarks = [
    "Interested, wants a proposal on WhatsApp.",
    "Asked to call back after the weekend.",
    "Comparing two vendors, decision next week.",
    "Budget approved, waiting for founder sign-off.",
    "Phone switched off, try again in the evening.",
    "Wants pricing for the premium package.",
  ];

  const Leads: Row[] = leadNames.map((name, i) => {
    const stage = stagePlan[i % stagePlan.length];
    const created = daysAgo(between(0, 40), between(9, 18), between(0, 59));
    const owner = i % 2 === 0 ? emp(1) : emp(pick(sales));
    const service = pick(services);
    const budget = pick([25000, 50000, 75000, 100000, 150000, 250000]);
    const first = name.split(" ")[0].toLowerCase();
    const mobile = `+91 9${String(800000000 + i * 1234567).slice(0, 9)}`;
    return {
      whalesync_postgres_id: id("10000000", i + 1),
      name,
      stage,
      deal_amount: stage === "Converted" ? budget : 0,
      date_and_time: iso(created),
      assigned_to: owner,
      email: `${first}.${i + 1}@example.com`,
      mobile,
      city: pick(cities),
      source: pick(sources),
      client_budget: budget,
      current_business_turnover: pick(["Under 10 Lakh", "10-50 Lakh", "50 Lakh - 1 Cr", "1 Cr+"]),
      services: service,
      interested_in_products: [service],
      follow_up_date: stage === "Follow Up Required" || stage === "In Discussion / Nurturing" ? ymd(daysAgo(-between(-1, 5))) : null,
      call_remark: stage === "New" ? null : pick(remarks),
      call_notes: stage === "New" ? null : pick(remarks),
      employee_name: employees.find((e) => e.whalesync_postgres_id === owner)?.full_name,
      lead_tag: pick(["Hot", "Warm", "Cold"]),
      assignment_status: "Assigned",
      today_s_lead: ymd(created) === ymd(now) ? "Yes" : "No",
      whatsapp_link: `https://wa.me/${mobile.replace(/\D/g, "")}`,
      profile_photo: null,
      age: between(24, 52),
      any_other_interests: null,
      expected_closing: stage === "Converted" ? ymd(created) : ymd(daysAgo(-between(5, 30))),
      follow_up_day: null,
      last_callback_date: stage === "New" ? null : ymd(daysAgo(between(0, 6))),
      official_email: null,
      official_number: null,
      stage1: null,
      email_button: null,
      calls: null,
    };
  });

  // -------------------------------------------------------------------- calls
  const sentiments = ["Positive", "Neutral", "Negative"];
  const summaries = [
    "Client asked about timelines and payment plans. Shared the brochure on WhatsApp.",
    "Discussed requirements in detail. Client wants a follow-up call with the senior consultant.",
    "Client was busy, asked for a callback tomorrow afternoon.",
    "Explained the process and documents needed. Client seemed keen to start this month.",
    "Client raised a pricing objection. Offered the quarterly payment option.",
  ];
  const Calls: Row[] = Array.from({ length: 80 }, (_, i) => {
    const lead = Leads[i % Leads.length];
    const type = pick(["Outgoing", "Outgoing", "Incoming", "Missed"]);
    return {
      whalesync_postgres_id: id("c0000000", i + 1),
      employee: i % 2 === 0 ? emp(1) : lead.assigned_to,
      leads: lead.whalesync_postgres_id,
      client_name: lead.name,
      client_number: lead.mobile,
      duration: type === "Missed" ? 0 : between(35, 900),
      call_date: iso(daysAgo(between(0, 13), between(9, 19), between(0, 59))),
      sentiment: type === "Missed" ? null : pick(sentiments),
      call_type: type,
      service: lead.services,
      ai_call_summary: type === "Missed" ? null : pick(summaries),
    };
  });

  // --------------------------------------------------------------- attendance
  const Attendance: Row[] = [];
  let attN = 0;
  for (let d = 1; d <= 30; d++) {
    const day = daysAgo(d);
    const dow = day.getDay();
    if (dow === 0) continue; // Sundays off
    for (const e of employees) {
      const roll = rand();
      const status = roll < 0.07 ? "Absent" : roll < 0.14 ? "Half Day" : "Present";
      const timeIn = status === "Absent" ? null : Math.round((9 + rand() * 1.4) * 100) / 100;
      const timeOut = status === "Absent" ? null : status === "Half Day" ? Math.round((timeIn! + 4.2) * 100) / 100 : Math.round((18 + rand() * 1.2) * 100) / 100;
      const deptName = departments.find((x) => x.whalesync_postgres_id === e.department)?.department_name;
      Attendance.push({
        whalesync_postgres_id: id("a0000000", ++attN),
        employee: e.whalesync_postgres_id,
        date: ymd(day),
        status,
        time_in: timeIn,
        time_out: timeOut,
        working_hours: timeIn && timeOut ? Math.round((timeOut - timeIn) * 100) / 100 : 0,
        notes: null,
        punctuality_status: timeIn === null ? null : timeIn > 9.75 ? "Late" : "On Time",
        marked_at: iso(daysAgo(d, Math.floor(timeIn || 10), 5)),
        employee_id: e.employee_id,
        employee_name: e.full_name,
        department: deptName,
        employee_id_from_employee: e.employee_id,
        full_name_from_employee: e.full_name,
        department_name_from_employee: deptName,
        date_status: status,
        day_name_of_date: day.toLocaleDateString("en-US", { weekday: "long" }),
      });
    }
  }

  // -------------------------------------------------------------------- tasks
  const taskPlan: [string, string, number, string, string, number][] = [
    ["Call back all follow-up leads from last week", "Go through the Follow Up list and update every lead's stage.", 1, "pending", "high", 1],
    ["Send USA LLC proposal to Amit Bansal", "Use the new proposal template and attach the pricing sheet.", 1, "in_progress", "high", 0],
    ["Update lead notes after client calls", "Every call needs a short note and the next follow-up date.", 1, "completed", "medium", -2],
    ["Prepare weekly sales report", "Leads contacted, converted and lost, by service.", 1, "pending", "medium", 3],
    ["Share Canton Fair brochure with new leads", "WhatsApp the brochure to every new Canton Fair lead.", 3, "pending", "low", 2],
    ["Close pending Brand Development deals", "Three deals are waiting on the final quote.", 4, "in_progress", "high", 1],
    ["Plan the Instagram campaign for next month", "Draft posts and the ad budget split.", 6, "pending", "medium", 6],
    ["Collect documents from new joiners", "Offer letter, ID proof and bank details.", 2, "in_progress", "medium", 2],
    ["Reconcile last month's subscription invoices", "Match every invoice to the subscriptions tracker.", 7, "completed", "low", -4],
    ["Resolve escalated support tickets", "Escalated tickets older than two days first.", 5, "pending", "high", 0],
    ["Update the onboarding checklist", "Add the new CRM steps.", 8, "completed", "low", -6],
    ["Review overdue follow-ups with the team", "Daily stand-up item until the list is clear.", 0, "pending", "medium", -1],
  ];
  const tasks: Row[] = taskPlan.map(([title, description, who, status, priority, dueIn], i) => {
    const due = daysAgo(-dueIn, 18);
    const overdue = status !== "completed" && due < now;
    return {
      id: id("50000000", i + 1),
      title,
      description,
      status,
      priority,
      due_date: iso(due),
      assignee: emp(who),
      created_at: iso(daysAgo(between(3, 12))),
      updated_at: iso(daysAgo(between(0, 2))),
      completed_on: status === "completed" ? iso(daysAgo(Math.max(0, -dueIn - 1))) : null,
      is_overdue: overdue,
      days_overdue: overdue ? Math.max(1, Math.floor((now.getTime() - due.getTime()) / 86400000)) : 0,
      update_count: between(0, 4),
      attachments: [],
    };
  });

  // ------------------------------------------------------------------ tickets
  const ticketPlan: [string, string, string, string, string, string, number][] = [
    ["Rakesh Arora", "Arora Exports", "Unable to download the LLC formation documents.", "New", "High", "Sahil", 0],
    ["Neha Kapoor", "Kapoor Textiles", "Invoice amount does not match the quote.", "In Progress", "Medium", "Vikram Joshi", 1],
    ["Imran Sheikh", "Sheikh Traders", "Canton Fair visa letter delayed.", "Escalated", "Critical", "Karan Singh", 2],
    ["Pooja Rana", "Rana Foods", "Requesting a change in the brand logo draft.", "In Progress", "Low", "Sahil", 3],
    ["Ajay Mehra", "Mehra Electronics", "Dropshipping store not showing new products.", "New", "Medium", "Karan Singh", 4],
    ["Sunita Bose", "Bose Handicrafts", "Payment deducted twice.", "Resolved", "High", "Vikram Joshi", 5],
    ["Farhan Ali", "Ali Imports", "Need an extra video call slot this week.", "Resolved", "Low", "Sahil", 6],
    ["Gurpreet Sandhu", "Sandhu Agro", "EIN application status update.", "New", "Medium", "Neha Gupta", 7],
  ];
  const tickets: Row[] = [];
  const ticket_assignments: Row[] = [];
  const ticket_chat: Row[] = [];
  const ticket_history: Row[] = [];
  ticketPlan.forEach(([client, company, issue, status, priority, assignee, age], i) => {
    const tid = id("70000000", i + 1);
    const created = daysAgo(age, between(10, 17));
    tickets.push({
      id: tid,
      ticket_number: 1001 + i,
      client_name: client,
      client_email: `${client.split(" ")[0].toLowerCase()}@example.com`,
      company,
      issue,
      status,
      priority,
      assigned_to: assignee,
      created_at: iso(created),
      updated_at: iso(daysAgo(Math.max(0, age - 1), 16)),
    });
    const owner = employees.find((e) => e.full_name === assignee);
    if (owner) ticket_assignments.push({ id: i + 1, ticket_id: tid, employee_id: owner.whalesync_postgres_id, created_at: iso(created) });
    ticket_history.push(
      { id: id("72000000", i * 2 + 1), ticket_id: tid, user_name: "Aarav Mehta", action: `Ticket created and assigned to ${assignee}`, created_at: iso(created) },
      ...(status !== "New"
        ? [{ id: id("72000000", i * 2 + 2), ticket_id: tid, user_name: assignee, action: `Status changed to ${status}`, created_at: iso(daysAgo(Math.max(0, age - 1), 15)) }]
        : [])
    );
    ticket_chat.push(
      { id: id("71000000", i * 2 + 1), ticket_id: tid, user_name: client, message: issue, sender_type: "received", created_at: iso(created) },
      { id: id("71000000", i * 2 + 2), ticket_id: tid, user_name: assignee, message: "Thanks for reaching out. We are looking into this and will update you shortly.", sender_type: "sent", created_at: iso(new Date(created.getTime() + 45 * 60000)) }
    );
  });

  // ---------------------------------------------------------------- documents
  const docPlan: [string, string, string, string][] = [
    ["Employee Handbook", "Company policies, leave rules and code of conduct.", "employee-handbook.pdf", "Policy"],
    ["Sales Playbook", "Call scripts, objection handling and pricing guidelines.", "sales-playbook.pdf", "Sales"],
    ["Leave Policy 2026", "Leave types, approvals and the holiday calendar.", "leave-policy-2026.pdf", "HR"],
    ["Brand Development Price List", "Current packages and add-ons for clients.", "brand-development-price-list.pdf", "Sales"],
  ];
  const documents: Row[] = docPlan.map(([title, description, file, category], i) => ({
    id: id("80000000", i + 1),
    title,
    description,
    file_name: file,
    file_type: "application/pdf",
    file_size: 1200 + i * 150,
    file_url: `/demo-docs/${file}`,
    category,
    status: "Active",
    created_at: iso(daysAgo(20 - i * 4)),
    created_by: emp(i % 2 === 0 ? 0 : 2),
  }));
  const document_assignments: Row[] = [];
  documents.forEach((doc, i) => {
    const audience = i === 1 || i === 3 ? sales : employees.map((_, j) => j);
    audience.forEach((j) =>
      document_assignments.push({
        id: document_assignments.length + 1,
        document_id: doc.id,
        employee_id: emp(j),
        can_view: true,
        can_download: i !== 3,
        created_at: doc.created_at,
      })
    );
  });

  const employeeDocs: Row[] = [];
  employees.forEach((e, i) => {
    ["Offer Letter", "ID Proof", "Bank Details"].forEach((name, j) =>
      employeeDocs.push({
        id: employeeDocs.length + 1,
        whalesync_postgres_id: id("90000000", employeeDocs.length + 1),
        employee: e.whalesync_postgres_id,
        document_name: name,
        document_type: j === 0 ? "Employment" : j === 1 ? "Identity" : "Finance",
        collection_status: (i + j) % 4 === 0 ? "Pending" : "Submitted",
        issued_date: e.date_of_joining,
        attachment: null,
      })
    );
  });

  // ------------------------------------------------------------ subscriptions
  const subPlan: [string, string, number, number, string, string, number, string][] = [
    ["Google Workspace", "Business Standard", 1008, 1008, "Monthly", "Productivity", 0, "https://workspace.google.com"],
    ["Canva Pro", "Teams", 9999, 3333, "Yearly", "Design", 6, "https://www.canva.com"],
    ["ChatGPT Team", "Team", 2500, 2500, "Monthly", "AI Tools", 0, "https://chat.openai.com"],
    ["Zoom", "Pro", 1300, 1300, "Monthly", "Communication", 5, "https://zoom.us"],
    ["Notion", "Plus", 800, 800, "Monthly", "Productivity", 0, "https://www.notion.so"],
    ["Tally Prime", "Silver", 22500, 22500, "Yearly", "Finance", 7, "https://tallysolutions.com"],
  ];
  const subscriptions: Row[] = [];
  const subscription_users: Row[] = [];
  const credentials: Row[] = [];
  subPlan.forEach(([name, tier, cost, perUser, cycle, category, owner, url], i) => {
    const sid = id("60000000", i + 1);
    const users = i === 0 ? employees.map((_, j) => j) : i === 1 ? [0, 6] : i === 3 ? [0, 1, 4, 5] : [0, owner];
    const start = daysAgo(200 - i * 20);
    const expiry = daysAgo(-(cycle === "Yearly" ? 160 - i * 20 : 4 + i * 5));
    subscriptions.push({
      id: sid,
      subscription_name: name,
      vendor_id: emp(owner),
      plan_tier: tier,
      cost_per_period: cost * (i === 0 ? users.length : 1),
      cost_per_user: perUser,
      billing_cycle: cycle,
      auto_renewal_status: i % 3 === 2 ? "Off" : "On",
      owner_id: emp(owner),
      start_date: ymd(start),
      expiry_date: ymd(expiry),
      status: "Active",
      notes: null,
      portal_url: url,
      category,
      number_of_users: users.length,
      created_at: iso(start),
      updated_at: iso(daysAgo(3)),
    });
    [...new Set(users)].forEach((j) =>
      subscription_users.push({ id: subscription_users.length + 1, subscription_id: sid, user_id: emp(j), created_at: iso(start) })
    );
    credentials.push({ id: i + 1, subscription_id: sid, email: `accounts+${name.split(" ")[0].toLowerCase()}@demo.crm`, password: "sample-only", created_at: iso(start) });
  });

  return {
    Departments: departments,
    Teams,
    "Employee Directory": employees,
    Users,
    Leads,
    Calls,
    Attendance,
    "Employee Documents": employeeDocs,
    tasks,
    documents,
    document_assignments,
    subscriptions,
    subscription_users,
    credentials,
    tickets,
    ticket_assignments,
    ticket_chat,
    ticket_history,
    admin_notes: [],
  };
}
