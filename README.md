# 🎫 SmartQueue - Event Ticketing & Queue Management System

A full-stack web application for managing event ticketing, bookings, and real-time queue monitoring with secure user authentication.

---

## 📌 Project Overview
SmartQueue is an event management platform that allows users to browse and book tickets for movies, stage dramas, and musicals.  
Users can create accounts, manage their profiles, view booking history, and make secure payments. Administrators can add new events, monitor real-time queue status, and manage the entire platform through an intuitive dashboard.

This project demonstrates a complete enterprise-level ticketing system with modern design and advanced features.

---

## ✨ Features
- User registration and login with email verification  
- Browse movies, stage dramas, and musicals  
- Real-time ticket booking system  
- Secure payment processing  
- User profile management with avatar upload  
- Admin dashboard for content management  
- Real-time queue monitoring (Admin only)  
- Dynamic event creation and management  
- Responsive dark-themed UI with smooth animations  
- Role-based access control (User/Admin)  

---

## 🛠️ Technology Stack

### Backend
- Spring Boot 3.x  
- Spring Security  
- MySQL 8.0  
- JPA/Hibernate  
- BCrypt Password Encryption  

### Frontend
- Thymeleaf Templates  
- HTML5 & CSS3  
- JavaScript (ES6+)  
- Font Awesome Icons  
- Google Fonts (Poppins)  

### Tools
- Maven  
- Git & GitHub  
- MySQL Workbench  
- IntelliJ IDEA  

---

## 👥 Team Members & Contributions

| Member | Name | Responsibility |
|------|------|----------------|
| Member 1 | Dushan De Silva (36958) |Spring Boot architecture, security, database design |
| Member 2 | Pubudu Chamuditha (36777) | Task Management APIs |
| Member 3 | Movindu Lochana (36986) | Authentication, Security & React Setup |
| Member 4 | Kavith Dulnindu (36666) | Email Notifications, Scheduler, Reports & Admin Dashboard |

---

## ⚙️ Setup Information
- **Backend Port:** `8080`  
- **Database Name:** `smartqueue`  
- **Java Version:** Java 17+  
- **Maven Version:** 3.6+  
- **MySQL Version:** 8.0+  

---

## ▶️ How to Run the Project

### Prerequisites
- Java JDK 17 or higher installed
- MySQL 8.0 or higher installed
- Maven installed
- Git installed

### Database Setup
1. Open MySQL Workbench
2. Create a new database:
   ```sql
   CREATE DATABASE smartqueue;
   USE smartqueue;
   ```
3. Run the schema scripts (tables will be auto-created by Hibernate on first run)

---

### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/smartqueue.git
   cd smartqueue
   ```

2. Update database credentials in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/smartqueue
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

3. Install dependencies and run:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

4. Backend will start at `http://localhost:8080`

---

## 🗂️ Project Structure

```
smartqueue/
├── src/main/java/com/example/smartqueue/
│   ├── config/              # Security and configuration
│   ├── controller/          # REST controllers and page controllers
│   ├── model/              # Entity models (User, Movie, Booking, etc.)
│   ├── repository/         # JPA repositories
│   ├── service/            # Business logic services
│   └── SmartqueueApplication.java
├── src/main/resources/
│   ├── static/
│   │   ├── css/           # Stylesheets
│   │   ├── js/            # JavaScript files
│   │   └── images/        # Images and uploads
│   ├── templates/         # Thymeleaf HTML templates
│   └── application.properties
└── pom.xml                # Maven dependencies
```

---

## 🔐 Default Admin Credentials
```
Email: admin@smartqueue.com
Password: admin123
```
⚠️ **Important:** Change these credentials after first login!

---

## 📱 Key Pages & Routes

### Public Pages
- `/` - Home page
- `/login` - User login
- `/signup` - User registration
- `/booktickets` - Browse and book tickets
- `/ticketing` - Complete booking and payment

### User Pages (Authentication Required)
- `/userprofile` - User profile management
- `/mybookings` - Booking history

### Admin Pages (Admin Only)
- `/admindashboard` - Admin dashboard
- `/addmovies` - Add new events
- `/dashboardevent` - Manage events
- `/queue` - Real-time queue monitoring

