-- Migration: add estado_manual column to rooms table
-- Run this in Railway PostgreSQL console before deploying
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS estado_manual VARCHAR(20);
