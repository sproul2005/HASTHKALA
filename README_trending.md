# HASTHKALA Trending Setup Guide

## Current Status ✅
- Home auto-loads 8 trending products
- Admin toggle works
- No blank page (logic fallback)

## Remove Seeder Data (Original Products)
```
cd backend
node seeder.js -d
```
Deletes ALL users/products.

## Revert Seeder to Original (No Trending Products)
Replace `backend/seeder.js` products array with original (remove Array.from trending products).

## Manual Trending Management (Recommended)
1. Admin → Products → Toggle `isTrending` on first 8 products
2. Home shows those 8
3. New trending → Toggle OFF oldest → Toggle ON new = FIFO 8

**Production Ready** - No seeder dependency!
