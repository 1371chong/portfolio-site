import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// 회사소개서 PDF 다운로드 라우트
app.get('/download/company-profile.pdf', (req, res) => {
  try {
    const doc = new PDFDocument({ margin: 40, size: 'A4' });

    const filename = encodeURIComponent('정원복_비디오에디터_회사소개서.pdf');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="company_profile.pdf"; filename*=UTF-8''${filename}`);

    doc.pipe(res);

    // Header bar
    doc.rect(0, 0, 595, 110).fill('#1a1c23');
    
    doc.fillColor('#e74c3c').fontSize(11).text('COMPANY PROFILE & PORTFOLIO SUMMARY', 40, 30);
    doc.fillColor('#ffffff').fontSize(22).text('JEONG WEON BOG', 40, 48);
    doc.fillColor('#a0aec0').fontSize(11).text('Video Editor & Motion Graphic Designer', 40, 78);

    let y = 140;

    // Section 1: Overview
    doc.fillColor('#1a1c23').fontSize(13).text('1. Overview & Capability', 40, y);
    y += 22;
    doc.fillColor('#333333').fontSize(10).text(
      'Professional Video Editor & Motion Graphic Designer specializing in high-quality video production, 2D/3D motion graphics, YouTube editing, commercial CFs, and title sequences.',
      40, y, { width: 515, lineGap: 4 }
    );
    y += 45;

    // Section 2: Core Software Skills
    doc.fillColor('#1a1c23').fontSize(13).text('2. Core Software Skills', 40, y);
    y += 22;
    const skills = [
      '• Adobe Premiere Pro (90%) - Cuts, Multi-cam sync, Color Grading & Audio Mastering',
      '• Adobe After Effects (85%) - Motion Graphics, 2D/3D Tracking, VFX Composition',
      '• Adobe Photoshop (80%) - YouTube Branding, Thumbnails & Texture Composition',
      '• Adobe Illustrator (75%) - Vector Asset Creation for Motion Design',
      '• Adobe Media Encoder (90%) - Codec Optimization & Batch Rendering',
      '• Blender (70%) - 3D Object Modeling & Intro Sequence Animation'
    ];
    skills.forEach(skill => {
      doc.fillColor('#444444').fontSize(9.5).text(skill, 50, y);
      y += 17;
    });
    y += 15;

    // Section 3: Primary Services & Estimated Timelines
    doc.fillColor('#1a1c23').fontSize(13).text('3. Primary Services', 40, y);
    y += 22;
    const services = [
      '• YouTube & Social Content Editing (Est. 2 - 4 Days)',
      '• Brand CF & Commercial Motion Graphics (Est. 5 - 10 Days)',
      '• 3D Title Sequences & Intro Animations (Est. 3 - 7 Days)',
      '• Posters, Thumbnails & Detail Page Graphic Design (Est. 1 - 2 Days)'
    ];
    services.forEach(service => {
      doc.fillColor('#444444').fontSize(9.5).text(service, 50, y);
      y += 17;
    });
    y += 15;

    // Section 4: Workflow
    doc.fillColor('#1a1c23').fontSize(13).text('4. Standard Production Workflow', 40, y);
    y += 22;
    const workflow = [
      '1. Planning & Concept: Requirements analysis, storyboard, and tone/style setup.',
      '2. Rough Cut & Sync: Line-up creation, audio synchronization, and refined trimming.',
      '3. Motion & VFX: Subtitles, transitions, 3D tracking, and compositing.',
      '4. Review & Delivery: Platform-tailored codec rendering and final delivery.'
    ];
    workflow.forEach(step => {
      doc.fillColor('#444444').fontSize(9.5).text(step, 50, y);
      y += 17;
    });
    y += 15;

    // Section 5: Contact
    doc.fillColor('#1a1c23').fontSize(13).text('5. Contact & Portfolio Links', 40, y);
    y += 22;
    doc.fillColor('#444444').fontSize(9.5).text('• Email: chong04041@naver.com', 50, y);
    doc.fillColor('#444444').fontSize(9.5).text('• Phone: +82 10-3401-1371', 50, y + 17);
    doc.fillColor('#444444').fontSize(9.5).text('• Location: Chilgok-gun, Gyeongbuk, S.Korea (Remote work available)', 50, y + 34);

    // Footer
    doc.rect(0, 785, 595, 57).fill('#1a1c23');
    doc.fillColor('#ffffff').fontSize(9).text('© 2026 Jeong Weonbog. All Rights Reserved.', 40, 805, { align: 'center' });

    doc.end();
  } catch (err) {
    console.error('PDF Generation Error:', err);
    res.status(500).send('PDF generation failed');
  }
});

app.use(express.static(__dirname));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
