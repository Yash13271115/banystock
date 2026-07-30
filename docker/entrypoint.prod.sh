#!/bin/sh
set -e

# Wait for Database connection if configured
if [ -n "$DB_HOST" ]; then
    echo "Waiting for database host ($DB_HOST)..."
    until nc -z -v -w30 "$DB_HOST" "${DB_PORT:-3306}"; do
        echo "Waiting for database connection..."
        sleep 2
    done
fi

# Ensure storage directories exist and have proper permissions
mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views storage/logs bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

# Ensure clean bootstrap cache before optimizing
rm -f bootstrap/cache/config.php bootstrap/cache/routes-v7.php bootstrap/cache/packages.php bootstrap/cache/services.php

# Run optimizations
echo "Caching Laravel configuration and routes..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# Run database migrations
echo "Running database migrations..."
php artisan migrate --force

# Ensure storage link exists
php artisan storage:link --force || true

# Start Supervisor (which manages PHP-FPM and Nginx) or start PHP-FPM + Nginx
echo "Starting production server..."
php-fpm -D
exec nginx -g 'daemon off;'
