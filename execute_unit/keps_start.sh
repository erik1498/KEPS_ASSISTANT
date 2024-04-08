#!/bin/bash

# Menampilkan pesan sambutan
echo "Selamat datang di KEPS ASSISTANT!"

docker compose start && pnpm run start

read -p "Aplikasi KEPS ASSISTANT anda sudah siap"
