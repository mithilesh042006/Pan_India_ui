# 📚 Complete API Documentation
## Pan-India Employee & Employer Rating Portal

**Base URL:** `http://localhost:8000`  
**Authentication:** JWT Bearer Token (except where noted)  
**Content-Type:** `application/json`

## 🔐 Authentication Endpoints

### 1. User Registration
**POST** `/api/auth/register/`  
**Authentication:** Not required

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "full_name": "John Doe",
  "password": "SecurePass123!",
  "password_confirm": "SecurePass123!",
  "user_role": "employee",
  "city": "Mumbai",
  "skills": ["Python", "Django", "React"],
  "work_history": [
    {
      "company": "TechCorp",
      "position": "Software Developer",
      "duration": "2020-2023"
    }
  ],
  "linkedin_url": "https://linkedin.com/in/johndoe",
  "show_rating_details": true
}
```

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "john.doe@example.com",
    "full_name": "John Doe",
    "user_role": "employee",
    "city": "Mumbai"
  }
}
```

**Error Response (400):**
```json
{
  "email": ["User with this email already exists"],
  "password": ["Passwords don't match"]
}
```

### 2. User Login
**POST** `/api/auth/login/`  
**Authentication:** Not required

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "email": "john.doe@example.com",
    "full_name": "John Doe",
    "user_role": "employee",
    "city": "Mumbai",
    "rating_received": 4.2,
    "date_joined": "2024-01-15T10:30:00Z",
    "avatar": null
  }
}
```

**Error Response (401):**
```json
{
  "detail": "No active account found with the given credentials"
}
```

### 3. Token Refresh
**POST** `/api/auth/refresh/`  
**Authentication:** Not required

**Request Body:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Success Response (200):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### 4. Get/Update User Profile
**GET/PATCH** `/api/auth/profile/`  
**Authentication:** Required

**GET Response (200):**
```json
{
  "id": 1,
  "email": "john.doe@example.com",
  "full_name": "John Doe",
  "avatar": "/media/avatars/john_avatar.jpg",
  "city": "Mumbai",
  "skills": ["Python", "Django", "React"],
  "work_history": [
    {
      "company": "TechCorp",
      "position": "Software Developer",
      "duration": "2020-2023"
    }
  ],
  "linkedin_url": "https://linkedin.com/in/johndoe",
  "rating_received": 4.2,
  "user_role": "employee",
  "date_joined": "2024-01-15T10:30:00Z",
  "is_active": true
}
```

**PATCH Request Body:**
```json
{
  "full_name": "John Smith",
  "city": "Delhi",
  "skills": ["Python", "Django", "React", "Node.js"],
  "linkedin_url": "https://linkedin.com/in/johnsmith"
}
```

### 5. Change Password
**PUT** `/api/auth/change-password/`  
**Authentication:** Required

**Request Body:**
```json
{
  "old_password": "SecurePass123!",
  "new_password": "NewSecurePass456!",
  "new_password_confirm": "NewSecurePass456!"
}
```

**Success Response (200):**
```json
{
  "message": "Password changed successfully"
}
```

### 6. Password Reset Request
**POST** `/api/auth/password-reset/request/`  
**Authentication:** Not required

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

**Success Response (200):**
```json
{
  "message": "Password reset code sent to your email",
  "reset_code": "123456",
  "expires_in": "15 minutes"
}
```

### 7. Password Reset Confirm
**POST** `/api/auth/password-reset/confirm/`  
**Authentication:** Not required

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "reset_code": "123456",
  "new_password": "NewSecurePass456!",
  "new_password_confirm": "NewSecurePass456!"
}
```

**Success Response (200):**
```json
{
  "message": "Password reset successfully"
}
```

### 8. Upload Avatar
**POST** `/api/auth/avatar/upload/`  
**Authentication:** Required  
**Content-Type:** `multipart/form-data`

**Request Body:**
```
Form Data:
avatar: [image file]
```

**Success Response (200):**
```json
{
  "message": "Avatar uploaded successfully",
  "avatar_url": "/media/avatars/user_1_avatar.jpg"
}
```

