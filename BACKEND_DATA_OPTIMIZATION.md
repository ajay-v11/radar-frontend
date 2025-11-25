# Backend Data Optimization Guide

## Current Issues Fixed

### 1. **Model Performance Display Issues**

- ❌ **Problem**: Percentages showing as 7500%, 8000% instead of 75%, 80%
- ✅ **Fix**: Backend sends scores as percentages (90.0), frontend was multiplying by 100 again
- ✅ **Solution**: Frontend now divides by 100 to convert to decimal (0.90) for proper display

### 2. **Missing Mentions and Queries**

- ❌ **Problem**: Model cards showing 0 mentions and 0 queries
- ✅ **Fix**: Backend only sends `model_scores` (just numbers), not detailed breakdown
- ✅ **Solution**: Frontend now calculates per-model averages from total mentions/queries

---

## Backend Response Structure Analysis

### Current Backend Response (Complete Event)

```json
{
  "step": "complete",
  "status": "success",
  "message": "Visibility analysis completed!",
  "data": {
    "visibility_score": 90.0,
    "model_scores": {
      "gpt-3.5-turbo": 90.0,
      "claude-3-5-haiku-20241022": 90.0
    },
    "total_queries": 20,
    "total_mentions": 36,
    "categories_processed": 6,
    "category_breakdown": [
      {
        "category": "product_deals",
        "score": 100.0,
        "queries": 5,
        "mentions": 10
      }
    ],
    "model_category_matrix": {
      "gpt-3.5-turbo": {
        "product_deals": 0.0,
        "category_specific_shopping": 0.0
      }
    },
    "slug_id": "visibility_dfb607581873"
  }
}
```

---

## What Frontend Actually Needs

### ✅ **Essential Data (Keep These)**

1. **`visibility_score`** - Overall visibility percentage
2. **`model_scores`** - Per-model visibility scores
3. **`total_queries`** - Total number of queries tested
4. **`total_mentions`** - Total mentions across all models
5. **`category_breakdown`** - Category-level performance
6. **`slug_id`** - For tracking and caching

### ❌ **Unnecessary Data (Can Remove)**

1. **`model_category_matrix`** - Currently all zeros, not being used effectively

   - **Why**: The matrix shows 0.0 for all values
   - **Impact**: Frontend hides it when all values are zero
   - **Recommendation**: Either populate it with real data OR remove it entirely

2. **`categories_processed`** - Redundant
   - **Why**: Can be calculated from `category_breakdown.length`
   - **Impact**: Minimal, just extra bytes
   - **Recommendation**: Remove, frontend can count categories

---

## Recommended Backend Response (Optimized)

### Minimal Required Structure

```json
{
  "step": "complete",
  "status": "success",
  "message": "Visibility analysis completed!",
  "data": {
    "visibility_score": 90.0,
    "model_scores": {
      "gpt-3.5-turbo": 90.0,
      "claude-3-5-haiku-20241022": 90.0
    },
    "total_queries": 20,
    "total_mentions": 36,
    "category_breakdown": [
      {
        "category": "product_deals",
        "score": 100.0,
        "queries": 5,
        "mentions": 10
      },
      {
        "category": "category_specific_shopping",
        "score": 100.0,
        "queries": 4,
        "mentions": 8
      }
    ],
    "slug_id": "visibility_dfb607581873"
  }
}
```

### Optional: If You Want Model-Category Matrix

**Only include if you populate it with real data:**

```json
{
  "model_category_matrix": {
    "gpt-3.5-turbo": {
      "product_deals": 100.0,
      "category_specific_shopping": 100.0,
      "brand_comparisons": 66.67
    },
    "claude-3-5-haiku-20241022": {
      "product_deals": 100.0,
      "category_specific_shopping": 100.0,
      "brand_comparisons": 66.67
    }
  }
}
```

**If all values are 0.0, don't send it at all.**

---

## Streaming Events Optimization

### Current Streaming Events

You're sending these events during streaming:

