# 🔄 Team Workflow Guide

## Branch Structure

- **`main`** - Production code (protected, only merge after review)
- **`yash-dev`** - Yash's development branch
- **`aryan-dev`** - Aryan's development branch

---

## 📋 Daily Workflow for Yash

### 1. Start Working (Every Day)
```bash
# Switch to your branch
git checkout yash-dev

# Get latest changes from main
git pull origin main

# Get latest changes from your branch
git pull origin yash-dev
```

### 2. Work on Your Feature
```bash
# Make changes to files...

# Check what changed
git status

# Stage your changes
git add .

# Commit with clear message
git commit -m "Add feature: description of what you did"
```

### 3. Push to Your Branch
```bash
# Push to YOUR branch (not main!)
git push origin yash-dev
```

### 4. Merge to Main (After Discussion with Aryan)
```bash
# Make sure your branch is up to date
git checkout yash-dev
git pull origin main
git pull origin yash-dev

# Switch to main
git checkout main
git pull origin main

# Merge your branch into main
git merge yash-dev

# Push to main
git push origin main

# Switch back to your branch
git checkout yash-dev
```

**OR use Pull Request on GitHub (Recommended):**
1. Go to: https://github.com/Yash-109/Trading-Journal/pulls
2. Click "New Pull Request"
3. Base: `main` ← Compare: `yash-dev`
4. Add description and create PR
5. Ask Aryan to review
6. After approval, click "Merge Pull Request"

---

## 📋 Daily Workflow for Aryan

### 1. Start Working (Every Day)
```bash
# Switch to your branch
git checkout aryan-dev

# Get latest changes from main
git pull origin main

# Get latest changes from your branch
git pull origin aryan-dev
```

### 2. Work on Your Feature
```bash
# Make changes to files...

# Stage your changes
git add .

# Commit with clear message
git commit -m "Add feature: description of what you did"
```

### 3. Push to Your Branch
```bash
# Push to YOUR branch (not main!)
git push origin aryan-dev
```

### 4. Merge to Main (After Discussion with Yash)
```bash
# Make sure your branch is up to date
git checkout aryan-dev
git pull origin main
git pull origin aryan-dev

# Switch to main
git checkout main
git pull origin main

# Merge your branch into main
git merge aryan-dev

# Push to main
git push origin main

# Switch back to your branch
git checkout aryan-dev
```

---

## ⚠️ Important Rules

### ❌ DON'T:
- **Never work directly on `main` branch**
- **Never force push:** `git push -f`
- **Never push to someone else's dev branch**
- **Never merge to main without discussion**

### ✅ DO:
- **Always work on your own dev branch**
- **Pull latest changes before starting work**
- **Push to your dev branch frequently**
- **Discuss before merging to main**
- **Test your code before merging**

---

## 🔄 Quick Commands Reference

### Check Current Branch
```bash
git branch
# The one with * is your current branch
```

### Switch Branches
```bash
# Switch to your dev branch
git checkout yash-dev    # For Yash
git checkout aryan-dev   # For Aryan

# Switch to main
git checkout main
```

### View Commit History
```bash
git log --oneline --graph --all
```

### Undo Last Commit (if not pushed)
```bash
git reset --soft HEAD~1
```

### Discard Local Changes
```bash
# Discard changes in specific file
git checkout -- filename.js

# Discard all changes
git reset --hard HEAD
```

---

## 🚀 Example Workflow

### Scenario: Yash wants to add a new feature

```bash
# Day 1: Start feature
git checkout yash-dev
git pull origin main
git pull origin yash-dev

# Work on feature...
git add .
git commit -m "Add trading calculator feature - part 1"
git push origin yash-dev

# Day 2: Continue feature
git checkout yash-dev
git pull origin main
git pull origin yash-dev

# Work more...
git add .
git commit -m "Add trading calculator feature - part 2, completed"
git push origin yash-dev

# Day 3: Feature complete, ready to merge
# Test everything works
npm run dev

# Discuss with Aryan on WhatsApp/Discord
# After approval, create Pull Request on GitHub
# Or merge directly:
git checkout main
git pull origin main
git merge yash-dev
git push origin main

# Back to dev branch for next feature
git checkout yash-dev
```

---

## 📞 Communication Protocol

Before merging to `main`, always:
1. ✅ Test your code locally (`npm run dev`)
2. ✅ Check no errors in console
3. ✅ Inform team member about merge
4. ✅ Wait for approval/acknowledgment
5. ✅ Then merge to main

---

## 🆘 Common Problems & Solutions

### Problem: "Your branch is behind"
```bash
git pull origin yash-dev
```

### Problem: "Merge conflict"
```bash
# Git will mark conflicts in files like:
# <<<<<<< HEAD
# your code
# =======
# their code
# >>>>>>> branch-name

# 1. Open conflicted files
# 2. Choose which code to keep
# 3. Remove conflict markers
# 4. Save files
git add .
git commit -m "Resolve merge conflicts"
git push origin yash-dev
```

### Problem: "Accidentally worked on wrong branch"
```bash
# Don't commit yet! Stash changes:
git stash

# Switch to correct branch
git checkout yash-dev

# Apply stashed changes
git stash pop
```

---

## 🎯 Best Practices

1. **Commit Often** - Small commits are better than big ones
2. **Clear Messages** - Write descriptive commit messages
3. **Pull Regularly** - Stay updated with main branch
4. **Test Before Push** - Make sure code works
5. **Communicate** - Talk before big changes
6. **Review Code** - Check each other's work

---

## 📊 Branch Status Check

```bash
# See all branches
git branch -a

# See which files changed
git status

# See detailed changes
git diff
```

---

**Remember:** Your dev branch is YOUR workspace. Work freely, commit often, and only merge to main when the feature is complete and tested! 🚀
