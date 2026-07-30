#!/bin/sh
set -e

# Wait for Database if host is set
if [ -n "$DB_HOST" ]; then
    echo "Waiting for database host ($DB_HOST)..."
    until nc -z -v -w30 "$DB_HOST" "${DB_PORT:-3306}"; do
        echo "Waiting for database connection..."
        sleep 2
    done
fi

# Ensure composer dependencies are installed
if [ ! -d "vendor" ]; then
    echo "Installing Composer dependencies..."
    composer install --no-interaction
fi

# Ensure npm dependencies are installed
if [ ! -f "node_modules/.bin/vite" ]; then
    echo "Installing NPM dependencies..."
    npm install
fi

# Ensure .env exists
if [ ! -f ".env" ]; then
    echo "Copying .env.example to .env..."
    cp .env.example .env
    php artisan key:generate
fi

# Set proper directory permissions
mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views storage/logs bootstrap/cache
chmod -R 777 storage bootstrap/cache

# Run database migrations
echo "Running database migrations..."
php artisan migrate --force

# Seed the database (creates initial admin user)
echo "Seeding database..."
php artisan db:seed --force

echo "Starting Vite dev server in background..."
npm run dev -- --host 0.0.0.0 &

echo "Starting Octane with FrankenPHP and Queue worker..."
exec composer dev
