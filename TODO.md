# Trending Feature Implementation Plan

## Status: In Progress

### Step 1: [x] Update Product model (add isTrending field)
- File: backend/src/models/Product.js

### Step 2: [x] Update backend product.controller.js (trending filter, dynamic limit)
- Handle ?trending=true (filter isTrending: true)
- Dynamic limit from ?limit= param (default 8)
- File: backend/src/controllers/product.controller.js
- Possibly backend/src/utils/apiFeatures.js

### Step 3: [x] Read and update AdminProductForm.jsx (add isTrending checkbox)
- File: frontend/src/pages/admin/AdminProductForm.jsx

### Step 4: [x] Update Home.jsx (Trending bubble, fetch logic with limit=8 & trending=true)
- Change first bubble to 'Trending'
- Fetch logic: if category==='trending' use trending=true&limit=8 else category&limit=8
- File: frontend/src/pages/Home.jsx

### Step 5: [x] Update Shop.jsx (category fetch with limit=1000 for ALL products)
- For category: ?category=xxx&limit=1000 (all products)
- File: frontend/src/pages/Shop.jsx

### Step 6: [x] Update AdminProducts.jsx (fetch with limit=1000 for ALL products)
- Fetch ?limit=1000 to show ALL products
- File: frontend/src/pages/admin/AdminProducts.jsx

### Step 7: [ ] Test backend (restart server)
- cd backend && npm start

### Step 8: [ ] Manual test: Admin create products, set some trending=true, verify Home/Shop/Admin displays

**All code changes complete. Next:** Backend restart + manual testing via admin (Step 7-8)