### 9. Check Email Availability
**GET** `/api/auth/check-email/?email=test@example.com`  
**Authentication:** Not required

**Success Response (200):**
```json
{
  "email": "test@example.com",
  "available": true
}
```

### 10. Authentication Status
**GET** `/api/auth/status/`  
**Authentication:** Not required

**Authenticated Response (200):**
```json
{
  "authenticated": true,
  "user": {
    "id": 1,
    "email": "john.doe@example.com",
    "full_name": "John Doe",
    "user_role": "employee",
    "city": "Mumbai"
  }
}
```

**Unauthenticated Response (200):**
```json
{
  "authenticated": false
}
```

## ⭐ Core Rating System Endpoints

### 11. Get Companies (Employee Only)
**GET** `/api/core/companies/`  
**Authentication:** Required (Employee role)

**Query Parameters:**
- `search` - Search by company name or city
- `city` - Filter by city
- `min_rating` - Minimum rating filter
- `page` - Page number (default: 1)
- `page_size` - Results per page (default: 20, max: 100)

**Success Response (200):**
```json
{
  "results": [
    {
      "id": 2,
      "full_name": "TechCorp Solutions",
      "city": "Mumbai",
      "rating_received": 4.5,
      "user_role": "employer",
      "avatar": "/media/avatars/techcorp_logo.jpg",
      "total_ratings_received": 25,
      "user_has_rated": false,
      "can_rate": true,
      "category_averages": {
        "Work Environment": 4.6,
        "Management Quality": 4.3,
        "Career Growth": 4.2,
        "Work-Life Balance": 4.7,
        "Compensation": 4.4,
        "Company Culture": 4.5
      }
    }
  ],
  "total_count": 50,
  "page": 1,
  "page_size": 20,
  "has_next": true,
  "user_type": "employee",
  "viewing": "companies"
}
```

### 12. Get Employees (Employer Only)
**GET** `/api/core/employees/`  
**Authentication:** Required (Employer role)

**Query Parameters:**
- `search` - Search by employee name or city
- `city` - Filter by city
- `skills` - Filter by skills (comma-separated)
- `min_rating` - Minimum rating filter
- `page` - Page number
- `page_size` - Results per page

**Success Response (200):**
```json
{
  "results": [
    {
      "id": 1,
      "full_name": "John Doe",
      "city": "Mumbai",
      "skills": ["Python", "Django", "React"],
      "rating_received": 4.2,
      "user_role": "employee",
      "avatar": "/media/avatars/john_avatar.jpg",
      "total_ratings_received": 8,
      "user_has_rated": false,
      "can_rate": true,
      "category_averages": {
        "Technical Skills": 4.5,
        "Communication": 4.0,
        "Reliability": 4.3,
        "Team Collaboration": 4.1,
        "Problem Solving": 4.4,
        "Professionalism": 4.2
      }
    }
  ],
  "total_count": 150,
  "page": 1,
  "page_size": 20,
  "has_next": true,
  "user_type": "employer",
  "viewing": "employees"
}
```

### 13. Create Rating
**POST** `/api/core/ratings/`  
**Authentication:** Required

**Request Body:**
```json
{
  "ratee": 2,
  "role_context": "EMPLOYEE_TO_COMPANY",
  "is_anonymous": true,
  "feedback_message": "Great company to work for! Excellent work-life balance and supportive management. The career growth opportunities are outstanding and the compensation is competitive. Highly recommend to other professionals.",
  "category_scores": [
    {"category": "Work Environment", "score": 5},
    {"category": "Management Quality", "score": 4},
    {"category": "Career Growth", "score": 3},
    {"category": "Work-Life Balance", "score": 5},
    {"category": "Compensation", "score": 4},
    {"category": "Company Culture", "score": 5}
  ]
}
```

