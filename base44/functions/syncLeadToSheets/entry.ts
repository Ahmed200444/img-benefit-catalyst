import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const SPREADSHEET_ID = '1-FN62dm1zB3hxCeZrc6FbeEkCDGDdr8Fl_bQ1ROki2E';
const SHEET_NAME = 'Sheet1';

const HEADERS = [
  'Submitted At',
  'Name',
  'Email',
  'Cell Phone',
  'Company Name',
  'Industry',
  'Company Website',
  'Num Employees',
  'Avg Employee Salary',
  'Avg Marital Status',
  'Gross Revenue Last Year',
  'Employees Currently on Coverage',
  'Calculated 60%',
  'Calculated 70%',
  'Calculated 80%',
  'Calculated 90%',
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');

    const payload = await req.json();
    const data = payload?.data || payload;

    // Ensure header row exists (check if sheet is empty first)
    const checkRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A1:A1`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const checkData = await checkRes.json();

    if (!checkData.values || checkData.values.length === 0) {
      // Write headers
      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A1:append?valueInputOption=RAW`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ values: [HEADERS] }),
        }
      );
    }

    // Append the new lead row
    const row = [
      data.created_date || new Date().toISOString(),
      data.name || '',
      data.email || '',
      data.cell_phone || '',
      data.company_name || '',
      data.industry || '',
      data.company_website || '',
      data.num_employees || '',
      data.avg_employee_salary || '',
      data.avg_marital_status || '',
      data.gross_revenue_last_year || '',
      data.openness_to_benefits || '',
      data.calculated_60 || '',
      data.calculated_70 || '',
      data.calculated_80 || '',
      data.calculated_90 || '',
    ];

    const appendRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A1:append?valueInputOption=RAW`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ values: [row] }),
      }
    );

    const appendData = await appendRes.json();

    if (!appendRes.ok) {
      return Response.json({ error: appendData }, { status: 500 });
    }

    return Response.json({ success: true, updatedRange: appendData.updates?.updatedRange });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});