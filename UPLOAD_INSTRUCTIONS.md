# Upload Instructions for AcademiQR

## Upload Updated index.html

### IMPORTANT: Always Build First!

If you've made changes to files in the `src/` folder, you MUST build first:

```bash
npm run build
```

This creates `dist/index.html` with all your latest changes.

### Steps to Upload:

1. **Build the project** (if you edited files in `src/`):
   ```bash
   npm run build
   ```

2. **Locate the file to upload**: 
   - **File to upload**: `C:\Users\TOWMJ2\webdev\dist\index.html` ⭐
   - **NOT the root `index.html`** (that's the old version)

3. **Upload to cPanel**:
   - Log into GoDaddy
   - Go to cPanel
   - Click **File Manager**
   - Navigate to `public_html` folder
   - Upload `dist/index.html` to replace the existing one

4. **Clear browser cache**:
   - Press `Ctrl + Shift + Delete`
   - Check "Cached images and files"
   - Clear data
   - Or use hard refresh: `Ctrl + F5`

4. **Test the Google OAuth button**:
   - Click "Continue with Google"
   - Open browser console (F12)
   - You should see logs starting with "handleGoogleLogin called"