**Success Response (201):**
```json
{
  "id": 15,
  "rater": 1,
  "rater_name": "Anonymous",
  "ratee": 2,
  "ratee_name": "TechCorp Solutions",
  "role_context": "EMPLOYEE_TO_COMPANY",
  "is_anonymous": true,
  "feedback_message": null,
  "created_at": "2024-01-20T14:30:00Z",
  "category_scores": [
    {"category": "Work Environment", "score": 5},
    {"category": "Management Quality", "score": 4},
    {"category": "Career Growth", "score": 3},
    {"category": "Work-Life Balance", "score": 5},
    {"category": "Compensation", "score": 4},
    {"category": "Company Culture", "score": 5}
  ]
}
```

### 14. Get Rating Categories
**GET** `/api/core/rating-categories/`  
**Authentication:** Required

**Query Parameters:**
- `role_context` - EMPLOYEE_TO_COMPANY or EMPLOYER_TO_EMPLOYEE

**Success Response (200):**
```json
{
  "categories": {
    "EMPLOYEE_TO_COMPANY": [
      "Work Environment",
      "Management Quality", 
      "Career Growth",
      "Work-Life Balance",
      "Compensation",
      "Company Culture"
    ],
    "EMPLOYER_TO_EMPLOYEE": [
      "Technical Skills",
      "Communication",
      "Reliability", 
      "Team Collaboration",
      "Problem Solving",
      "Professionalism"
    ]
  }
}
```

### 15. Check Rating Eligibility
**POST** `/api/core/check-rating-eligibility/`  
**Authentication:** Required

**Request Body:**
```json
{
  "ratee_id": 2,
  "role_context": "EMPLOYEE_TO_COMPANY"
}
```

**Success Response (200):**
```json
{
  "eligible": true,
  "reason": "You can rate this user"
}
```

**Ineligible Response (200):**
```json
{
  "eligible": false,
  "reason": "You have already rated this user in this context"
}
```

### 16. User Rating Statistics
**GET** `/api/core/users/{user_id}/stats/`
**Authentication:** Required

**Success Response (200):**
```json
{
  "user_id": 2,
  "full_name": "TechCorp Solutions",
  "user_role": "employer",
  "average_rating": 4.5,
  "total_ratings": 25,
  "ratings_by_category": {
    "Work Environment": {"average": 4.6, "count": 25},
    "Management Quality": {"average": 4.3, "count": 25},
    "Career Growth": {"average": 4.2, "count": 25},
    "Work-Life Balance": {"average": 4.7, "count": 25},
    "Compensation": {"average": 4.4, "count": 25},
    "Company Culture": {"average": 4.5, "count": 25}
  },
  "recent_ratings": [
    {
      "id": 15,
      "rater_name": "Anonymous",
      "role_context": "EMPLOYEE_TO_COMPANY",
      "is_anonymous": true,
      "created_at": "2024-01-20T14:30:00Z",
      "category_scores": [
        {"category": "Work Environment", "score": 5}
      ]
    }
  ]
}
```

### 17. Complete User Profile with Ratings
**GET** `/api/core/users/{user_id}/profile/`
**Authentication:** Required

**Description:** Get complete user profile with detailed ratings, feedback messages, and ability to rate.

