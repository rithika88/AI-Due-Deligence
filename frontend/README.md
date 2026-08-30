# DueLens UI

Build a polished, modern SaaS dashboard UI for an application called "DueLens AI" — an AI Due Diligence Copilot that helps investors and analysts analyze companies, documents, financial information, and identify potential risks.

IMPORTANT:

- Focus ONLY on the frontend/UI.

- Do not create or modify any backend, database, API, authentication, or server functionality.

- Do NOT use fake, mock, sample, or hardcoded business data.

- Do NOT invent companies, financial figures, risk scores, percentages, documents, reports, activity, or analytics.

- Use empty states wherever real data is not available.

- The UI should be structured so that it can later be connected to a Node.js/Express backend and MongoDB without redesigning the frontend.

- Keep the code clean, modular, reusable, and production-quality.

DESIGN DIRECTION:

Create a premium B2B SaaS interface similar in quality to modern products like Linear, Vercel, Notion, and professional financial analytics platforms.

Use:

- React

- Tailwind CSS

- Lucide icons

- Clean typography

- Soft neutral/slate background

- White cards

- Subtle borders and shadows

- Moderate rounded corners

- Professional spacing

- Minimal animations

- Responsive design

Avoid:

- Excessive gradients

- Excessive rounded/pill elements

- Bright neon colors

- Clutter

- Generic AI-looking designs

- Huge hero sections

- Excessive animations

- Fake dashboard statistics

- Fake company information

APPLICATION LAYOUT:

1. SIDEBAR

Create a fixed left sidebar around 250px wide.

Top:

- DueLens AI logo/icon

- "DueLens AI"

- Small label: "Due Diligence Copilot"

Navigation:

Overview

Companies

Documents

Risk Analysis

Reports

Workspace section:

- Active workspace

- Settings

Bottom:

- User avatar

- User name

- User role

- Dropdown icon

Do not hardcode a fake user identity. Use a neutral placeholder such as "User" or a dynamic placeholder that can later be connected to authentication.

The active navigation item should have a subtle highlighted background.

2. TOP HEADER

Main content should have a professional top header.

Left:

- Current page title

- Short page description

Right:

- Search icon/input

- Notification icon

- User avatar

Do not display fake notifications or fake user information.

3. OVERVIEW DASHBOARD

Create four statistics cards:

Companies Analyzed

Documents Reviewed

Risks Identified

Reports Generated

Since there is currently no backend data:

Display:

0

or an appropriate empty-state message such as:

"No data yet"

Do NOT display:

- Fake numbers

- Fake percentages

- Fake trends

- Fake risk counts

Each card should have:

- Small Lucide icon

- Clear number or empty state

- Label

- Professional visual hierarchy

The components should be designed so real values can later be populated from API responses.

4. QUICK ACTION SECTION

Create a "Quick Actions" section with three cards:

"Add Company"

Description:

"Start a new due diligence workspace."

"Upload Documents"

Description:

"Upload financial, legal, commercial, or technical documents."

"Generate Report"

Description:

"Create a due diligence report from your analysis."

Use clear icons and subtle hover interactions.

Do not pretend that an action has completed successfully.

5. RECENT COMPANIES

Create a professional table/card titled:

"Recent Companies"

Columns:

Company

Industry

Documents

Risk Level

Last Updated

Action

Do NOT add example companies.

If there are no companies, show an elegant empty state:

"No companies yet"

"Add a company to start your due diligence analysis."

Button:

"+ Add Company"

The table should automatically be ready to display real companies once connected to the backend.

6. RISK OVERVIEW

Create a section titled:

"Risk Overview"

Prepare the layout for:

High Risk

Medium Risk

Low Risk

Do not provide fake counts.

If no risk analysis exists, show:

"No risk analysis available"

"Risk findings will appear here after company documents are analyzed."

Include a clean visual structure that can later display real risk distribution data.

7. ACTIVITY

Create a "Recent Activity" section.

Do NOT create fake activity.

If there is no activity:

"No recent activity"

"Your due diligence activity will appear here."

Design the component so real activity can later be displayed from the backend.

8. COMPANY DETAILS PAGE

Create a separate frontend route/page for:

/companies/:id

This should represent a company due diligence workspace.

Header:

- Company name

- Industry

- Risk status

- "Generate Report" button

