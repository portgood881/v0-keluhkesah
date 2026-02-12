# Panduan Deployment Keluh Kesah ke Shared Hosting

## Prerequisites
- Domain: keluhkesah.cc
- Shared Hosting dengan Node.js support (atau cPanel dengan Node.js manager)
- Database: Neon PostgreSQL (cloud-hosted)
- Git access (optional, untuk auto-deploy)

## Step-by-Step Deployment

### 1. Persiapan Lokal

```bash
# Install dependencies
npm install

# Build aplikasi
npm run build

# Test production build
npm run start
```

### 2. Setup Database (Neon PostgreSQL)

1. Buat akun di [neon.tech](https://neon.tech)
2. Buat project baru dengan database name: `keluhkesah`
3. Copy connection string dan simpan di tempat aman
4. Jalankan migrations:

```bash
# Set DATABASE_URL
export DATABASE_URL="postgresql://user:password@region.neon.tech/keluhkesah"

# Run migrations
npx prisma migrate deploy
```

### 3. Konfigurasi Environment Variables

1. Buat file `.env.production.local` di root project
2. Copy dari `.env.production.example`
3. Fill in semua variable yang diperlukan:

```
DATABASE_URL=postgresql://...
NEXT_PUBLIC_ANALYTICS_URL=https://...
NEXT_PUBLIC_ANALYTICS_ID=...
```

**PENTING:** Jangan commit `.env.production.local`

### 4. Upload ke Shared Hosting

#### Opsi A: Menggunakan cPanel File Manager

1. Build project:
```bash
npm run build
```

2. Siapkan folder untuk upload:
```
- .next/ (folder dari build)
- public/
- node_modules/
- package.json
- package-lock.json
- next.config.ts
- tsconfig.json
- .env.production.local
```

3. Compress dan upload ke hosting
4. Extract di folder domain Anda

#### Opsi B: Menggunakan Git + SSH

1. Push code ke GitHub:
```bash
git push origin master
```

2. SSH ke hosting:
```bash
ssh user@keluhkesah.cc
cd /home/user/public_html
git clone https://github.com/sevensvelte/keluhkesah.git
cd keluhkesah
```

3. Install dan build:
```bash
npm install --production
npm run build
```

### 5. Konfigurasi Node.js Server

#### Opsi A: PM2 (Recommended)

1. Install PM2 globally:
```bash
npm install -g pm2
```

2. Buat `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'keluhkesah',
    script: 'npm run start',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    error_file: './logs/error.log',
    out_file: './logs/out.log',
  }],
};
```

3. Start aplikasi:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### Opsi B: Service Manager (Systemd)

1. Buat `/etc/systemd/system/keluhkesah.service`:
```ini
[Unit]
Description=Keluh Kesah Node.js App
After=network.target

[Service]
Type=simple
User=nobody
WorkingDirectory=/home/user/public_html/keluhkesah
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=10
StandardOutput=append:/var/log/keluhkesah/out.log
StandardError=append:/var/log/keluhkesah/error.log
Environment="NODE_ENV=production"

[Install]
WantedBy=multi-user.target
```

2. Enable dan start:
```bash
sudo systemctl daemon-reload
sudo systemctl enable keluhkesah
sudo systemctl start keluhkesah
```

### 6. Konfigurasi Reverse Proxy (Nginx/Apache)

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name keluhkesah.cc www.keluhkesah.cc;
    
    # Redirect HTTP to HTTPS
    return 301 https://keluhkesah.cc$request_uri;
}

