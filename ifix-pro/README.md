
# iFix Pro - Warehouse Monitoring System

## 🚀 Quick Start Deployment

### 1. Supabase Setup (Database)
1. Open your [Supabase SQL Editor](https://supabase.com/dashboard/project/bsmzgkacesgicujijzex/sql/new).
2. Run the following SQL to create your tables:

```sql
create table master_inventory (
  imei text primary key,
  model text,
  capacity text,
  color text,
  created_at timestamp with time zone default now()
);

create table repair_records (
  id uuid primary key default gen_random_uuid(),
  reference_no text,
  technician text,
  imei text,
  services text[],
  status text,
  device jsonb,
  created_at bigint,
  received_at bigint
);
```

### 2. Vercel Environment Variables
Add these keys in your Vercel Project Settings:

| Key | Value |
| :--- | :--- |
| `SUPABASE_URL` | `https://bsmzgkacesgicujijzex.supabase.co` |
| `SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzbXpna2FjZXNnaWN1amlqemV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0NTgzOTksImV4cCI6MjA4MzAzNDM5OX0.aFnvDlmSfwPXF7CrwekbqiZXzNH0kGP91UjzB9G5VKA` |
| `API_KEY` | `AIzaSyAI-5UuHs4yvErN2o44WqCK-N2-nz1wcIw` |

## 📱 Features
- **Buy a Phone:** Bulk upload your stock directly from Excel.
- **Repair Request:** Assign units to technicians (Ali, Erfan, etc.).
- **Repair Receive:** Scan units back into stock with automatic status updates (Opened, Closed, Reworked).
- **History:** Search any IMEI to see its full repair lifecycle.
- **Data:** Export your performance reports to CSV.
