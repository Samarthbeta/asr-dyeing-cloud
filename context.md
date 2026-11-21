# ASR Dyeing Cloud ERP - Architecture & System State

**System**: Mohinder Dyeing & Finishing House / ASR Dyeing Solutions (Ludhiana, Punjab)  
**GSTIN**: `03ACDFM5024D1ZV` | **Domain**: Dual-Inventory Textile Processing ERP (Customer Fabric WIP vs. Owned Chemicals)  
**Production Live URL**: [https://asr-dyeing-cloud.vercel.app](https://asr-dyeing-cloud.vercel.app)  
**Cloudflare API**: [https://asr-dyeing-api.asrdyeing.workers.dev](https://asr-dyeing-api.asrdyeing.workers.dev)  
**GitHub Repository**: [https://github.com/Samarthbeta/asr-dyeing-cloud](https://github.com/Samarthbeta/asr-dyeing-cloud) (Branch: `master`)

---

## 1. Enterprise Tech-Giant Architecture Implementations

| Feature / Upgrade | Tech Giant Inspiration | Implementation & Files |
|---|---|---|
| **Global Command Palette** | **Linear / Superhuman** | `src/components/CommandPalette.jsx` (Global `Ctrl+K` modal, fuzzy lot & party search, direct module actions) |
| **Vessel SCADA Live Telemetry** | **Datadog / Palantir / Siemens** | `src/components/VesselTelemetryModal.jsx` (Reactive 6-stage temperature curve $30^\circ\text{C} \rightarrow 130^\circ\text{C}$, bath pH, pressure, RPM) |
| **Thermal 4"×2" Roll QR Barcoding** | **Zebra / Procore / Avery Dennison** | `src/components/RollQrModal.jsx` (Industrial barcode/QR stickers for takas upon scale weighbridge inward) |
| **Immutable Event-Sourcing Audit Log** | **Stripe / AWS CloudTrail** | `src/components/AuditTrailModal.jsx` (Cryptographic event history for IGR, batches, dispatches, gate passes with CSV export) |
| **Role-Based Access Control (RBAC)** | **Retool / Salesforce** | `src/components/Navbar.jsx` (Mill Owner / GM, Dyeing Master, Weighbridge Clerk, Billing Accountant) |
| **Strict Zero-Inline-Secrets Gate** | **HashiCorp / Defense-in-Depth** | Pre-commit hook in `~/.git-templates/hooks/pre-commit` backed by `check_secrets.py` aborting commits on raw secret patterns |

---

## 2. Core Textile Domain Modules

1. **Grey Inward (IGR)**: Scale weighbridge receipt, multi-lot roll entry, automated lot numbering (`LOT-26-XXXX`), printable inward receipt.
2. **Job Card Batching**: Soft Flow & Jet vessel capacity scheduling, automated liquor ratio water bath ($M:L$), machine floor dispense slips.
3. **Recipe Engine**: Precision laboratory dosing (% o.w.f. dyes, g/L bath chemicals), dynamic recipe cost-per-KG calculator.
4. **Floor WIP & Outsourcing Passes**: 5-stage Kanban pipeline, Returnable (RGP) and Non-Returnable (NRGP) gate passes.
5. **Dispatch & Shrinkage**: Customer delivery notes, automated process loss % calculator with $>6\%$ high-shrinkage alerts.
6. **Billing & Invoicing**: Punjab SAC `9988` GST invoicing with CGST/SGST (5%) or Interstate IGST (5%), 5-tier fallback rate matrix.
7. **Cloud Persistence**: Zero-secret cloud synchronization with Supabase PostgreSQL 17 and Cloudflare Edge Worker.