**Success Response (200):**
```json
{
  "user_profile": {
    "id": 2,
    "email": "techcorp@example.com",
    "full_name": "TechCorp Solutions",
    "avatar": "/media/avatars/techcorp_logo.jpg",
    "city": "Mumbai",
    "skills": [],
    "work_history": [],
    "linkedin_url": "https://linkedin.com/company/techcorp",
    "rating_received": 4.5,
    "show_rating_details": true,
    "user_role": "employer",
    "date_joined": "2023-06-15T08:30:00Z",
    "is_active": true
  },
  "rating_summary": {
    "average_rating": 4.5,
    "total_ratings": 25,
    "ratings_by_category": {
      "Work Environment": {"average": 4.6, "count": 25},
      "Management Quality": {"average": 4.3, "count": 25},
      "Career Growth": {"average": 4.2, "count": 25},
      "Work-Life Balance": {"average": 4.7, "count": 25},
      "Compensation": {"average": 4.4, "count": 25},
      "Company Culture": {"average": 4.5, "count": 25}
    }
  },
  "all_ratings": [
    {
      "id": 15,
      "rater": 1,
      "rater_name": "John Doe",
      "ratee": 2,
      "ratee_name": "TechCorp Solutions",
      "role_context": "EMPLOYEE_TO_COMPANY",
      "is_anonymous": false,
      "feedback_message": "Excellent company to work for! Great work-life balance and supportive management. The career growth opportunities are outstanding and the compensation is competitive. Highly recommend to other professionals.",
      "created_at": "2024-01-20T14:30:00Z",
      "category_scores": [
        {"category": "Work Environment", "score": 5},
        {"category": "Management Quality", "score": 4},
        {"category": "Career Growth", "score": 4},
        {"category": "Work-Life Balance", "score": 5},
        {"category": "Compensation", "score": 4},
        {"category": "Company Culture", "score": 5}
      ]
    },
    {
      "id": 16,
      "rater": 3,
      "rater_name": "Anonymous",
      "ratee": 2,
      "ratee_name": "TechCorp Solutions",
      "role_context": "EMPLOYEE_TO_COMPANY",
      "is_anonymous": true,
      "feedback_message": null,
      "created_at": "2024-01-19T10:15:00Z",
      "category_scores": [
        {"category": "Work Environment", "score": 4},
        {"category": "Management Quality", "score": 3}
      ]
    }
  ],
  "can_rate": true,
  "rating_context": "EMPLOYEE_TO_COMPANY"
}
```

**Note:**
- `feedback_message` is visible based on anonymity settings and user permissions
- `can_rate` indicates if the current user can rate this profile
- `rating_context` shows the type of rating that can be given
- `rating_details_visible` indicates if the user allows their rating details to be shown
- If `show_rating_details` is false, `all_ratings` will be empty for other users

### 18. Dashboard Statistics
**GET** `/api/core/dashboard/`  
**Authentication:** Required

**Success Response (200):**
```json
{
  "user_profile": {
    "id": 1,
    "full_name": "John Doe",
    "user_role": "employee",
    "city": "Mumbai",
    "rating_received": 4.2
  },
  "stats": {
    "ratings_given": 5,
    "ratings_received": 8,
    "average_rating": 4.2
  },
  "recent_ratings": [
    {
      "id": 12,
      "rater_name": "TechCorp Solutions",
      "role_context": "EMPLOYER_TO_EMPLOYEE",
      "is_anonymous": false,
      "created_at": "2024-01-18T10:15:00Z"
    }
  ]
}
```

### 19. My Ratings Given
**GET** `/api/core/my-ratings/given/`  
**Authentication:** Required

**Query Parameters:**
- `page` - Page number
- `page_size` - Results per page

**Success Response (200):**
```json
{
  "results": [
    {
      "id": 15,
      "ratee_name": "TechCorp Solutions",
      "role_context": "EMPLOYEE_TO_COMPANY",
      "is_anonymous": true,
      "created_at": "2024-01-20T14:30:00Z",
      "category_scores": [
        {"category": "Work Environment", "score": 5}
      ]
    }
  ],
  "total_count": 5,
  "page": 1,
  "page_size": 20,
  "has_next": false
}
```

### 20. My Ratings Received
**GET** `/api/core/my-ratings/received/`  
**Authentication:** Required

**Success Response (200):**
```json
{
  "results": [
    {
      "id": 12,
      "rater_name": "TechCorp Solutions",
      "role_context": "EMPLOYER_TO_EMPLOYEE", 
      "is_anonymous": false,
      "created_at": "2024-01-18T10:15:00Z",
      "category_scores": [
        {"category": "Technical Skills", "score": 5}
      ]
    }
  ],
  "total_count": 8,
  "page": 1,
  "page_size": 20,
  "has_next": false
}
```

## 🔧 Utility Endpoints

### 21. Health Check
**GET** `/api/core/health/`  
**Authentication:** Not required

