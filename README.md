# Modules

    1) Admin Module
        - View all logged doctor 
        - allow doctor and hospital staff entery in system 
            - may be status: approved 
        - View all patients for doctors     

    2) Doctor login module
        - login /register 
        - View personal medical history
        - View patient records
        - View appointment list
        - Add notes to visit history
        - Add Prescribtion patient visit
        - send reminder for upcoming visit
        - Medicine prescribption PDF Export 
        - print the prescribption with doctor medical loggo and name

        
    3) Doctor hospital module
        - hospital staff login/register
        - Book appointment (online)
        - View appointment for today
        - send reminder for patient


### Fetures 
 1. WhatsApp Notifications, Email sendings  
 2. Payment integration
 3. Custom logo
 4. Video Consultation Support




 | Feature                   | Stack Suggestion                     |
| ------------------------- | ------------------------------------ |
| API Framework             | Express.js with TypeScript           |
| Auth                      | JWT + bcrypt                         |
| Database                  | MongoDB (Mongoose) or PostgreSQL     |
| File/PDF Generation       | `pdfkit`, `puppeteer`, or `html-pdf` |
| Cron Jobs (Reminders)     | `node-cron`, `agenda`                |
| Email/SMS Reminders       | SendGrid, Twilio                     |
| Cloud Hosting             | Railway, Render, or Vercel backend   |
| Cloud Storage (e.g. PDFs) | AWS S3 or Firebase Storage           |
| Real-Time Updates         | Socket.IO or push notifications      |
