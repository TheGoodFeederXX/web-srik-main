import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create admin user
  const hashedPassword = await hash('admin123', 10);
  const admin = await prisma.admin.create({
    data: {
      email: 'admin@websrik.org',
      password: hashedPassword,
      name: 'Administrator',
    },
  });

  console.log('Created admin:', admin);

  // Create programs
  const programs = await prisma.program.createMany({
    data: [
      {
        title: "Kurikulum Akademik",
        description: "Kurikulum Standard Sekolah Rendah (KSSR) yang ditetapkan oleh Kementerian Pendidikan Malaysia dengan pendekatan pembelajaran bersepadu.",
        icon: "BookOpen",
        order: 1,
      },
      {
        title: "Kurikulum Diniah & KAFA",
        description: "Pengajian berdasarkan kurikulum yang ditetapkan oleh JAKIM dan Jabatan Hal Ehwal Islam Negeri Kedah untuk membentuk asas keagamaan yang komprehensif.",
        icon: "GraduationCap",
        order: 2,
      },
      {
        title: "Pembangunan Sahsiah",
        description: "Program pembentukan akhlak dan jati diri melalui aktiviti kerohanian, kepimpinan, dan khidmat masyarakat.",
        icon: "Heart",
        order: 3,
      },
    ],
  });

  console.log('Created programs:', programs);

  // Create contact information
  const contacts = await prisma.contact.createMany({
    data: [
      {
        type: "address",
        value: "Jalan Pedu, 06300 Kuala Nerang, Kedah",
        icon: "MapPin",
      },
      {
        type: "phone",
        value: "04-786 9582",
        icon: "Phone",
      },
      {
        type: "email",
        value: "srialkhairiah@gmail.com",
        icon: "Mail",
      },
    ],
  });

  console.log('Created contacts:', contacts);

  // Create social media links
  const socialMedia = await prisma.socialMedia.createMany({
    data: [
      {
        platform: "facebook",
        url: "https://facebook.com/srialkhairiahofficial",
        icon: "Facebook",
        color: "bg-blue-500",
      },
      {
        platform: "instagram",
        url: "https://instagram.com/srialkhairiah",
        icon: "Instagram",
        color: "bg-pink-600",
      },
      {
        platform: "tiktok",
        url: "https://tiktok.com/@srialkhairiah18",
        icon: "TikTok",
        color: "bg-black",
      },
    ],
  });

  console.log('Created social media:', socialMedia);

  // Create initial posts
  const posts = await prisma.post.createMany({
    data: [
      {
        title: 'Selamat Datang di SRIK',
        excerpt: 'Sekolah Rendah Islam Kuantan menawarkan pendidikan Islam berkualiti tinggi.',
        content: `# Selamat Datang di SRIK

Sekolah Rendah Islam Kuantan (SRIK) adalah sebuah institusi pendidikan Islam yang komited untuk memberikan pendidikan berkualiti tinggi kepada anak-anak kita.

## Visi Kami

Menjadi institusi pendidikan Islam terunggul yang melahirkan generasi berilmu, berakhlak mulia dan berdaya saing.

## Misi Kami

- Menyediakan pendidikan Islam berkualiti
- Membentuk akhlak dan sahsiah pelajar
- Melahirkan generasi hafiz dan hafizah
- Memupuk semangat kepimpinan
- Mengembangkan bakat dan potensi pelajar`,
        status: 'published',
      },
      {
        title: "Program Tahfiz Al-Quran",
        excerpt: "Program hafazan Al-Quran untuk pelajar yang berminat menghafaz Al-Quran dengan bimbingan guru tahfiz yang berkelayakan.",
        content: `# Program Tahfiz Al-Quran

Program Tahfiz Al-Quran di Sekolah Rendah Islam Al-Khairiah bertujuan untuk melahirkan generasi huffaz yang berakhlak mulia dan cemerlang dalam akademik. Program ini dikendalikan oleh guru-guru tahfiz yang berkelayakan dan berpengalaman dalam bidang hafazan Al-Quran.

## Objektif Program

1. Melahirkan generasi huffaz yang berkualiti
2. Membentuk sahsiah dan akhlak pelajar melalui penghayatan Al-Quran
3. Memupuk disiplin dan kecemerlangan akademik

## Kaedah Pembelajaran

- Kelas tahfiz dijalankan secara intensif setiap hari
- Penggunaan teknik hafazan yang berkesan dan sistematik
- Pemantauan berkala kemajuan hafazan
- Kelas tajwid dan tafsir Al-Quran`,
        status: "published",
      },
      {
        title: "Program Bahasa Arab",
        excerpt: "Program pembelajaran Bahasa Arab untuk meningkatkan kemahiran berbahasa Arab dalam kalangan pelajar.",
        content: `# Program Bahasa Arab

Program Bahasa Arab di Sekolah Rendah Islam Al-Khairiah menekankan penguasaan bahasa Arab secara menyeluruh meliputi kemahiran mendengar, bertutur, membaca dan menulis.

## Pendekatan Pembelajaran

1. Pembelajaran interaktif dalam bahasa Arab
2. Aktiviti lakonan dan bercerita
3. Latihan penulisan kreatif
4. Pertandingan bahasa Arab

## Manfaat Program

- Memudahkan pemahaman Al-Quran dan Hadith
- Meningkatkan keyakinan diri dalam berkomunikasi
- Membuka peluang pendidikan tinggi dalam bidang pengajian Islam`,
        status: "published",
      }
    ],
  });

  console.log('Created posts:', posts);

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
