#!/data/data/com.termux/files/usr/bin/bash

set -e

PROJECT_DIR=$(pwd)

echo "🚀 Laravel Termux Bootstrap"

# نصب پکیج‌ها در صورت نبودن
for pkg in php composer git sqlite; do
    if ! command -v $pkg >/dev/null 2>&1; then
        echo "📦 Installing $pkg ..."
        pkg install -y $pkg
    fi
done

# نصب vendor فقط بار اول
if [ ! -d "vendor" ]; then
    echo "📦 Running composer install ..."
    composer install --no-interaction
fi

# ساخت env فقط بار اول
if [ ! -f ".env" ]; then
    echo "⚙️ Creating .env ..."
    cp .env.example .env
fi

# APP_KEY فقط اگر خالی باشد
if ! grep -q "^APP_KEY=base64:" .env; then
    echo "🔑 Generating APP_KEY ..."
    php artisan key:generate --force
fi

# SQLite فقط بار اول
mkdir -p database

if [ ! -f "database/database.sqlite" ]; then
    echo "🗄️ Creating SQLite database ..."
    touch database/database.sqlite
fi

# تنظیم sqlite
sed -i 's/^DB_CONNECTION=.*/DB_CONNECTION=sqlite/' .env

if grep -q '^QUEUE_CONNECTION=' .env; then
    sed -i 's/^QUEUE_CONNECTION=.*/QUEUE_CONNECTION=database/' .env
else
    echo "QUEUE_CONNECTION=database" >> .env
fi

# جدول صف فقط بار اول
if ! php artisan migrate:status >/dev/null 2>&1; then
    php artisan queue:table || true
fi

echo "🗄️ Running migrations ..."
php artisan migrate --force

# توقف Worker قبلی
pkill -f "artisan queue:work" 2>/dev/null || true

# اجرای Worker
echo "⚙️ Starting Queue Worker ..."
nohup php artisan queue:work \
    --sleep=3 \
    --tries=3 \
    > storage/logs/queue.log 2>&1 &

# پیدا کردن IP
IP=$(ip route get 1.1.1.1 2>/dev/null | awk '{print $7; exit}')

echo ""
echo "====================================="
echo "Laravel Started"
echo "====================================="
echo "Local:"
echo "http://127.0.0.1:8000"

if [ ! -z "$IP" ]; then
    echo "Hotspot/LAN:"
    echo "http://$IP:8000"
fi

echo "====================================="

php artisan serve \
    --host=0.0.0.0 \
    --port=8000