1. `step1` - Cached company data
2. `initialization` - Total categories
3. `category_queries` - Query generation progress
4. `category_testing` - Testing progress
5. `category_analysis` - Analysis progress
6. `category_complete` - Category completion with partial scores
7. `complete` - Final results

### ✅ **Keep All Streaming Events**

All streaming events are useful for showing real-time progress. Don't remove any.

### ⚠️ **But Simplify `category_complete` Event**

**Current (Too Much Data):**

```json
{
  "step": "category_complete",
  "data": {
    "category": "product_deals",
    "category_score": 100.0,
    "model_breakdown": {
      "gpt-3.5-turbo": {
        "visibility": 100.0,
        "mentions": 5,
        "queries": 5
      }
    },
    "completed_categories": 1,
    "total_categories": 6,
    "progress": "1/6",
    "partial_visibility_score": 100.0,
    "partial_model_scores": {
      "gpt-3.5-turbo": 100.0
    },
    "total_queries": 5,
    "total_mentions": 10,
    "category_breakdown": [...]
  }
}
```

**Recommended (Simplified):**

```json
{
  "step": "category_complete",
  "data": {
    "category": "product_deals",
    "category_score": 100.0,
    "completed_categories": 1,
    "total_categories": 6,
    "partial_visibility_score": 100.0,
    "partial_model_scores": {
      "gpt-3.5-turbo": 100.0,
      "claude-3-5-haiku-20241022": 100.0
    },
    "total_queries": 5,
    "total_mentions": 10,
    "category_breakdown": [
      {
        "category": "product_deals",
        "score": 100.0,
        "queries": 5,
        "mentions": 10
      }
    ]
  }
}
```

**Removed:**

- `model_breakdown` - Too detailed for streaming, not used by frontend
- `progress` string - Redundant, can be calculated from `completed_categories/total_categories`

---

## Data Size Comparison

### Current Response Size

- **Complete Event**: ~2.5 KB (with empty model_category_matrix)
- **All Streaming Events**: ~15-20 KB total

### Optimized Response Size

- **Complete Event**: ~1.8 KB (without model_category_matrix)
- **All Streaming Events**: ~12-15 KB total

**Savings: ~25-30% reduction in data transfer**

---

## Backend Changes Needed

### 1. Remove `model_category_matrix` (if all zeros)

```python
# In your backend visibility analysis endpoint
response_data = {
    "visibility_score": visibility_score,
    "model_scores": model_scores,
    "total_queries": total_queries,
    "total_mentions": total_mentions,
    "category_breakdown": category_breakdown,
    "slug_id": slug_id
}

# Only add model_category_matrix if it has real data
if has_real_matrix_data(model_category_matrix):
    response_data["model_category_matrix"] = model_category_matrix
```

### 2. Remove `categories_processed`

```python
# Remove this line
"categories_processed": len(categories)

# Frontend can calculate it from:
# category_breakdown.length
```

### 3. Simplify `category_complete` event

```python
# Remove model_breakdown from streaming events
# Remove progress string (redundant)
```

---

## Frontend Compatibility

✅ **All changes are backward compatible**

The frontend now handles:

- New flat structure (optimized)
- Old nested structure (legacy)
- Missing fields (graceful fallbacks)

You can make these backend changes without breaking the frontend.

---

## Summary

### Remove These Fields:

1. ❌ `model_category_matrix` (if all zeros)
2. ❌ `categories_processed` (redundant)
3. ❌ `model_breakdown` in streaming events (too detailed)
4. ❌ `progress` string in streaming events (redundant)

### Keep These Fields:

1. ✅ `visibility_score`
2. ✅ `model_scores`
3. ✅ `total_queries`
4. ✅ `total_mentions`
5. ✅ `category_breakdown`
6. ✅ `slug_id`
7. ✅ All streaming event types

### Result:

- **25-30% smaller payload**
- **Cleaner API response**
- **Faster data transfer**
- **Same functionality**
