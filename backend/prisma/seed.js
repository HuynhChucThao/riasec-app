"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const prisma = new client_1.PrismaClient();
function parseCSV(filePath) {
    if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filePath}`);
        return [];
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length === 0)
        return [];
    const parseLine = (line) => {
        const result = [];
        let cur = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                if (inQuotes && line[i + 1] === '"') {
                    cur += '"';
                    i++;
                }
                else {
                    inQuotes = !inQuotes;
                }
            }
            else if (char === ',' && !inQuotes) {
                result.push(cur.trim());
                cur = '';
            }
            else {
                cur += char;
            }
        }
        result.push(cur.trim());
        return result;
    };
    const headers = parseLine(lines[0]);
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
        const values = parseLine(lines[i]);
        if (values.length >= headers.length) {
            const row = {};
            headers.forEach((h, idx) => {
                row[h] = values[idx] ?? '';
            });
            rows.push(row);
        }
    }
    return rows;
}
async function main() {
    console.log('--- Bắt đầu Seed Dữ Liệu RIASEC ---');
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('Admin@123', salt);
    const studentPassword = await bcrypt.hash('Student@123', salt);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@riasec.com' },
        update: {},
        create: {
            email: 'admin@riasec.com',
            password: adminPassword,
            name: 'Hệ Thống Admin',
            role: client_1.Role.ADMIN,
            status: client_1.Status.ACTIVE,
        },
    });
    console.log('Tạo tài khoản Admin:', admin.email);
    const student = await prisma.user.upsert({
        where: { email: 'student@riasec.com' },
        update: {},
        create: {
            email: 'student@riasec.com',
            password: studentPassword,
            name: 'Học Sinh Mẫu',
            role: client_1.Role.STUDENT,
            status: client_1.Status.ACTIVE,
            dreamWork: 'Software Engineer',
        },
    });
    console.log('Tạo tài khoản Student:', student.email);
    const assetsDir = path.resolve(__dirname, '../../RIASEC-AI-Career-Consultant/app/src/main/assets');
    const questionPath = path.join(assetsDir, 'riasec_question.csv');
    const questionsData = parseCSV(questionPath);
    console.log(`Đọc được ${questionsData.length} câu hỏi từ riasec_question.csv`);
    for (const q of questionsData) {
        if (!q.content || !q.type)
            continue;
        const existing = await prisma.question.findFirst({
            where: { content: q.content },
        });
        if (!existing) {
            await prisma.question.create({
                data: {
                    content: q.content,
                    type: q.type.toUpperCase(),
                },
            });
        }
    }
    console.log('Đã nạp xong câu hỏi khảo sát RIASEC.');
    const occupationPath = path.join(assetsDir, 'occupation.csv');
    const occupationsData = parseCSV(occupationPath);
    console.log(`Đọc được ${occupationsData.length} nghề nghiệp từ occupation.csv`);
    for (const o of occupationsData) {
        const id = parseInt(o.occupation_id);
        if (isNaN(id) || !o.job_name)
            continue;
        await prisma.occupation.upsert({
            where: { id },
            update: {
                jobName: o.job_name,
                description: o.description || null,
                riasecCode: o.riasec_code || '',
                mainCode: o.main_code || (o.riasec_code ? o.riasec_code[0] : 'R'),
                interestId: o.interest_id ? parseInt(o.interest_id) : null,
                education: o.education || null,
                taskRaw: o.tasks || null,
                skillsRaw: o.skills || null,
                imageName: o.image_name || null,
                viewCount: o.view_count ? parseInt(o.view_count) : 0,
            },
            create: {
                id,
                jobName: o.job_name,
                description: o.description || null,
                riasecCode: o.riasec_code || '',
                mainCode: o.main_code || (o.riasec_code ? o.riasec_code[0] : 'R'),
                interestId: o.interest_id ? parseInt(o.interest_id) : null,
                education: o.education || null,
                taskRaw: o.tasks || null,
                skillsRaw: o.skills || null,
                imageName: o.image_name || null,
                viewCount: o.view_count ? parseInt(o.view_count) : 0,
            },
        });
    }
    console.log('Đã nạp xong danh sách nghề nghiệp RIASEC.');
    console.log('--- Hoàn tất Seed Dữ Liệu! ---');
}
main()
    .catch((e) => {
    console.error('Lỗi khi seed dữ liệu:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map