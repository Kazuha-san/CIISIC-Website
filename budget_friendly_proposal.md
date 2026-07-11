# CIISIC Portal — Budget-Friendly Production Proposal
**Optimized Self-Hosted VPS Deployment Strategy for Lowest Monthly Cost**

---

## 1. Executive Summary

This document proposes a highly optimized deployment architecture designed to run the **CIISIC Portal** in production at the absolute lowest monthly running cost. 

By transitioning from fully managed, individual SaaS providers (such as Vercel Pro, Supabase Pro, and paid Upstash Redis) to a consolidated **Self-Hosted VPS (Virtual Private Server)** model, we can reduce the monthly running costs by **over 93%**—dropping from **₹8,881/month** to just **~₹568/month**—without compromising application speed, reliability, or security.

---

## 2. Architecture Comparison

### Managed SaaS Architecture (Expensive)
```mermaid
graph TD
    User([End Users]) -->|HTTP/HTTPS| Vercel[Vercel Serverless Hosting]
    Vercel -->|Prisma Client| Supabase[Managed Supabase Postgres]
    Vercel -->|Sentry SDK| Sentry[Sentry Error Tracking]
    Vercel -->|Redis Client| Upstash[Upstash Serverless Redis]
    Vercel -->|R2 SDK| R2[Cloudflare R2 File Storage]
    Vercel -->|SMTP| Resend[Resend Transactional Email]
```

### Proposed Self-Hosted Architecture (Budget-Friendly)
```mermaid
graph TD
    User([End Users]) -->|HTTPS| CF[Cloudflare CDN & DDoS Protection]
    CF -->|Reverse Proxy| Nginx[Nginx Web Server]
    subgraph Single India VPS (Hostinger / DigitalOcean)
        Nginx -->|Port 3000| PM2[Next.js App via PM2]
        PM2 -->|Local Connection| Postgres[(Local PostgreSQL DB)]
        PM2 -->|Local Connection| Redis[(Local Redis Cache)]
    end
    PM2 -->|Storage API| R2[Cloudflare R2 Free 10GB]
    PM2 -->|SMTP| Resend[Resend Free 3,000/mo]
    Postgres -.->|Daily Cron Backup| R2
```

---

## 3. Comparative Cost Analysis (INR / Month)

All pricing below includes standard Indian market factors such as **18% IGST** and **Forex Credit Card Markups (4%)** where applicable.

| Component | Managed SaaS Stack | Proposed Self-Hosted Stack | Saving / Month | Key Optimization |
| :--- | :---: | :---: | :---: | :--- |
| **App Server** | ₹2,038 *(Vercel Pro)* | **₹450** *(VPS)* | ₹1,588 | Consolidated onto VPS |
| **Database** | ₹2,546 *(Supabase Pro)* | **₹0** *(Local Postgres)* | ₹2,546 | Self-hosted database on VPS SSD |
| **Cache & Limits**| ₹407 *(Upstash Redis)* | **₹0** *(Local Redis)* | ₹407 | Run Redis container locally on VPS |
| **Logs & Errors** | ₹1,530 *(Sentry Team)* | **₹0** *(PM2 File Logging)* | ₹1,530 | Log files analyzed locally |
| **Email Delivery**| ₹2,038 *(Resend Paid)* | **₹0** *(Resend Free)* | ₹2,038 | Stay on free tier (3,000 emails/mo) |
| **File Storage** | ₹204 *(R2 Paid)* | **₹0** *(R2 Free)* | ₹204 | Limit files/size to stay under 10 GB |
| **Domain Name** | ₹118 *(Annual / 12)* | **₹118** *(Annual / 12)* | ₹0 | Custom `.in` domain |
| **Total / Month** | **₹8,881** | **~₹568** | **₹8,313 (93.6% Off)**| |

---

## 4. Hardware Selection (Recommended VPS Providers)

To keep costs minimal while ensuring low latency for Indian users, we recommend selecting an **India region (Mumbai or Bangalore)** server with at least **2 GB RAM** and **1 vCPU**.

