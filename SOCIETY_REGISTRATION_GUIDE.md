# 🏢 Society Registration Guide

## 📍 Society Code Kaha Se Milega?

### **Option 1: Dedicated Registration Page (Recommended) ✨**

**Direct Link:** http://localhost:8080/society-register.html

#### Steps:
1. Browser mein jaao: `http://localhost:8080/society-register.html`
2. Form fill karo:
   - Society Name (e.g., "Green Valley Apartments")
   - Complete Address
   - City & State
   - Pincode (6 digits)
   - Total Flats (e.g., 50)
   - Total Blocks/Towers (e.g., 5)
3. **"Register Society"** button click karo
4. ✅ **Success!** Tumhe ek unique code milega jaise: `SOC123456`
5. 📋 **Copy Button** se code copy karo
6. Is code ko apne society members ke saath share karo

---

### **Option 2: Homepage Se**

**Homepage Link:** http://localhost:8080

#### Steps:
1. Homepage kholo
2. Neeche **"Register New Society →"** link dikhai dega
3. Us par click karo
4. Wahi registration page khul jayega

---

### **Option 3: Setup Page (Old Method)**

**Setup Link:** http://localhost:8080/setup.html

#### Steps:
1. `http://localhost:8080/setup.html` kholo
2. **Step 1: Register Society** tab mein form fill karo
3. Register karne ke baad code mil jayega

---

## 🎯 Registration Code Ka Use

### **Users Ke Liye:**
Jab koi member signup karega, tab use **Society Registration Code** mangega:

```
Registration Form:
━━━━━━━━━━━━━━━━━━
Name: Rahul Sharma
Email: rahul@example.com
Phone: 9876543210
Flat Number: A-101
Society Code: [SOC123456]  ← Yahan dalna hoga
Password: ********
```

---

## 🗄️ Database Mein Society Code

### **Check Karne Ke Liye (HeidiSQL):**

```sql
-- All societies and their codes
SELECT 
    id,
    name,
    registration_code,
    city,
    state,
    total_flats,
    created_at
FROM societies;
```

### **Specific Society Search:**

```sql
-- Find society by code
SELECT * FROM societies 
WHERE registration_code = 'SOC123456';

-- Find society by name
SELECT * FROM societies 
WHERE name LIKE '%Green Valley%';
```

---

## 📊 Features of New Registration Page

✅ **Clean UI** - Beautiful gradient design
✅ **Instant Code Generation** - Random 6-digit code (e.g., SOC123456)
✅ **Copy Button** - One-click clipboard copy
✅ **Validation** - Pincode, numbers validation
✅ **Success Screen** - Shows all details with copy option
✅ **Error Handling** - Clear error messages
✅ **Responsive Design** - Works on mobile too
✅ **Loading States** - Shows loading during API call

---

## 🔍 How Society Code Generation Works

### **Backend Logic (SocietyService.java):**

```java
private String generateRegistrationCode() {
    String code;
    do {
        // Generate random 6-digit number
        code = "SOC" + String.format("%06d", new Random().nextInt(999999));
    } while (societyRepository.existsByRegistrationCode(code));
    return code;
}
```

**Example Codes:**
- `SOC000123`
- `SOC456789`
- `SOC999001`

**Format:**
- Prefix: `SOC` (Society)
- 6 digits: Random number (0-999999)
- Unique: Checks database for duplicates

---

## ✨ Complete Flow Diagram

```
🏢 SOCIETY REGISTRATION FLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Admin Opens Page
   ↓
   http://localhost:8080/society-register.html

2. Fill Form
   ↓
   - Society Name
   - Address
   - City, State
   - Pincode
   - Total Flats
   - Total Blocks

3. Click "Register Society"
   ↓
   POST /api/society/register

4. Backend Processing
   ↓
   - Validate data
   - Check duplicate name
   - Generate code (SOC123456)
   - Save to database

5. Success Response
   ↓
   - Show society code
   - Show copy button
   - Display details

6. Share Code
   ↓
   WhatsApp, SMS, Notice Board

7. Members Use Code
   ↓
   Signup form mein enter karenge

8. Members Verified
   ↓
   Secretary approve karega
```

---

## 🚀 Quick Start Commands

### **Start Backend:**
```powershell
cd d:\Projects\apnasath
mvn spring-boot:run
```

### **Access Pages:**
```
New Registration:  http://localhost:8080/society-register.html
Homepage:          http://localhost:8080
Setup Page:        http://localhost:8080/setup.html
Dashboard:         http://localhost:8080/dashboard.html
```

---

## 🐛 Troubleshooting

### **Page Not Loading?**
✅ Check if backend is running on port 8080
✅ Check browser console (F12) for errors

### **Registration Not Working?**
✅ Check MySQL database connection
✅ Check if `societies` table exists
✅ Check backend console for errors

### **Code Not Generated?**
✅ Check backend logs for errors
✅ Verify `SocietyService.java` is working
✅ Check database write permissions

---

## 📝 Testing Checklist

- [ ] Society registration page loads properly
- [ ] Form validation works (pincode, numbers)
- [ ] Society registers successfully
- [ ] Unique code is generated
- [ ] Code is displayed on success screen
- [ ] Copy button works
- [ ] Society details are correct
- [ ] Can register multiple societies
- [ ] Code is saved in database
- [ ] Users can signup using the code

---

## 💡 Pro Tips

1. **Share Code Safely:** Code ko secure way se share karo (WhatsApp, Email)
2. **Save Code:** Code ko note karke rakh lo for future reference
3. **Multiple Societies:** Different societies ke liye different codes honge
4. **Code Format:** Always `SOC` followed by 6 digits
5. **Case Sensitive:** Code entering time pe exact case use karo

---

## 📞 Support

Agar koi problem ho toh:
1. Backend logs check karo
2. Database check karo (HeidiSQL)
3. Browser console check karo (F12)
4. Network tab mein API calls check karo

---

**Happy Connecting! 🎉**
