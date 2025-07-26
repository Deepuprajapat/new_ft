# InvestMango Backend + Frontend Integration

## 📦 Project Overview

This backend project serves both:
- REST API (built with Go)
- Static React frontend (loaded dynamically from S3)

---

## 🚀 How Frontend is Integrated

We follow a smart CI/CD approach where:

1. **Frontend build is created and zipped** (e.g. via GitHub Actions):
   ```bash
   npm run build && zip -r frontend.zip build/