1. **Hostinger India (KVM 2 Plan)**
   * **Price:** ~₹380 - ₹450 / month (depending on billing cycle)
   * **Specs:** 1 vCPU, 2 GB RAM, 50 GB NVMe SSD, 2 TB Bandwidth.
   * **Location:** India (Mumbai) data center.
2. **DigitalOcean (Basic Droplet)**
   * **Price:** $6.00 / month (~₹500 / month)
   * **Specs:** 1 vCPU, 1 GB RAM, 25 GB SSD, 1 TB Bandwidth.
   * **Location:** Bangalore data center.

---

## 5. Step-by-Step Production Setup Plan

### Phase 1: VPS Configuration
1. Spin up an **Ubuntu 22.04 / 24.04 LTS** server on the chosen VPS provider.
2. Update system packages and install essential utilities:
   ```bash
   sudo apt update && sudo apt upgrade -y
   sudo apt install -y curl git build-essential nginx
   ```
3. Install **Node.js 20 LTS** and **PM2** globally:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs
   sudo npm install --global pm2
   ```

### Phase 2: Database & Redis Configuration
1. Install **PostgreSQL 16**:
   ```bash
   sudo apt install -y postgresql postgresql-contrib
   ```
2. Secure the PostgreSQL database, create a production user, and set up your database schema:
   ```bash
   sudo -i -u postgres psql
   # CREATE DATABASE ciisic;
   # CREATE USER cii_user WITH PASSWORD 'SecurePassword123';
   # GRANT ALL PRIVILEGES ON DATABASE ciisic TO cii_user;
   # \q
   ```
3. Install **Redis** for sessions and rate limiting:
   ```bash
   sudo apt install -y redis-server
   sudo systemctl enable redis-server.service
   ```

### Phase 3: Application Deployment
1. Clone the repository into `/var/www/ciisic`.
2. Create the production `.env` file pointing to the local PostgreSQL and Redis databases:
   ```env
   DATABASE_URL="postgresql://cii_user:SecurePassword123@localhost:5432/ciisic?schema=public"
   DIRECT_URL="postgresql://cii_user:SecurePassword123@localhost:5432/ciisic?schema=public"
   NEXTAUTH_SECRET="REPLACE_WITH_YOUR_32_CHAR_RANDOM_SECRET"
   NEXTAUTH_URL="https://yourdomain.in"
   ```
3. Build the application and run migrations:
   ```bash
   npm install
   npx prisma migrate deploy
   npm run build
   ```
4. Start the Next.js production server with PM2:
   ```bash
   pm2 start npm --name "ciisic-backend" -- start
   pm2 save
   pm2 startup
   ```

### Phase 4: Nginx Proxy & Cloudflare SSL
1. Configure Nginx to forward port 80 traffic to Next.js (`http://localhost:3000`):
   ```nginx
   server {
       listen 80;
       server_name yourdomain.in www.yourdomain.in;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
2. Enable Nginx configuration and point your domain's nameservers to Cloudflare.
3. Enable Cloudflare's **Flexible SSL** (or run `certbot` on the server for Full SSL).

---

## 6. Maintenance & Backup Strategy (Zero Cost)

To replace expensive automated managed backups, set up a simple script (`/root/backup.sh`) running via a daily cron job:

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/postgres"
DATE=$(date +%Y-%m-%d)
FILENAME="ciisic_backup_$DATE.sql"

# Create backup directory if not exists
mkdir -p $BACKUP_DIR

# Export database
PGPASSWORD="SecurePassword123" pg_dump -U cii_user -h localhost -d ciisic > $BACKUP_DIR/$FILENAME

# Compress backup
gzip $BACKUP_DIR/$FILENAME

# Upload to Cloudflare R2 bucket using AWS CLI (Free egress/ingress)
aws s3 cp $BACKUP_DIR/$FILENAME.gz s3://ciisic-backups/database/ --endpoint-url https://<your-cf-account-id>.r2.cloudflarestorage.com

# Delete backups older than 7 days from local disk
find $BACKUP_DIR -type f -mtime +7 -name "*.gz" -delete
```
This guarantees that even on a cheap server, your data is **completely safe and restorable** in case of server failure.
