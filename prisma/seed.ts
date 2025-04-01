import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import bcrypt from "bcryptjs";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
    // Create Super Admin
    const hashedPassword = await bcrypt.hash("SuperAdmin@123", 12);

    const superAdmin = await prisma.user.upsert({
        where: { email: "superadmin@college.edu" },
        update: {},
        create: {
            name: "Super Admin",
            email: "superadmin@college.edu",
            password: hashedPassword,
            role: "SUPER_ADMIN",
            department: "Administration",
            isVerified: true,
        },
    });

    console.log("Super Admin created:", superAdmin.email);

    // Create a sample admin
    const adminPassword = await bcrypt.hash("Admin@123", 12);
    const admin = await prisma.user.upsert({
        where: { email: "admin@college.edu" },
        update: {},
        create: {
            name: "Dr. Sharma",
            email: "admin@college.edu",
            password: adminPassword,
            role: "ADMIN",
            department: "Exam Cell",
            isVerified: true,
        },
    });

    console.log("Admin created:", admin.email);

    // Create a sample student
    const studentPassword = await bcrypt.hash("Student@123", 12);
    const student = await prisma.user.upsert({
        where: { email: "student@college.edu" },
        update: {},
        create: {
            name: "Rahul Kumar",
            email: "student@college.edu",
            password: studentPassword,
            role: "STUDENT",
            department: "Computer Science",
            rollNo: "CS2024001",
            branch: "CSE",
            year: "3rd",
            isVerified: true,
        },
    });

    console.log("Student created:", student.email);

    // Create sample notices
    const notices = [
        {
            title: "Mid-Term Exam Schedule Changed",
            description:
                "Due to festival holidays, mid-term examinations have been postponed. New dates are 15-20 April 2026. Students are advised to check the updated schedule on the college portal. Admit cards will be available from 10 April onwards.",
            category: "ACADEMIC" as const,
            urgency: "URGENT" as const,
            isPinned: true,
            authorId: admin.id,
            expiryDate: new Date("2026-04-20"),
        },
        {
            title: "TCS On-Campus Placement Drive",
            description:
                "TCS is conducting an on-campus placement drive on 5th April 2026. Eligible students: B.Tech CSE, IT, ECE (2024 batch). Minimum CGPA: 7.0. Registration link will be shared via email. Carry updated resume and college ID.",
            category: "PLACEMENT" as const,
            urgency: "IMPORTANT" as const,
            isPinned: true,
            authorId: admin.id,
            expiryDate: new Date("2026-04-05"),
        },
        {
            title: "Annual Cultural Fest - Technotsav 2026",
            description:
                "The annual cultural festival Technotsav 2026 will be held from 25-27 April. Events include coding competitions, hackathons, dance, music, and drama. Registration opens on 1 April. Exciting prizes worth ₹5 Lakhs!",
            category: "EVENTS" as const,
            urgency: "NORMAL" as const,
            isPinned: true,
            authorId: admin.id,
            expiryDate: new Date("2026-04-27"),
        },
        {
            title: "Merit Scholarship Applications Open",
            description:
                "Applications for the State Government Merit Scholarship 2026 are now open. Students with CGPA above 8.5 are eligible. Last date to apply: 10 April 2026. Submit application along with income certificate and marksheets.",
            category: "SCHOLARSHIPS" as const,
            urgency: "IMPORTANT" as const,
            authorId: admin.id,
            expiryDate: new Date("2026-04-10"),
        },
        {
            title: "Inter-College Cricket Tournament",
            description:
                "Inter-college cricket tournament will start from 8 April. Interested students can register at the Sports Department. Team trials on 2 April at 4 PM on the main ground.",
            category: "SPORTS" as const,
            urgency: "NORMAL" as const,
            authorId: admin.id,
            expiryDate: new Date("2026-04-15"),
        },
        {
            title: "Hostel Room Allotment 2026-27",
            description:
                "Room allotment for the next academic year will begin from 1 May. Students currently residing in hostel must clear all dues by 20 April. New applications accepted from 5 April.",
            category: "HOSTEL" as const,
            urgency: "NORMAL" as const,
            authorId: admin.id,
            expiryDate: new Date("2026-05-01"),
        },
        {
            title: "Library Timing Change",
            description:
                "The central library will remain open from 8 AM to 10 PM during exam season (April 10-30). Students can access reading rooms and digital resources. Silence must be maintained at all times.",
            category: "GENERAL" as const,
            urgency: "NORMAL" as const,
            authorId: admin.id,
            expiryDate: new Date("2026-04-30"),
        },
    ];

    for (const notice of notices) {
        await prisma.notice.create({ data: notice });
    }

    console.log(`${notices.length} sample notices created`);
    console.log("\n--- Login Credentials ---");
    console.log("Super Admin: superadmin@college.edu / SuperAdmin@123");
    console.log("Admin: admin@college.edu / Admin@123");
    console.log("Student: student@college.edu / Student@123");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
