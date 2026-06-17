# 🔥 CommunityConnect - Quick Testing Guide

## ✅ Backend is Running!
- **URL**: http://localhost:8080
- **Port**: 8080
- **Status**: ✅ Active

---

## 🧪 Step-by-Step Testing

### 1️⃣ **Register a Society First!**
Open: http://localhost:8080/test-register.html

Fill the form:
- **Society Name**: Green Valley Apartments
- **Address**: 123 Main Street, Sector 10
- **City**: Mumbai
- **State**: Maharashtra
- **Pincode**: 400001
- **Total Blocks**: 5
- **Total Flats**: 100

**Click "Register Society"** → Copy the **Registration Code** shown!

---

### 2️⃣ **Sign Up a New User**
Open: http://localhost:8080

Click **"Sign Up"** button

Fill the form:
- **Full Name**: Rahul Sharma
- **Email**: rahul@example.com
- **Phone**: 9876543210
- **Flat Number**: A-101
- **Society Code**: (paste the code from step 1)
- **Password**: password123
- **Confirm Password**: password123

**Click "Sign Up"** → Should show success message!

---

### 3️⃣ **Login**
On homepage, click **"Login"** button

Enter:
- **Email**: rahul@example.com
- **Password**: password123

**Click "Login"** → Should redirect to Dashboard!

---

### 4️⃣ **Test Dashboard Features**

#### ✨ Create Help Request:
1. Click **"Request Help"** button
2. Fill form:
   - **Type**: Plumbing Help
   - **Description**: Need plumber for bathroom leak
   - **Urgency**: high
3. Submit → Check "Help Requests" section

#### ✨ Share an Item:
1. Click **"Share Item"** button
2. Fill form:
   - **Item Name**: Drill Machine
   - **Category**: Tools
   - **Description**: Power drill, good condition
   - **Availability**: 7 (days)
3. Submit → Check "Shared Items" section

#### ✨ View Society Info:
- Click **"Society Info"** in sidebar
- See all society details

#### ✨ View Profile:
- Click **"Profile"** in sidebar
- See your details

---

## 🐛 Troubleshooting

### If Login/Signup Doesn't Work:
1. Open Browser Console (F12)
2. Check for errors
3. Common issues:
   - CORS error → Backend issue
   - Network error → Backend not running
   - 401 Unauthorized → JWT issue

### If Dashboard is Blank:
1. Check localStorage has token:
   ```javascript
   localStorage.getItem('auth_token')
   ```
2. Check user data:
   ```javascript
   localStorage.getItem('user_data')
   ```

### If Buttons Don't Work:
1. Check browser console for JavaScript errors
2. Check Network tab for API calls
3. Verify backend is running on port 8080

---

## 📊 Available API Endpoints

### Authentication:
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Society:
- `POST /api/society/register` - Register society
- `GET /api/society/{id}` - Get society details

### Help Requests:
- `POST /api/help-requests` - Create help request
- `GET /api/help-requests/my-requests` - Get your requests
- `GET /api/help-requests/society/{id}` - Get all society requests

### Shared Items:
- `POST /api/shared-items` - Share new item
- `GET /api/shared-items/my-items` - Get your items
- `GET /api/shared-items/society/{id}/available` - Get available items

---

## 🎯 Expected Flow

1. **Society Registration** → Get code
2. **User Signup** → Use society code
3. **Login** → Get JWT token
4. **Dashboard** → See features
5. **Create Help Request** → Submit form
6. **Share Item** → Submit form
7. **View Lists** → See your data

---

## 🚨 Common Errors & Solutions

### Error: "Port 8080 already in use"
```powershell
netstat -ano | findstr :8080
taskkill /F /PID [process_id]
mvn spring-boot:run
```

### Error: "Cannot connect to backend"
- Check if backend is running
- Check URL is `http://localhost:8080`
- Check CORS settings

### Error: "Invalid credentials"
- Verify email and password
- Check user exists in database
- Try signup again

---

## 📝 Notes
- **Verification Status**: New users start as "PENDING"
- **Secretary Role**: Can approve/reject members
- **JWT Token**: Expires after some time (configure in backend)

---

**Good Luck! 🚀**

Agar koi problem ho toh terminal output check karo ya browser console dekho!
