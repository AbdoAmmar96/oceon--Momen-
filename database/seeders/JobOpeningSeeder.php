<?php

namespace Database\Seeders;

use App\Models\JobOpening;
use Illuminate\Database\Seeder;

/**
 * Seeds one representative opening for each department carried over from the
 * old site (req #8): Finance, Operation, Human Resource, Logistic, Sales and
 * Information. All content is editable from the admin.
 */
class JobOpeningSeeder extends Seeder
{
    public function run(): void
    {
        $jobs = [
            [
                'department' => 'Finance',
                'title_en' => 'Accountant',
                'title_ar' => 'محاسب',
                'title_fr' => 'Comptable',
                'desc_en' => "Keep the numbers clean across trading, export and workshop operations.\n\n• Manage invoicing, reconciliations and monthly reporting.\n• Support export paperwork and supplier payments.\n• Work with international currencies and multi-country transactions.\n\nRequirements: accounting qualification, strong attention to detail, comfort with international transactions and ERP/accounting software.",
                'desc_ar' => "حافظ على دقة الأرقام عبر عمليات التجارة والتصدير والورشة.\n\n• إدارة الفواتير والتسويات والتقارير الشهرية.\n• دعم مستندات التصدير ومدفوعات الموردين.\n• التعامل مع العملات الدولية والمعاملات متعددة الدول.\n\nالمتطلبات: مؤهل محاسبي، دقة عالية في التفاصيل، إلمام بالمعاملات الدولية وبرامج المحاسبة/ERP.",
                'desc_fr' => "Gardez des comptes irréprochables sur le négoce, l'export et l'atelier.\n\n• Gérer la facturation, les rapprochements et le reporting mensuel.\n• Soutenir les documents d'export et les paiements fournisseurs.\n• Travailler avec des devises et des transactions multi-pays.\n\nProfil : diplôme en comptabilité, grand sens du détail, aisance avec les transactions internationales et les logiciels comptables/ERP.",
                'location' => 'Larnaca, Cyprus',
                'employment_type' => 'full_time',
                'sort' => 1,
            ],
            [
                'department' => 'Operation',
                'title_en' => 'Operations Coordinator',
                'title_ar' => 'منسّق عمليات',
                'title_fr' => 'Coordinateur des opérations',
                'desc_en' => "Keep every order moving smoothly from confirmation to delivery.\n\n• Coordinate between sales, technical, workshop and logistics teams.\n• Track order milestones, lead times and supplier commitments.\n• Flag risks early and keep clients informed.\n\nRequirements: strong organisation and communication skills, experience in operations or project coordination, ideally in trading or heavy equipment.",
                'desc_ar' => "حافظ على سير كل طلب بسلاسة من التأكيد حتى التسليم.\n\n• التنسيق بين فرق المبيعات والفني والورشة واللوجستيات.\n• متابعة مراحل الطلب ومدد التوريد والتزامات الموردين.\n• رصد المخاطر مبكرًا وإبقاء العملاء على اطلاع.\n\nالمتطلبات: مهارات تنظيم وتواصل قوية، خبرة في العمليات أو تنسيق المشاريع، ويفضّل في مجال التجارة أو المعدات الثقيلة.",
                'desc_fr' => "Assurez le bon déroulement de chaque commande, de la confirmation à la livraison.\n\n• Coordonner les équipes ventes, technique, atelier et logistique.\n• Suivre les jalons des commandes, les délais et les engagements fournisseurs.\n• Anticiper les risques et informer les clients.\n\nProfil : sens de l'organisation et de la communication, expérience en opérations ou coordination de projets, idéalement dans le négoce ou le matériel lourd.",
                'location' => 'Larnaca, Cyprus',
                'employment_type' => 'full_time',
                'sort' => 1,
            ],
            [
                'department' => 'Human Resource',
                'title_en' => 'HR & Recruitment Officer',
                'title_ar' => 'أخصائي موارد بشرية وتوظيف',
                'title_fr' => 'Chargé RH et recrutement',
                'desc_en' => "Grow and support the team behind the business.\n\n• Manage recruitment end-to-end — sourcing, screening and onboarding.\n• Maintain records, contracts and HR policies.\n• Support staff wellbeing and development across offices.\n\nRequirements: HR experience, excellent people skills, familiarity with recruitment tools and employment basics.",
                'desc_ar' => "طوّر وادعم الفريق الذي يقف خلف العمل.\n\n• إدارة التوظيف من البداية للنهاية — البحث والفرز والتعيين.\n• حفظ السجلات والعقود وسياسات الموارد البشرية.\n• دعم رفاهية الموظفين وتطويرهم عبر المكاتب.\n\nالمتطلبات: خبرة في الموارد البشرية، مهارات تواصل ممتازة، إلمام بأدوات التوظيف وأساسيات قانون العمل.",
                'desc_fr' => "Développez et accompagnez l'équipe derrière l'entreprise.\n\n• Gérer le recrutement de bout en bout — sourcing, sélection et intégration.\n• Tenir les dossiers, contrats et politiques RH.\n• Soutenir le bien-être et le développement des collaborateurs.\n\nProfil : expérience RH, excellent relationnel, maîtrise des outils de recrutement et des bases du droit du travail.",
                'location' => 'Larnaca, Cyprus',
                'employment_type' => 'full_time',
                'sort' => 1,
            ],
            [
                'department' => 'Logistic',
                'title_en' => 'Export & Logistics Coordinator',
                'title_ar' => 'منسّق تصدير ولوجستيات',
                'title_fr' => 'Coordinateur export & logistique',
                'desc_en' => "Move equipment across borders without surprises — documentation, freight and customs handled end-to-end.\n\n• Prepare export documentation and coordinate freight forwarders.\n• Manage customs clearance and shipping schedules.\n• Track shipments and keep clients updated to delivery.\n\nRequirements: experience in international logistics or freight forwarding, organised and detail-driven, familiar with Incoterms and export paperwork.",
                'desc_ar' => "نقل المعدات عبر الحدود بلا مفاجآت — المستندات والشحن والجمارك من الباب للباب.\n\n• إعداد مستندات التصدير والتنسيق مع شركات الشحن.\n• إدارة التخليص الجمركي وجداول الشحن.\n• متابعة الشحنات وإبقاء العملاء على اطلاع حتى التسليم.\n\nالمتطلبات: خبرة في اللوجستيات الدولية أو الشحن، منظّم ودقيق، وإلمام بمصطلحات Incoterms ومستندات التصدير.",
                'desc_fr' => "Acheminez le matériel à l'international sans surprises — documents, fret et douanes de bout en bout.\n\n• Préparer les documents d'export et coordonner les transitaires.\n• Gérer le dédouanement et les plannings d'expédition.\n• Suivre les expéditions et informer les clients jusqu'à la livraison.\n\nProfil : expérience en logistique internationale ou transit, organisé et rigoureux, connaissance des Incoterms et des documents d'export.",
                'location' => 'Larnaca, Cyprus',
                'employment_type' => 'full_time',
                'sort' => 1,
            ],
            [
                'department' => 'Sales',
                'title_en' => 'Sales Engineer — Drilling Equipment',
                'title_ar' => 'مهندس مبيعات — معدات الحفر',
                'title_fr' => 'Ingénieur commercial — Équipement de forage',
                'desc_en' => "Own client relationships across the Middle East, Africa and Europe, matching drilling rigs, pumps and spares to real site needs.\n\n• Prepare clear, competitive quotes and follow them to close.\n• Advise clients on compatibility, specifications and lead times.\n• Work with the technical and logistics teams from inquiry to delivery.\n\nRequirements: engineering or technical background, strong communication, and ideally experience with drilling or heavy equipment.",
                'desc_ar' => "إدارة علاقات العملاء عبر الشرق الأوسط وأفريقيا وأوروبا، ومطابقة الحفارات والمضخات وقطع الغيار مع احتياجات المواقع الفعلية.\n\n• إعداد عروض أسعار واضحة وتنافسية ومتابعتها حتى الإغلاق.\n• إرشاد العملاء حول التوافق والمواصفات ومدد التوريد.\n• العمل مع الفريقين الفني واللوجستي من الاستفسار حتى التسليم.\n\nالمتطلبات: خلفية هندسية أو فنية، مهارات تواصل قوية، ويفضّل خبرة في معدات الحفر أو المعدات الثقيلة.",
                'desc_fr' => "Gérez les relations clients au Moyen-Orient, en Afrique et en Europe, en associant foreuses, pompes et pièces aux besoins réels des chantiers.\n\n• Préparer des devis clairs et compétitifs et les suivre jusqu'à la conclusion.\n• Conseiller les clients sur la compatibilité, les spécifications et les délais.\n• Collaborer avec les équipes techniques et logistiques, de la demande à la livraison.\n\nProfil : formation technique ou en ingénierie, excellente communication, idéalement une expérience du matériel de forage.",
                'location' => 'Larnaca, Cyprus',
                'employment_type' => 'full_time',
                'sort' => 1,
            ],
            [
                'department' => 'Information',
                'title_en' => 'IT Support Specialist',
                'title_ar' => 'أخصائي دعم تقني (IT)',
                'title_fr' => 'Spécialiste support informatique',
                'desc_en' => "Keep our systems, website and data running reliably.\n\n• Support staff with hardware, software and network issues.\n• Maintain the company website, email and internal tools.\n• Help keep data secure and backed up.\n\nRequirements: IT support experience, solid troubleshooting skills, familiarity with web tools, networks and security basics.",
                'desc_ar' => "حافظ على تشغيل أنظمتنا وموقعنا وبياناتنا بموثوقية.\n\n• دعم الموظفين في مشكلات الأجهزة والبرامج والشبكات.\n• صيانة موقع الشركة والبريد والأدوات الداخلية.\n• المساعدة في تأمين البيانات وعمل نسخ احتياطية.\n\nالمتطلبات: خبرة في الدعم التقني، مهارات قوية في حل المشكلات، إلمام بأدوات الويب والشبكات وأساسيات الأمان.",
                'desc_fr' => "Assurez le bon fonctionnement de nos systèmes, du site web et des données.\n\n• Assister les collaborateurs sur le matériel, les logiciels et le réseau.\n• Maintenir le site web, la messagerie et les outils internes.\n• Contribuer à la sécurité et à la sauvegarde des données.\n\nProfil : expérience en support informatique, solides compétences de dépannage, maîtrise des outils web, des réseaux et des bases de la sécurité.",
                'location' => 'Larnaca, Cyprus',
                'employment_type' => 'full_time',
                'sort' => 1,
            ],
        ];

        foreach ($jobs as $j) {
            JobOpening::firstOrCreate(
                ['slug' => JobOpening::uniqueSlug($j['title_en'])],
                [
                    'title_en' => $j['title_en'],
                    'title_ar' => $j['title_ar'],
                    'title_fr' => $j['title_fr'],
                    'description_en' => $j['desc_en'],
                    'description_ar' => $j['desc_ar'],
                    'description_fr' => $j['desc_fr'],
                    'department' => $j['department'],
                    'location' => $j['location'],
                    'employment_type' => $j['employment_type'],
                    'is_open' => true,
                    'sort' => $j['sort'],
                ],
            );
        }
    }
}