server {
    listen 443 ssl http2;
    server_name keluhkesah.cc;
    
    # SSL Certificate (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/keluhkesah.cc/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/keluhkesah.cc/privkey.pem;
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
    
    # Cache static files
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Proxy ke Node.js app
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Apache Configuration

```apache
<VirtualHost *:443>
    ServerName keluhkesah.cc
    ServerAlias www.keluhkesah.cc
    
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/keluhkesah.cc/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/keluhkesah.cc/privkey.pem
    
    # Enable mod_proxy
    ProxyPreserveHost On
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
    
    # Gzip compression
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
    </IfModule>
    
    # Cache headers
    <IfModule mod_expires.c>
        ExpiresActive On
        ExpiresByType image/jpeg "access plus 1 year"
        ExpiresByType image/gif "access plus 1 year"
        ExpiresByType image/png "access plus 1 year"
        ExpiresByType text/css "access plus 1 month"
        ExpiresByType application/javascript "access plus 1 month"
    </IfModule>
</VirtualHost>

# Redirect HTTP to HTTPS
<VirtualHost *:80>
    ServerName keluhkesah.cc
    ServerAlias www.keluhkesah.cc
    Redirect permanent / https://keluhkesah.cc/
</VirtualHost>
```

### 7. Setup SSL Certificate (Let's Encrypt)

Jika using cPanel:
1. Go to AutoSSL di cPanel
2. Select domain keluhkesah.cc
3. Click "Run AutoSSL"

Jika using CLI:
```bash
sudo certbot certonly --webroot -w /home/user/public_html -d keluhkesah.cc -d www.keluhkesah.cc
```

### 8. Update DNS & Domain Settings

1. Point domain ke IP server shared hosting
2. Wait for DNS propagation (up to 48 hours)
3. Verify SSL dengan:
```bash
curl -I https://keluhkesah.cc
```

## Performance Optimization

### 1. Image Optimization
- Images sudah dioptimasi dengan Next.js Image component
- Pastikan `/public/keluhkesah.png` sudah WebP format

### 2. Database Optimization
```sql
-- Create indexes untuk improve query speed
CREATE INDEX idx_posts_timestamp ON posts(timestamp DESC);
CREATE INDEX idx_comments_postid ON comments(postId);
CREATE INDEX idx_comments_timestamp ON comments(timestamp DESC);
```

### 3. Caching Strategy
- Static files (CSS, JS, images): Cache 1 year
- HTML pages: Cache 1 day
- API responses: Cache 5 minutes (opsional)

### 4. Monitoring & Logs

Check logs:
```bash
# PM2 logs
pm2 logs keluhkesah

# System logs
tail -f /var/log/keluhkesah/error.log
tail -f /var/log/keluhkesah/out.log
```

## Troubleshooting

### 1. Koneksi Database Gagal
```bash
# Verify CONNECTION STRING
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL
```

### 2. Port Already in Use
```bash
lsof -i :3000
kill -9 <PID>
```

### 3. Out of Memory
- Upgrade shared hosting plan
- Atau enable Node.js clustering di PM2

### 4. Slow Performance
- Check database query performance
- Enable caching headers
- Optimize images

## Maintenance

### Regular Tasks
- Monitor error logs weekly
- Check database size monthly
- Update dependencies quarterly
- Backup database regularly

### Database Backup
```bash
# Manual backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Automated (cron job)
0 3 * * * pg_dump $DATABASE_URL > /backup/$(date +\%Y\%m\%d).sql
```

### Update Dependencies
```bash
npm update
npm run build
npm run start
```

## Checklist Sebelum Launch

- [x] Database (Neon) sudah setup
- [x] Environment variables sudah dikonfigurasi
- [x] SSL certificate sudah installed
- [x] Node.js server sudah running
- [x] Reverse proxy sudah configured
- [x] Domain pointing ke hosting
- [x] Analytics script sudah active
- [x] Rate limiting sudah enabled
- [x] Backups sudah scheduled
- [x] Monitoring & alerts sudah setup
- [x] SEO meta tags sudah optimize

## Support & Help

- Dokumentasi Next.js: https://nextjs.org/docs
- Neon Docs: https://neon.tech/docs
- Prisma Docs: https://www.prisma.io/docs

---

**Status:** Ready for Production
**Last Updated:** January 2025
