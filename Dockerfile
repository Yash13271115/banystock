# ===================================================
# Stage 1: Composer dependencies
# ===================================================
FROM composer:2 AS vendor-builder
WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist --no-interaction --ignore-platform-reqs

COPY app/ ./app/
COPY bootstrap/ ./bootstrap/
COPY config/ ./config/
COPY database/ ./database/
COPY routes/ ./routes/
COPY artisan ./

RUN composer dump-autoload --optimize --no-dev --no-scripts

# ===================================================
# Stage 2: Production runtime — FrankenPHP / Octane
# (same base as Dockerfile.dev, so prod matches the
#  Octane semantics the app is actually written for)
# ===================================================
FROM dunglas/frankenphp:1-php8.4-alpine AS production
WORKDIR /var/www/html

RUN install-php-extensions \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    intl \
    zip \
    opcache \
    redis

RUN apk add --no-cache bash curl netcat-openbsd

RUN { \
    echo "opcache.memory_consumption=128"; \
    echo "opcache.interned_strings_buffer=8"; \
    echo "opcache.max_accelerated_files=10000"; \
    echo "opcache.revalidate_freq=0"; \
    echo "opcache.validate_timestamps=0"; \
    } > /usr/local/etc/php/conf.d/opcache-prod.ini

COPY . /var/www/html
COPY --from=vendor-builder /app/vendor /var/www/html/vendor

COPY docker/entrypoint.prod.sh /usr/local/bin/entrypoint.prod.sh
RUN chmod +x /usr/local/bin/entrypoint.prod.sh

RUN rm -f /var/www/html/public/hot \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 8000
ENTRYPOINT ["/usr/local/bin/entrypoint.prod.sh"]
