const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./db");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// MySQL connection test
async function testDatabaseConnection() {
  try {
    const connection = await db.getConnection();
    console.log("✅ MySQL Connected Successfully");
    connection.release();
  } catch (error) {
    console.log("❌ MySQL Connection Failed:", error.message);
  }
}

testDatabaseConnection();

app.get("/", (req, res) => {
  res.json({ message: "HireHub API running successfully" });
});

app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT DATABASE() AS database_name");

    res.json({
      status: "Database connected",
      database: rows[0].database_name,
    });
  } catch (error) {
    res.status(500).json({
      message: "Database connection failed",
      error: error.message,
    });
  }
});

app.post("/register", async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)",
      [fullName, email, hashedPassword, role]
    );

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = users[0];

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

app.post("/jobs", async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      salary,
      jobType,
      description,
      requirements,
      createdBy,
    } = req.body;

    if (
      !title ||
      !company ||
      !location ||
      !salary ||
      !jobType ||
      !description ||
      !requirements
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await db.query(
      `INSERT INTO jobs 
      (title, company, location, salary, job_type, description, requirements, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        company,
        location,
        salary,
        jobType,
        description,
        requirements,
        createdBy || null,
      ]
    );

    res.status(201).json({ message: "Job posted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

app.get("/jobs", async (req, res) => {
  try {
    const [jobs] = await db.query(
      "SELECT * FROM jobs ORDER BY created_at DESC"
    );

    res.json(jobs);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

app.post("/apply-job", async (req, res) => {
  try {
    const { jobId, userId } = req.body;

    if (!jobId || !userId) {
      return res.status(400).json({
        message: "Job ID and User ID are required",
      });
    }

    const [existing] = await db.query(
      "SELECT * FROM applications WHERE job_id = ? AND user_id = ?",
      [jobId, userId]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        message: "You have already applied for this job",
      });
    }

    await db.query(
      "INSERT INTO applications (job_id, user_id) VALUES (?, ?)",
      [jobId, userId]
    );

    res.status(201).json({
      message: "Application submitted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

app.get("/my-applications/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const [applications] = await db.query(
      `
      SELECT
        applications.id,
        applications.status,
        applications.applied_at,
        jobs.title,
        jobs.company,
        jobs.location
      FROM applications
      JOIN jobs ON applications.job_id = jobs.id
      WHERE applications.user_id = ?
      ORDER BY applications.applied_at DESC
      `,
      [userId]
    );

    res.json(applications);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

app.get("/job-applicants/:jobId", async (req, res) => {
  try {
    const { jobId } = req.params;

    const [applicants] = await db.query(
      `
      SELECT
        applications.id AS application_id,
        applications.status,
        applications.applied_at,
        users.id AS user_id,
        users.full_name,
        users.email,
        users.phone,
        users.skills,
        users.bio,
        users.cv_file,
        users.profile_picture
      FROM applications
      JOIN users ON applications.user_id = users.id
      WHERE applications.job_id = ?
      ORDER BY applications.applied_at DESC
      `,
      [jobId]
    );

    res.json(applicants);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

app.get("/profile/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const [users] = await db.query(
      "SELECT id, full_name, email, role, phone, skills, bio, cv_file FROM users WHERE id = ?",
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.put("/profile/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { fullName, phone, skills, bio, cvFile } = req.body;

    await db.query(
      `UPDATE users 
       SET full_name = ?, phone = ?, skills = ?, bio = ?, cv_file = ?
       WHERE id = ?`,
      [fullName, phone, skills, bio, cvFile, userId]
    );

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "profilePicture") {
      cb(null, "uploads/profile");
    } else if (file.fieldname === "cvFile") {
      cb(null, "uploads/cv");
    } else if (file.fieldname === "companyLogo") {
      cb(null, "uploads/company");
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

app.put(
  "/profile-upload/:userId",
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "cvFile", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { fullName, phone, skills, bio } = req.body;

      const profilePicture = req.files?.profilePicture
        ? req.files.profilePicture[0].path.replace(/\\/g, "/")
        : null;

      const cvFile = req.files?.cvFile
        ? req.files.cvFile[0].path.replace(/\\/g, "/")
        : null;

      let query = `
        UPDATE users 
        SET full_name = ?, phone = ?, skills = ?, bio = ?
      `;

      const values = [fullName, phone, skills, bio];

      if (profilePicture) {
        query += ", profile_picture = ?";
        values.push(profilePicture);
      }

      if (cvFile) {
        query += ", cv_file = ?";
        values.push(cvFile);
      }

      query += " WHERE id = ?";
      values.push(userId);

      await db.query(query, values);

      res.json({ message: "Profile updated successfully" });
    } catch (error) {
      res.status(500).json({
        message: "Profile upload failed",
        error: error.message,
      });
    }
  }
);

app.get("/my-jobs/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const [jobs] = await db.query(
      `
      SELECT 
        jobs.*,
        COUNT(applications.id) AS applicant_count
      FROM jobs
      LEFT JOIN applications ON jobs.id = applications.job_id
      WHERE jobs.created_by = ?
      GROUP BY jobs.id
      ORDER BY jobs.created_at DESC
      `,
      [userId]
    );

    res.json(jobs);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

app.get("/jobs/:jobId", async (req, res) => {
  try {
    const { jobId } = req.params;

    const [jobs] = await db.query(
      "SELECT * FROM jobs WHERE id = ?",
      [jobId]
    );

    if (jobs.length === 0) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.json(jobs[0]);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

app.put("/application-status/:applicationId", async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const allowedStatuses = ["Pending", "Reviewed", "Shortlisted", "Rejected"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    await db.query(
      "UPDATE applications SET status = ? WHERE id = ?",
      [status, applicationId]
    );

    res.json({ message: "Application status updated successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

app.put("/jobs/:jobId", async (req, res) => {
  try {
    const { jobId } = req.params;
    const {
      title,
      company,
      location,
      salary,
      jobType,
      description,
      requirements,
    } = req.body;

    if (
      !title ||
      !company ||
      !location ||
      !salary ||
      !jobType ||
      !description ||
      !requirements
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await db.query(
      `
      UPDATE jobs 
      SET title = ?, company = ?, location = ?, salary = ?, 
          job_type = ?, description = ?, requirements = ?
      WHERE id = ?
      `,
      [title, company, location, salary, jobType, description, requirements, jobId]
    );

    res.json({ message: "Job updated successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

app.delete("/jobs/:jobId", async (req, res) => {
  try {
    const { jobId } = req.params;

    await db.query("DELETE FROM jobs WHERE id = ?", [jobId]);

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

app.get("/employer-stats/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const [jobs] = await db.query(
      "SELECT COUNT(*) AS totalJobs FROM jobs WHERE created_by = ?",
      [userId]
    );

    const [applicants] = await db.query(
      `
      SELECT COUNT(*) AS totalApplicants
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE j.created_by = ?
      `,
      [userId]
    );

    res.json({
      totalJobs: jobs[0].totalJobs,
      totalApplicants: applicants[0].totalApplicants,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

app.post("/save-job", async (req, res) => {
  try {
    const { userId, jobId } = req.body;

    if (!userId || !jobId) {
      return res.status(400).json({ message: "User ID and Job ID are required" });
    }

    const [existing] = await db.query(
      "SELECT * FROM saved_jobs WHERE user_id = ? AND job_id = ?",
      [userId, jobId]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "Job already saved" });
    }

    await db.query(
      "INSERT INTO saved_jobs (user_id, job_id) VALUES (?, ?)",
      [userId, jobId]
    );

    res.status(201).json({ message: "Job saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.get("/saved-jobs/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const [savedJobs] = await db.query(
      `
      SELECT 
        saved_jobs.id AS saved_id,
        saved_jobs.created_at AS saved_at,
        jobs.id,
        jobs.title,
        jobs.company,
        jobs.location,
        jobs.salary,
        jobs.job_type,
        jobs.description
      FROM saved_jobs
      JOIN jobs ON saved_jobs.job_id = jobs.id
      WHERE saved_jobs.user_id = ?
      ORDER BY saved_jobs.created_at DESC
      `,
      [userId]
    );

    res.json(savedJobs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.delete("/saved-job/:savedId", async (req, res) => {
  try {
    const { savedId } = req.params;

    await db.query("DELETE FROM saved_jobs WHERE id = ?", [savedId]);

    res.json({ message: "Saved job removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.post(
  "/company-profile",
  upload.single("companyLogo"),
  async (req, res) => {
    try {
      const {
        employerId,
        companyName,
        industry,
        website,
        location,
        description,
      } = req.body;

      if (!employerId || !companyName) {
        return res.status(400).json({
          message: "Employer ID and company name are required",
        });
      }

      const logo = req.file ? req.file.path.replace(/\\/g, "/") : null;

      await db.query(
        `
        INSERT INTO companies 
        (employer_id, company_name, industry, website, location, description, logo)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          employerId,
          companyName,
          industry,
          website,
          location,
          description,
          logo,
        ]
      );

      res.status(201).json({
        message: "Company profile created successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  }
);

app.get("/company-profile/:employerId", async (req, res) => {
  try {
    const { employerId } = req.params;

    const [companies] = await db.query(
      "SELECT * FROM companies WHERE employer_id = ? ORDER BY created_at DESC LIMIT 1",
      [employerId]
    );

    if (companies.length === 0) {
      return res.status(404).json({
        message: "Company profile not found",
      });
    }

    res.json(companies[0]);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

app.put(
  "/company-profile/:employerId",
  upload.single("companyLogo"),
  async (req, res) => {
    try {
      const { employerId } = req.params;
      const {
        companyName,
        industry,
        website,
        location,
        description,
      } = req.body;

      const logo = req.file ? req.file.path.replace(/\\/g, "/") : null;

      let query = `
        UPDATE companies 
        SET company_name = ?, industry = ?, website = ?, location = ?, description = ?
      `;

      const values = [
        companyName,
        industry,
        website,
        location,
        description,
      ];

      if (logo) {
        query += ", logo = ?";
        values.push(logo);
      }

      query += " WHERE employer_id = ?";
      values.push(employerId);

      await db.query(query, values);

      res.json({
        message: "Company profile updated successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  }
);

app.get("/companies", async (req, res) => {
  try {
    const [companies] = await db.query(
      "SELECT * FROM companies ORDER BY created_at DESC"
    );

    res.json(companies);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

app.get("/companies/:companyId", async (req, res) => {
  try {
    const { companyId } = req.params;

    const [companies] = await db.query(
      "SELECT * FROM companies WHERE id = ?",
      [companyId]
    );

    if (companies.length === 0) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json(companies[0]);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

app.get("/admin-stats", async (req, res) => {
  try {
    const [users] = await db.query("SELECT COUNT(*) AS totalUsers FROM users");
    const [jobs] = await db.query("SELECT COUNT(*) AS totalJobs FROM jobs");
    const [companies] = await db.query("SELECT COUNT(*) AS totalCompanies FROM companies");
    const [applications] = await db.query("SELECT COUNT(*) AS totalApplications FROM applications");

    res.json({
      totalUsers: users[0].totalUsers,
      totalJobs: jobs[0].totalJobs,
      totalCompanies: companies[0].totalCompanies,
      totalApplications: applications[0].totalApplications,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.get("/admin/users", async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, full_name, email, role, created_at FROM users ORDER BY id DESC"
    );

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

app.get("/admin/jobs", async (req, res) => {
  try {
    const [jobs] = await db.query(`
      SELECT
        jobs.*,
        users.full_name AS employer_name
      FROM jobs
      LEFT JOIN users
      ON jobs.created_by = users.id
      ORDER BY jobs.created_at DESC
    `);

    res.json(jobs);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

app.get("/admin/companies", async (req, res) => {
  try {
    const [companies] = await db.query(`
      SELECT
        companies.*,
        users.full_name AS employer_name
      FROM companies
      LEFT JOIN users
      ON companies.employer_id = users.id
      ORDER BY companies.created_at DESC
    `);

    res.json(companies);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});