---

## 🎨 Design System

### Color Palette
- **Primary Background:** `#0a0e27` (Dark Navy)
- **Card Background:** `#11163a` (Dark Blue)
- **Primary Gradient:** `#667eea` → `#764ba2` (Purple)
- **Accent Color:** `#00d4ff` (Cyan)
- **Button Gradient:** `#2b9fd9` → `#00d4ff` (Blue)

### Typography
- **Font Family:** Poppins (Google Fonts)
- **Weights:** 300, 400, 500, 600, 700, 800

---

## 💾 Database Tables

### Core Tables
- **users** - User accounts and profiles
- **roles** - User roles (USER, ADMIN)
- **user_roles** - User-role mappings
- **movies** - Events (movies, dramas, musicals)
- **bookings** - Ticket bookings
- **payments** - Payment transactions

### Important Columns
**Users Table:**
- id, fullName, email, password (encrypted)
- phone, address, city, postalCode
- avatar, dateOfBirth, enabled

**Movies Table:**
- id, title, category, description
- image, eventDate, status, createdAt

---

## 🔒 Security Features
- Password encryption using BCrypt
- Spring Security for authentication
- Role-based authorization (USER/ADMIN)
- CSRF protection enabled
- Secure session management
- Protected admin routes

---

## 📦 Key Dependencies
```xml
<!-- Spring Boot Starters -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>

<!-- Database -->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
</dependency>
```

---

## 🚀 Features in Detail

### 🎬 Event Management
- Dynamic content creation by admins
- Support for Movies, Stage Dramas, and Musicals
- Image upload for event posters
- Event date and time scheduling
- Category-based filtering

### 🎟️ Booking System
- Real-time ticket availability
- Multiple ticket types (VIP, Standard, Economy)
- Quantity selection
- Price calculation with service fees
- Booking confirmation emails

### 💳 Payment Processing
- Secure payment form
- Card validation (Luhn algorithm)
- Expiry date verification
- CVV validation
- Transaction success confirmation

### 📊 Queue Monitoring
- Real-time queue statistics
- People in queue counter
- Average wait time display
- Check-in tracking
- Alert system for admins

### 👤 User Profile
- Personal information management
- Avatar/profile picture upload
- Address and contact details
- Password change functionality
- Notification preferences

---

## 🧪 Testing

### Manual Testing Checklist
- ✅ User registration and email validation
- ✅ User login and logout
- ✅ Browse events without login
- ✅ Book tickets (requires login)
- ✅ Payment processing
- ✅ Profile management
- ✅ Admin content creation
- ✅ Admin queue monitoring
- ✅ Responsive design on mobile/tablet
- ✅ Role-based access control

---

## 📝 Future Enhancements
- Email notification system for bookings
- QR code generation for tickets
- PDF ticket downloads
- Real-time seat selection
- Integration with third-party payment gateways
- Mobile app development
- Multi-language support
- Analytics dashboard for admins
- Customer reviews and ratings
- Social media sharing

---

## 🐛 Troubleshooting

### Common Issues

**Issue:** Application won't start
- **Solution:** Check if port 8080 is available
- **Solution:** Verify Java 17+ is installed
- **Solution:** Ensure MySQL is running

**Issue:** Database connection failed
- **Solution:** Check MySQL credentials in application.properties
- **Solution:** Verify database `smartqueue` exists
- **Solution:** Check MySQL service is running

**Issue:** Can't access admin pages
- **Solution:** Ensure you're logged in as admin
- **Solution:** Check SecurityConfig.java for correct role mappings

**Issue:** Images not displaying
- **Solution:** Create directories: `static/images/movies/`, `static/images/avatars/`
- **Solution:** Check file permissions

---

## 📄 License
This project is created for educational purposes.

---

## 📞 Contact & Support
For questions or support, please contact the development team.

---

## 🙏 Acknowledgments
- Spring Framework team for excellent documentation
- Font Awesome for beautiful icons
- Google Fonts for typography
- MySQL for reliable database system

---

<div align="center">

**Made with ❤️ for Event Management**

[⬆ Back to Top](#-smartqueue---event-ticketing--queue-management-system)

</div>
