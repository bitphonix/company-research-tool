# API_SPEC.md — Exact API Contracts

## Base URL
`http://localhost:8000`

---

## POST /api/research

Kicks off AI agent research for a company. Streams results via SSE.

### Request
```
Content-Type: application/json

{
  "company_name": "Stripe"
}
```

### Validation
- `company_name` must be non-empty string after stripping whitespace
- `company_name` must be between 2–100 characters
- Return 400 if invalid

### Response
```
Content-Type: text/event-stream
Cache-Control: no-cache
X-Accel-Buffering: no
```

### SSE Event Types

#### status — progress update
Sent before each section begins researching.
```
event: status
data: {"message": "Researching company overview..."}

event: status
data: {"message": "Finding key people..."}

event: status
data: {"message": "Gathering recent news..."}

event: status
data: {"message": "Pulling financial highlights..."}

event: status
data: {"message": "Analyzing risk factors..."}
```

#### section — completed section data
Sent when a section is fully researched and ready.
```
event: section
data: {"section": "overview", "content": "Stripe is a financial infrastructure..."}

event: section
data: {"section": "key_people", "content": [{"name": "Patrick Collison", "title": "CEO"}, ...]}

event: section
data: {"section": "news", "content": ["Stripe launched...","Stripe raised..."]}

event: section
data: {"section": "financials", "content": {"revenue": "$14B", "employee_count": "8,000+", "market_cap": null, "yoy_growth": "~25%"}}

event: section
data: {"section": "risks", "content": ["Heavy regulatory scrutiny...", "Competition from..."]}
```

#### done — research complete, report saved
```
event: done
data: {"report_id": 42}
```

#### error — something went wrong
```
event: error
data: {"message": "Unable to research this company. Please try again."}
```

### Error Responses (non-SSE)
| Code | When |
|---|---|
| 400 | Invalid or empty company name |
| 500 | Unexpected server error before stream starts |

---

## GET /api/reports

Returns list of all saved reports, newest first.

### Response 200
```json
[
  {
    "id": 42,
    "company_name": "Stripe",
    "created_at": "2025-04-30T10:23:00Z"
  },
  {
    "id": 41,
    "company_name": "Notion",
    "created_at": "2025-04-30T09:10:00Z"
  }
]
```

Returns `[]` if no reports exist. Never 404.

---

## GET /api/reports/{id}

Returns full report with all sections.

### Response 200
```json
{
  "id": 42,
  "company_name": "Stripe",
  "created_at": "2025-04-30T10:23:00Z",
  "sections": {
    "overview": "Stripe is a financial infrastructure platform...",
    "key_people": [
      { "name": "Patrick Collison", "title": "CEO" },
      { "name": "John Collison", "title": "President" }
    ],
    "news": [
      "Stripe launched Stablecoin payments in March 2025",
      "Stripe acquired Bridge for $1.1B"
    ],
    "financials": {
      "revenue": "$14B",
      "employee_count": "8,000+",
      "market_cap": null,
      "yoy_growth": "~25%"
    },
    "risks": [
      "Facing increasing regulatory scrutiny in EU payments",
      "Intense competition from Adyen and Block"
    ]
  }
}
```

### Response 404
```json
{ "detail": "Report not found" }
```

---

## DELETE /api/reports/{id}

Deletes a report and all its sections (CASCADE).

### Response 204
No body.

### Response 404
```json
{ "detail": "Report not found" }
```

---

## GET /api/health

### Response 200
```json
{ "status": "ok" }
```

---

## Section Data Types (canonical)

| Section | Type | Notes |
|---|---|---|
| `overview` | `string` | Prose briefing, 2–4 sentences |
| `key_people` | `Array<{name: string, title: string}>` | Max 6 people |
| `news` | `Array<string>` | 3–4 bullet strings |
| `financials` | `{revenue, employee_count, market_cap, yoy_growth}` | Null fields allowed, never fabricate |
| `risks` | `Array<string>` | 2–3 bullet strings |

## Content field in SSE
The `content` field in section events is always JSON — parse it on the frontend.
- Strings: `"content": "plain text"`
- Arrays: `"content": ["item1", "item2"]`
- Objects: `"content": {"key": "value"}`

All section content stored in DB as JSON string. Deserialize on GET /api/reports/{id}.