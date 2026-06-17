# 🏘️ CommunityConnect - Backend

Digital platform jo societies aur apartments ke members ko connect karta hai.

## 🚀 Features

- ✅ User Registration & Authentication (JWT)
- ✅ Society Management
- ✅ Member Verification System
- ✅ Role-based Access Control (Member, Secretary, Admin)
- ✅ MySQL Database Integration
- ✅ Spring Security Implementation

## 🛠️ Tech Stack

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security + JWT**
- **Spring Data JPA**
- **MySQL Database**
- **Maven**
- **Lombok**

## 📋 Prerequisites

1. Java 17 installed
2. Maven installed
3. MySQL installed and running
4. HeidiSQL (optional, for database management)

## ⚙️ Configuration

### Database Setup

1. MySQL mein login karo:
```bash
mysql -u root -p
```

2. Database create karo:
```sql
CREATE DATABASE community_connect;
```

3. `application.properties` file mein apna MySQL username/password update karo

## 🏃 How to Run

1. **Dependencies install karo:**
```bash
mvn clean install
```

2. **Application run karo:**
```bash
mvn spring-boot:run
```

3. **Ya direct JAR se run karo:**
```bash
java -jar target/community-connect-1.0.0.jar
```

Application `http://localhost:8080` par run hoga

## 📡 API Endpoints

### Authentication APIs
- `POST /api/auth/signup` - New user registration
- `POST /api/auth/login` - User login

### Society APIs
- `POST /api/society/register` - Register new society
- `GET /api/society/{id}` - Get society details
- `GET /api/society/all` - Get all societies (Admin only)

### Member Verification APIs
- `GET /api/verification/pending/{societyId}` - Get pending verifications
- `PUT /api/verification/verify/{userId}` - Verify member
- `PUT /api/verification/reject/{userId}` - Reject member
- `GET /api/verification/members/{societyId}` - Get all society members
- `GET /api/verification/verified/{societyId}` - Get verified members

## 🔐 Default Roles

- **MEMBER** - Regular society member
- **SECRETARY** - Society secretary (can verify members)
- **ADMIN** - System administrator

## 📝 Sample Request

### Register Society
```json
POST /api/society/register
{
  "name": "Green Valley Apartments",
  "address": "123 Main Street",
  "pincode": "110001",
  "city": "Delhi",
  "state": "Delhi",
  "totalFlats": 100,
  "totalBlocks": 5
}
```

### User Signup
```json
POST /api/auth/signup
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "phone": "9876543210",
  "password": "password123",
  "flatNumber": "A-101",
  "societyCode": "SOC123456"
}
```

### User Login
```json
POST /api/auth/login
{
  "emailOrPhone": "rahul@example.com",
  "password": "password123"
}
```

## 🗄️ Database Schema

### Tables Created:
1. **users** - User information
2. **societies** - Society details

## 📞 Support

Koi problem ho toh contact karo! 😊