**Success Response (200):**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-20T15:45:00Z",
  "version": "1.0.0"
}
```

### 22. User Statistics
**GET** `/api/auth/statistics/`  
**Authentication:** Required

**Success Response (200):**
```json
{
  "total_users": 500,
  "total_employees": 350,
  "total_employers": 150,
  "recent_registrations": [
    {
      "id": 501,
      "full_name": "Jane Smith",
      "city": "Delhi",
      "user_role": "employee",
      "rating_received": 0.0,
      "date_joined": "2024-01-20T12:00:00Z"
    }
  ],
  "top_rated_users": [
    {
      "id": 25,
      "full_name": "Excellence Corp",
      "city": "Bangalore",
      "user_role": "employer",
      "rating_received": 4.9,
      "date_joined": "2023-06-15T08:30:00Z"
    }
  ]
}
```

## 🚨 Error Responses

### Common HTTP Status Codes

**400 Bad Request:**
```json
{
  "error": "Validation error message",
  "details": {
    "field_name": ["Specific field error"]
  }
}
```

**401 Unauthorized:**
```json
{
  "detail": "Authentication credentials were not provided."
}
```

**403 Forbidden:**
```json
{
  "error": "This endpoint is only for employees"
}
```

**404 Not Found:**
```json
{
  "error": "User not found"
}
```

**429 Too Many Requests:**
```json
{
  "error": "Rate limit exceeded. Please try again later."
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error. Please try again later."
}
```

## 🔑 Authentication Header

For all authenticated endpoints, include:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

## 📝 Important Notes

1. **Role Context Values:**
   - `EMPLOYEE_TO_COMPANY` - Employee rating an employer
   - `EMPLOYER_TO_EMPLOYEE` - Employer rating an employee

2. **User Roles:**
   - `employee` - Individual job seekers/workers
   - `employer` - Companies/organizations

3. **Rating Scores:**
   - Range: 1-5 (integers only)
   - 1 = Poor, 2 = Fair, 3 = Good, 4 = Very Good, 5 = Excellent

4. **Feedback Messages:**
   - Optional text feedback with ratings (max 1000 characters)
   - Visible to ratee (person being rated) always
   - Visible to others only if rating is not anonymous
   - Can be left blank for score-only ratings

5. **File Upload:**
   - Avatar images: JPEG, PNG, GIF
   - Maximum size: 5MB
   - Automatically resized if needed

6. **Pagination:**
   - Default page size: 20
   - Maximum page size: 100
   - Pages are 1-indexed

## 💬 **Feedback Message Examples**

### Employee Rating Company:
```json
{
  "feedback_message": "Excellent company culture and great work-life balance. Management is very supportive and provides clear career growth paths. The compensation package is competitive and the work environment is collaborative. Would definitely recommend to other professionals looking for a stable and growth-oriented workplace."
}
```

### Employer Rating Employee:
```json
{
  "feedback_message": "Outstanding technical skills and excellent communication. Always delivers projects on time and shows great initiative in problem-solving. Works well with the team and demonstrates strong leadership qualities. A valuable asset to any organization."
}
```

### Anonymous Rating (Feedback Hidden from Public):
```json
{
  "is_anonymous": true,
  "feedback_message": "This feedback will only be visible to the person being rated, not to other users browsing the platform."
}
```

## 🔒 **Privacy and Security Features**

### Rating Details Privacy Control
- Users can control whether their rating details are visible to others using the `show_rating_details` field
- When `show_rating_details` is `false`:
  - Other users see 0 total ratings in lists
  - Other users see empty detailed ratings array
  - Category averages are hidden
  - Only the overall rating average remains visible
- When `show_rating_details` is `true` (default):
  - All rating details are visible to other users
  - Full transparency mode
- Users can always see their own ratings regardless of privacy setting
- Privacy setting can be updated through profile management

### Anonymous Ratings
- Users can choose to rate anonymously
- Anonymous ratings hide the rater's identity
- Feedback from anonymous ratings is only visible to the person being rated

### Feedback Privacy
- Public ratings: Feedback visible to everyone
- Anonymous ratings: Feedback only visible to the ratee
- Ratee always sees all feedback regardless of anonymity

### Data Protection
- All endpoints require authentication
- Users can only rate others in appropriate contexts (employee→company, employer→employee)
- Duplicate ratings are prevented
- Input validation and sanitization applied

This documentation covers all available endpoints with complete request/response examples for the Pan-India Employee & Employer Rating Portal API.