Do not hardcode a company name or risk status.

Use dynamic placeholders until real company data is loaded.

Sections:

Company Overview

Key Metrics

Documents

Risk Analysis

AI Insights

If information is unavailable, use appropriate empty states.

9. DOCUMENTS PAGE

Create:

/documents

Include:

- Upload Documents button

- Search

- Filter by document type

- Document table

Document types:

Financial

Legal

Commercial

Technical

Other

Columns:

Document

Type

Company

Uploaded

Status

Action

Do NOT add sample documents.

If there are no documents:

"No documents uploaded"

"Upload company documents to begin your due diligence analysis."

10. RISK ANALYSIS PAGE

Create:

/risks

Prepare the page for:

Overall Risk Score

High Risk

Medium Risk

Low Risk

Risk categories:

Financial Risk

Legal Risk

Commercial Risk

Operational Risk

Technology Risk

Do NOT provide fake scores, counts, risks, descriptions, or evidence.

If there is no analysis:

"No risk analysis available"

"Risk findings will appear here after documents have been analyzed."

Create reusable risk components that can later receive real API data.

11. REPORTS PAGE

Create:

/reports

Show the structure for generated reports with:

Company

Report Type

Generated Date

Risk Score

Status

Actions

Do NOT create fake reports.

If there are no reports:

"No reports generated"

"Complete your due diligence analysis to generate a report."

Include a "Generate Report" button.

12. EMPTY STATES

Create reusable, polished empty-state components.

Each should contain:

- Appropriate Lucide icon

- Title

- Description

- Primary action when applicable

Examples:

"No companies yet"

"No documents uploaded"

"No risk analysis available"

"No reports generated"

"No recent activity"

Keep empty states professional and visually consistent.

13. RESPONSIVENESS

Make the application responsive for:

- Desktop

- Laptop

- Tablet

- Mobile

On smaller screens:

- Collapse the sidebar

- Use mobile navigation

- Make tables horizontally scrollable where necessary

- Maintain proper spacing and readability

14. COMPONENT STRUCTURE

Keep the UI modular.

Create reusable components such as:

Sidebar

TopHeader

StatCard

QuickActionCard

CompanyTable

RiskBadge

RiskCard

ActivityList

EmptyState

Button

Modal

DocumentTable

ReportTable

Separate reusable components from page-level components.

15. DATA ARCHITECTURE

Do not create fake data files.

Instead, structure components to accept data through props or future API/service functions.

For example:

companies

documents

risks

reports

activities

should be passed into components dynamically.

When the data is empty, render the appropriate empty state.

16. FUTURE BACKEND COMPATIBILITY

Do not implement the APIs now.

However, structure the frontend so it can later consume:

GET /api/companies

POST /api/companies

GET /api/companies/:id

GET /api/documents

POST /api/documents

GET /api/risks

GET /api/reports

The UI should work correctly with empty datasets.

Later, real MongoDB data will replace the empty states.

17. VISUAL DESIGN

Use a sophisticated enterprise palette.

Primary:

Deep navy / slate

Background:

Very light neutral/slate

Cards:

White

Text:

Dark slate

Secondary text:

Muted slate

Semantic colors:

- Red for high risk

- Amber for medium risk

- Green for low risk

Keep semantic colors subtle and professional.

18. TYPOGRAPHY

Use a clear typography hierarchy:

- Strong page headings

- Medium section headings

- Clear labels

- Muted supporting text

- Consistent font weights

19. SPACING

Pay special attention to:

- Consistent padding

- Card spacing

- Sidebar spacing

- Section spacing

- Alignment

- Whitespace

The interface should feel spacious and premium without wasting screen space.

20. FINAL PRODUCT EXPERIENCE

The application should clearly communicate the workflow:

Add Company

↓

Upload Documents

↓

Analyze Information

↓

Identify Risks

↓

Generate Due Diligence Report

The final result should feel like a real production-quality enterprise SaaS application for investment and due diligence teams.

IMPORTANT FINAL REQUIREMENT:

Do not populate the interface with fictional companies, fictional financial information, fictional statistics, fictional risks, fictional reports, or fictional activity.

Build the polished UI and empty-state structure now.

Real data will be connected later through our Node.js/Express backend and MongoDB.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e908e993-e9c6-404a-9764-fd8fafe74c19).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
